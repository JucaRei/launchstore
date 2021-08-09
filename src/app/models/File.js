const db = require("../../config/db");
const fs = require("fs");

module.exports = {
  create({ filename, path, product_id }) {
    const query = `
      INSERT INTO files (
        name,
        path,
        product_id
      ) VALUES ($1, $2, $3)
      RETURNING id
    `;

    const values = [filename, path, product_id];

    return db.query(query, values);
  },
  find(id) {
    return db.query("Select * FROM products WHERE id = $1", [id]);
  },
  update(data) {
    const query = `
      UPDATE products SET
        category_id=($1),
        user_id=($2),
        name=($3),
        description=($4),
        old_price=($5),
        price=($6),
        quantity=($7),
        status=($8)
      WHERE id = $9
    `;

    const values = [
      data.category_id,
      data.user_id,
      data.name,
      data.description,
      data.old_price,
      data.price,
      data.quantity,
      data.status,
      data.id,
    ];

    return db.query(query, values);
  },
  async delete(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = result.rows[0];

      // deletar também da pasta public
      fs.unlinkSync(file.path);

      return db.query(`DELETE FROM files WHERE id = $1`, [id]);
    } catch (err) {
      console.log(err);
    }
  },
};
