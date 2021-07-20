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

    console.log('Testando o Format')

    // formatar pra real
    return (value = new Intl.NumberFormat("pt-BR", {
      style: "currency", // 1.000,00
      currency: "BRL", // R$
    }).format(value / 100));
  },
};
