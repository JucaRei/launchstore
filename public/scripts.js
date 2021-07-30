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
  uploudLimit: 6,
  preview: document.querySelector("#photos-preview"),
  handleFileInput(event) {
    const { files: fileList } = event.target;

    if (PhotosUpload.hasLimit(event)) return;

    // aplicar as funcionalidades de array no FileList
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image(); // <img />
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(div);
      };

      reader.readAsDataURL(file);
    });
  },
  hasLimit(event) {
    const { uploudLimit } = PhotosUpload;
    const { files: fileList } = event.target;

    if (fileList.length > uploudLimit) {
      alert(`Envie no máximo ${uploudLimit} fotos`);
      event.preventDefault(); //bloquea o evento
      return true;
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
  getRemoveButton() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "close";
    return button;
  },
  removePhoto() {
    const photoDiv = event.target.parentNode;
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    photoDiv.remove();
  },
};
