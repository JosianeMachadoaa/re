lozad().observe();

lozad('.lozad', {
  load: function(target) {
    target.src = target.dataset.src;
    target.onload = function() {
        target.classList.add('fadein');
    }
  }
}).observe();

function viewSenha(tipo) {
  var tipo = document.getElementById(tipo);
  if (tipo.type == "password") {
    tipo.type = "text";
  }else{
    tipo.type = "password";
  }
}