const Mask = {
  apply(input, func) {
    setTimeout(function () {
      input.value = Mask[func](input.value); //Mask.formatBRL
    }, 1);
  },
  formatBRL(value) {
    // tirar as letras, somente números
    // 180,23 -> 18023 / 100 > 180.23
    value = value.replace(/\D/g, "");

    console.log("Testando o Format");

    // formatar pra real
    return (value = new Intl.NumberFormat("pt-BR", {
      style: "currency", // 1.000,00
      currency: "BRL", // R$
    }).format(value / 100));
  },
};

const PhotosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploudLimit: 6,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target

    if (PhotosUpload.hasLimit(event)) return;

    // aplicar as funcionalidades de array no FileList
    Array.from(fileList).forEach((file) => {

      PhotosUpload.files.push(file);

      const reader = new FileReader(); //ler arquivos

      reader.onload = () => {
        const image = new Image(); // <img />
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(div);
      };

      reader.readAsDataURL(file);
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles()

  },
  hasLimit(event) {
    const { uploudLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input

    if (fileList.length > uploudLimit) {
      alert(`Envie no máximo ${uploudLimit} fotos`);
      event.preventDefault(); //bloquea o evento
      return true;
    }

    const photosDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList == "photo") {
        photosDiv.push(item)
      }
    })

    const totalPhotos = fileList.length + photosDiv.length
    if(totalPhotos > uploudLimit) {
      alert("Você atingiu o limite máximo de fotos")
      event.preventDefault()
      return true
    }

    return false;
  },
  getContainer(image) {
    const div = document.createElement("div");
    div.classList.add("photo");

    div.onclick = PhotosUpload.removePhoto;

    div.appendChild(image);

    div.appendChild(PhotosUpload.getRemoveButton());

    return div;
  },
  getAllFiles() {
    // Antigamente o firefox não tinha o DataTransfer (new ClipboardEvent("").clipboardData || )
    const dataTranfer = new DataTransfer()

    PhotosUpload.files.forEach(file => dataTranfer.items.add(file))

    return dataTranfer.files
  },
  getRemoveButton() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "delete_forever";
    return button;
  },
  removePhoto() {
    const photoDiv = event.target.parentNode; // <div class="photo">
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()

    photoDiv.remove();
  },
  removeOldPhoto(event){
    const photoDiv = event.target.parentNode

    if(photoDiv.id) {
      const removedFiles = document.querySelector("input[name='removed_files']")
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`  // 1,2,3
      }
    }

    photoDiv.remove()
  },
};

