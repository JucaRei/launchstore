const { formatPrice, date } = require("../../lib/utils");

const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");

module.exports = {
  create(req, res) {
    // Pegar Categorias (Promisses)
    Category.all()
      .then(function (results) {
        const categories = results.rows;

        return res.render("products/create.njk", { categories });
      })
      .catch(function (err) {
        throw new Error(err);
      });
  },
  async show(req, res) {
    let results = await Product.find(req.params.id);
    const product = results.rows[0];

    if (!product) return res.send("Product Not Found!");

    // horário
    const { day, hour, minutes, month } = date(product.updated_at);
    product.published = {
      day: `${day}/${month}`,
      hour: `${hour}h${minutes}`,
    };

    // Preço
    product.oldPrice = formatPrice(product.old_price);
    product.price = formatPrice(product.price);

    results = await Product.files(product.id)
    // imagens
    const files = results.rows.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
    }))

    return res.render("products/show", { product, files });
  },
  async post(req, res) {
    // Lógica de Salvar

    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields!");
      }
    }

    // verifica se tem imagens
    if (req.files.length == 0) {
      return res.send("Please, send at least one image.");
    }

    let results = await Product.create(req.body);
    const productId = results.rows[0].id;

    const filesPromise = req.files.map((file) =>
      File.create({ ...file, product_id: productId })
    );

    // espera todas as promessas serem executadas
    await Promise.all(filesPromise);

    return res.redirect(`/products/${productId}/edit`);
  },
  async edit(req, res) {
    let results = await Product.find(req.params.id);
    const product = results.rows[0];

    if (!product) return res.send("Product not found.");

    product.old_price = formatPrice(product.old_price);
    product.price = formatPrice(product.price);

    // get Categories
    results = await Category.all();
    const categories = results.rows;

    // get Images
    results = await Product.files(product.id);
    let files = results.rows;
    // Pegar o endereço completo da imagem
    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("products/edit.njk", { product, categories, files });
  },
  async put(req, res) {
    // Verifica se tudo está preenchido
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.send("Please, fill all fields!");
      }
    }

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map((file) =>
        File.create({ ...file, product_id: req.body.id })
      );

      await Promise.all(newFilesPromise);
    }

    if (req.body.removed_files) {
      // 1,2,3
      const removedFiles = req.body.removed_files.split(","); // [,1,2,3,]
      // tirar a virgula
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1); // [1,2,3]

      const removedFilesPromise = removedFiles.map((id) => File.delete(id));

      await Promise.all(removedFilesPromise);
    }

    // tirar a formatação e mandar o número limpo
    req.body.price = req.body.price.replace(/\D/g, "");

    // Manter preço antigo
    if (req.body.old_price != req.body.price) {
      const oldProduct = await Product.find(req.body.id);

      req.body.old_price = oldProduct.rows[0].price;
    }

    await Product.update(req.body);

    return res.redirect(`/products/${req.body.id}`);
  },
  async delete(req, res) {
    await Product.delete(req.body.id);

    return res.redirect("/products/create");
  },
};
