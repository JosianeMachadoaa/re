let dadosAPI = null;

const btnAbrirModal = document.getElementById('btnAbrirModal');
const textoLocal = document.getElementById('textoLocal');
const inputEstado = document.getElementById('input-estado');
const inputCidade = document.getElementById('input-cidade');

// Estado/cidade salvos
const estadoSalvo = sessionStorage.getItem('loca-estado');
const cidadeSalva = sessionStorage.getItem('loca-cidade');

if (estadoSalvo && cidadeSalva) {
  textoLocal.textContent = `${cidadeSalva}, ${estadoSalvo}`;
  btnAbrirModal.className = 'btn-select-loca';
}

// Abrir modal → carregar dados se necessário
btnAbrirModal.addEventListener('click', () => {
  if (!dadosAPI) {
    const url = `https://sis.ingressodigital.com/ws/site/listacidadesgeneros.asp?key=a7b3c02j983bpakm30sk2aspow&gc=s`;

    fetch(url)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const decoded = new TextDecoder('iso-8859-1').decode(buffer);
        dadosAPI = JSON.parse(decoded);
        preencherEstados(dadosAPI.Cidades);
        selecionarPrimeiroEstado();
      })
      .catch(error => console.error('Erro ao carregar cidades:', error));
  }
});

// Preencher lista de estados
function preencherEstados(cidades) {
  const estadosUnicos = [...new Set(cidades.map(c => c.Estado))];
  const lista = document.getElementById('listaEstados');
  lista.innerHTML = '';

  estadosUnicos.forEach(estado => {
    const div = document.createElement('div');
    div.className = 'estado-item';
    div.dataset.value = estado;
    div.textContent = escreverEstado(estado);
    div.onclick = () => selecionarEstado(div);
    lista.appendChild(div);
  });
}

// Traduz siglas para nomes
function escreverEstado(sigla) {
  const estados = { AC:"Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará", DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão", MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais", PA: "Pará", PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro", RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima", SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins", EX: "Estrangeiro",
  };
  return estados[sigla] || sigla;
}

// Quando clica em um estado
function selecionarEstado(element) {
  document.querySelectorAll(".loca-estado .estado-item").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  atualizarOpcoes();
}

// Atualiza as cidades com base no estado selecionado
function atualizarOpcoes() {
  const estadoSelecionado = document.querySelector(".loca-estado .selected")?.dataset.value;
  const cidadeContainer = document.getElementById("listaCidades");
  cidadeContainer.innerHTML = '';

  if (estadoSelecionado) {
    inputEstado.value = estadoSelecionado;

    const cidadesFiltradas = dadosAPI.Cidades.filter(c => c.Estado === estadoSelecionado);

    if (cidadesFiltradas.length === 0) {
      cidadeContainer.innerHTML = '<div class="cidade-item">Nenhuma cidade encontrada</div>';
      return;
    }

    cidadesFiltradas.forEach((cidade, index) => {
      const div = document.createElement("div");
      div.className = "cidade-item";
      div.dataset.value = cidade.Cidade;
      div.textContent = cidade.Cidade;
      div.onclick = () => selecionarCidade(div);
      cidadeContainer.appendChild(div);

      if (index === 0) {
        selecionarCidade(div);
      }
    });
  } else {
    cidadeContainer.innerHTML = '<div class="cidade-item">Selecione um estado primeiro</div>';
  }
}

// Seleciona uma cidade
function selecionarCidade(element) {
  document.querySelectorAll(".loca-cidade .cidade-item").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  inputCidade.value = element.dataset.value;
}

// Auto-selecionar o primeiro estado
function selecionarPrimeiroEstado() {
  const primeiroEstado = document.querySelector(".loca-estado .estado-item");
  if (primeiroEstado) {
    selecionarEstado(primeiroEstado);
  }
}

// Envio do formulário
document.getElementById("formLocalizacao").addEventListener("submit", (e) => {
  //e.preventDefault();

  const estado = inputEstado.value;
  const cidade = inputCidade.value;

  if (!estado || !cidade) {
    alert('Selecione estado e cidade.');
    return;
  }

  sessionStorage.setItem("loca-estado", estado);
  sessionStorage.setItem("loca-cidade", cidade);

  textoLocal.textContent = `${cidade}, ${estado}`;
  btnAbrirModal.className = 'btn-select-loca';

});
