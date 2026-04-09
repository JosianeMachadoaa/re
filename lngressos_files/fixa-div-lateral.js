$(window).on("load resize scroll", function () {
  const $divFixa = $("#div-fixa");
  const $divConteudo = $("#contedo-rolagem");
  //const alturaDivFixa = $divFixa.outerHeight(true);
  const alturaDivFixa = $divFixa.outerHeight(true);

  function atualizarPosicao() {
    if ($(window).width() >= 992) {
      const scrollTop = $(window).scrollTop();
      const limiteSuperior = $divConteudo.offset()?.top || $divConteudo.position().top;
      const limiteInferior = limiteSuperior + $divConteudo.outerHeight(true) - alturaDivFixa;

      if (scrollTop > limiteSuperior && scrollTop < limiteInferior) {
        $divFixa.css({
          'position': 'fixed',
          'top': '40px',
          //'width': '100%',
        });
      } else if (scrollTop >= limiteInferior) {
        $divFixa.css({
          'position': 'absolute',
          'top': limiteInferior - limiteSuperior + 'px',
          //'width': '100%',
        });
      } else {
        $divFixa.css({
          'position': 'static'
        });
      }
    } else {
      $divFixa.css({
        'position': 'static'
      });
    }
  }

  atualizarPosicao();
});