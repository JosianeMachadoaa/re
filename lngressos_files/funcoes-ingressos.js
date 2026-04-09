quanti = [];

function checaMesa(value, ite_cod, max_comp){
  campo_m = "plus_"+ite_cod +"_"+ max_comp;
  value2 = value.split(',');
  assento_m = value2[1];

  document.getElementById('qtde'+ite_cod).value="0";
  document.getElementById("add"+ite_cod).disabled = false;
  document.getElementById('add'+ite_cod).onclick= function() {
    setQtt(campo_m,assento_m,0);
  };

  let nome_ingresso = document.querySelector("#nome_setor_lote"+ite_cod).value;
  let val = Number(parseFloat(document.querySelector("#valor"+ite_cod).value));
  let tax = parseFloat(document.querySelector("#taxa_adm"+ite_cod).value);
  let qtd = parseInt(document.querySelector("#qtde"+ite_cod).value);
  let result = val + tax;

  if(assento_m == undefined) {
    document.querySelector("#qtde"+ite_cod).value = 0;
    //document.getElementById("val-indi"+ite_cod).innerHTML = "0,00";
    qtd--;
    //result = (val + tax) * qtd;
    result = result * qtd;

    const index = quanti.indexOf(ite_cod);
    if (index > -1) {
      quanti.splice(index, 1);
    }

    atualizaListaIngressos(ite_cod, nome_ingresso, qtd, result);
    atualizaTotal();
    botaoCompra();
  } else {

    document.querySelector("#qtde"+ite_cod).value = 1;
    qtd++;

    quanti.push(ite_cod);

    //result = (val + tax) * qtd;
    result = result * qtd;

    atualizaListaIngressos(ite_cod, nome_ingresso, qtd, result);
    atualizaTotal();
    botaoCompra();
 
    //document.getElementById("val-indi"+ite_cod).innerHTML = result.toLocaleString('pt-br', {minimumFractionDigits: 2});
  }

  quantMaxMesa(ite_cod, assento_m);
}

function atualizaTotal() {
  var valortotalfinal = 0;
  $('.input-value').each(function(i, e) {
    var quantidade = $(this).val();
    var identificador = $(this).attr('name');

    if(parseFloat(quantidade) > 0) {
      var valor = parseFloat(quantidade) * parseFloat($('#valorTot' + identificador).val());
      valortotalfinal += parseFloat(valor);
    }

    document.getElementById("mostraquantidade").innerHTML = valortotalfinal.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  })
}

function quantMaxMesa(ite_cod, assento_m) {
  let mesa = document.querySelector(`#assento_m${ite_cod}`);
  mesa.value = assento_m;
  atualizaTotal();
};

qtd_max = Number(document.querySelector("#maxCpf").value); 
limiCpf = document.querySelector("#limi-cpf").value;

function setQtt(id, max){
  if(max === undefined){
    max = 99;
  }

  item = "";
  inputValue = "";
  item = id.split('_');
  let qtd = parseInt(document.querySelector("#qtde"+item[1]).value);
  let val = Number(parseFloat(document.querySelector("#valor"+item[1]).value));
  let mosTax = document.querySelector("#eve_mostra_taxa"+item[1]).value;
  let tax = parseFloat(document.querySelector("#taxa_adm"+item[1]).value);
  let lot_qtde_max = parseInt(document.querySelector("#lot_qtde_max"+item[1]).value);
  let lot_qtde_min = parseInt(document.querySelector("#lot_qtde_min"+item[1]).value);
  let nome_ingresso = document.querySelector("#nome_setor_lote"+item[1]).value;
  //let listaResumo = [];

  if(mosTax == "N"){ tax = 0 };
  if(lot_qtde_max > 0) { max = lot_qtde_max };

  if(lot_qtde_min > 0 && qtd == 0) {
    qtd = lot_qtde_min - 1;
  }
  
  switch(item[0]){
    case "minus":
      if(qtd > 0){
        document.getElementById("add"+item[1]).disabled = false;
        qtd--;

        const index = quanti.indexOf(item[1]);
        if (index > -1) {
          quanti.splice(index, 1);
        }

        if(qtd == lot_qtde_min - 1) {
          qtd = 0;
        }

        if(qtd == 0){
          document.getElementById("menos"+item[1]).disabled = true;
        }

        result = (val + tax) * qtd;
        //document.getElementById("val-indi"+item[1]).innerHTML = result.toLocaleString('pt-br', {minimumFractionDigits: 2});;

        broqueia(false, item[1], limiCpf);

        document.getElementById("qtde"+item[1]).value = qtd; 

        atualizaListaIngressos(item[1], nome_ingresso, qtd, result);
        atualizaTotal();
        botaoCompra();

      }
    break;
    default:
      if(qtd < Number(max)){
        document.getElementById("menos"+item[1]).disabled = false;
        qtd++;
        quanti.push(item[1]);

        if(qtd == max){
          document.getElementById("add"+item[1]).disabled = true;  
        }
      
        result = (val + tax) * qtd;
        //document.getElementById("val-indi"+item[1]).innerHTML = result.toLocaleString('pt-br', {minimumFractionDigits: 2});;

        if(qtd == qtd_max) {
          broqueia(true, item[1], limiCpf);
        }

        if(qtd_max != 0) {
          if(quanti.length == Number(max)) {
            broqueia(true, item[1], limiCpf);

            fqua = quanti.length;
            for(i = 0; i < fqua; i++) {
              document.getElementById("menos"+quanti[i]).disabled = false; 
            }
          }
        }

        document.getElementById("qtde"+item[1]).value = qtd;

        atualizaListaIngressos(item[1], nome_ingresso, qtd, result);
        atualizaTotal();
        botaoCompra();
       
      }
    break;
  }
}

function atualizaListaIngressos(id, nome, qtd, valor) {
  const ticketList = document.getElementById('ticket-list');

  // Verifica se o item já existe na lista
  let existingItem = document.querySelector(`#item-${id}`);

  if (qtd > 0) {
    if (existingItem) {
      // Atualiza o item existente
      existingItem.querySelector('.item-quantity').textContent = `${qtd}x`;
      existingItem.querySelector('.item-value').textContent = `R$${valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    } else {
      // Adiciona novo item à lista
      const li = document.createElement('li');
      li.id = `item-${id}`;
      li.innerHTML = `
        <div class="ajuste-cont-resu">
          <span><span class="item-quantity">${qtd}x</span> - ${nome}</span>
          <span class="item-value">R$${valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>`;
      ticketList.appendChild(li);
    }
  } else if (existingItem) {
    // Remove o item se a quantidade for 0
    ticketList.removeChild(existingItem);
  }
}

function botaoCompra() {
  let q = quanti.length;
  let btn = document.getElementById("btn-proxima-etapa");

  //console.log(quanti);

  if(q == 0) {
    btn.disabled = true;
    btn.classList.add('desativar-btn');
    btn.innerHTML = 'Selecione um ingresso';

  } else {
    btn.disabled = false;
    btn.classList.remove('desativar-btn');
    btn.innerHTML = 'Continuar compra';
  }
}

function broqueia(d, q, l) {
  fLen = setores.length;

  if(l != 0){
    if(d == true) {
      for(i = 0; i < fLen; i++) {
        document.getElementById("add"+setores[i]).disabled = true;
        if(q != setores[i]) {
          document.getElementById("menos"+setores[i]).disabled = true;
        }
      };
    } else {
      for(i = 0; i < fLen; i++) {  
        if(Number(document.getElementById("qtde"+setores[i]).value) <= qtd_max) {
          document.getElementById("add"+setores[i]).disabled = false;
        }
      };
    }
  }
}

function validFormIng(frm) {
  if(frm.link_termo_resp != null){
    if(frm.termo_resp.checked == false){
      alert('SIT-ZR694402 : É necessário aprovar o termo de aceitação.');
      return false;
    }
  }

  if(frm.forma_entrega.value == ""){
    alert('SIT-MW701511 : É obrigatório selecionar uma forma de entrega.');
    return false;
  }
}