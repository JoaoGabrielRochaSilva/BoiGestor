/* 
    Aqui ficam as funções que mexem com a interface (criação de elementos dinamicamente e animações)
*/

// Redimensiona o Menu para melhor responsividade
function redimensionarMenu() {
    if (window.innerWidth <= 850) {
        $(".span-menu").hide();
        $("header").css("width", "100%");
        $("#cabeçalho > img").css("width", "10%");
        $("#titulo, h1").show();
        $("#titulo > h2").hide();
        $(".left, .right").hide();
    } else {
        $(".left, .right").show();
        $("#titulo > h2").show();
        if ($("#seta").hasClass("right")) {
            $("#seta").removeClass("right");
            $("#seta").addClass("left");
            encolherMenu($("#seta").get(0));
        } else {
            $("#seta").removeClass("left");
            $("#seta").addClass("right");
            encolherMenu($("#seta").get(0));
        }
    }
}

// Monta diferentes tipos de tabela
function montarTabela(tipo, htmlheader) {
    let tabela;
    let divTable = document.createElement("div"); // Cria a div que vai receber a tabela
    let header = document.createElement("div"); // Cria a div que vai receber o header e a tabela
    header.innerHTML = htmlheader;

    // Tabela Painel e Animais
    if (tipo == 1) {
        tabela = "<table> <thead> <tr>  <th>ID</th> <th>NOME</th> <th>RAÇA</th> <th>TIPO</th> <th>PESO</th> <th>VACINA</th> </tr> </thead> <tbody>";
  
        for(let i=0; i < bois.length; i++) {
            tabela += `<tr> <td>#${bois[i].ID}</td> <td>${bois[i].nome}</td>  <td>${bois[i].raca}</td> <td><span class="span-cinza">${bois[i].tipo}</span></td> <td>${bois[i].peso} Kg</td>`;

            if (bois[i].vacina == "Em dia")
                tabela += `<td><span class="span-verde">${bois[i].vacina}</span></td> </tr>`;
            else if (bois[i].vacina == "Atrasada")
                tabela += `<td><span class="span-vermelho">${bois[i].vacina}</span></td> </tr>`;
            else if (bois[i].vacina == "Pendente")
                tabela += `<td><span class="span-laranja">${bois[i].vacina}</span></td> </tr>`;
        }
    } else if (tipo == 2) { // Tabela Relatório
        tabela = "<table> <thead> <tr> <th>NOME</th> <th>ID</th> <th>RAÇA</th> <th>ALIMENTAÇÂO</th> <th>PRODUÇÂO</th> </tr> </thead> <tbody>";
  
        for(let i=0; i < bois.length; i++) {
            tabela += `<tr> <td>${bois[i].nome}</td> <td>#${bois[i].ID}</td> <td>${bois[i].raca}</td>`;
            
            if (bois[i].alimentacao == "Normal")
                tabela += `<td><span class="span-cinza">${bois[i].alimentacao}</span></td>`;
            else if (bois[i].alimentacao == "Acima do Normal")
                tabela += `<td><span class="span-verde">${bois[i].alimentacao}</span></td>`;
            else if (bois[i].alimentacao == "Abaixo do Normal")
                tabela += `<td><span class="span-vermelho">${bois[i].alimentacao}</span></td>`;

            if (bois[i].producao == "Normal")
                tabela += `<td><span class="span-cinza">${bois[i].producao}</span></td> </tr>`;
            else if (bois[i].producao == "Acima do Normal")
                tabela += `<td><span class="span-verde">${bois[i].producao}</span></td> </tr>`;
            else if (bois[i].producao == "Abaixo do Normal")
                tabela += `<td><span class="span-vermelho">${bois[i].producao}</span></td> </tr>`;
        }    
    } else if (tipo == 3) { // Tabela Vacinação
        tabela = "<table> <thead> <tr> <th>NOME</th> <th>ID</th> <th>RAÇA</th> <th>TIPO</th> <th>STATUS VACINA</th> </tr> </thead> <tbody>";
  
        for(let i=0; i < bois.length; i++) {
            tabela += `<tr> <td>${bois[i].nome}</td> <td>#${bois[i].ID}</td> <td>${bois[i].raca}</td> <td>${bois[i].tipo}</td>`;

            if (bois[i].vacina == "Em dia")
                tabela += `<td><span class="span-verde">${bois[i].vacina}</span></td> </tr>`;
            else if (bois[i].vacina == "Atrasada")
                tabela += `<td><span class="span-vermelho">${bois[i].vacina}</span></td> </tr>`;
            else if (bois[i].vacina == "Pendente")
                tabela += `<td><span class="span-laranja">${bois[i].vacina}</span></td> </tr>`;
        }      
    }

    divTable.innerHTML += tabela;
    header.appendChild(divTable);
    header.setAttribute("class", "divtable");
    return header;
}

// Resumo vacinação
function montarResumoVacina() {
    let divResumo = document.getElementById("resumoVacinação");
    divResumo.innerHTML = ""; // Limpa a div do resumo para sempre atualizar os dados

    // Cria a div com a quantidade de vacinas em dia
    let divEmdia = document.createElement("div");
    divEmdia.innerHTML = `<p><span style="color: #40AC67; background-color: #E9F6EE"><i class="fa-regular fa-circle-check"></i></span><section><h1>${contVacinaemDia()}</h1><p>Em dia</p></section></p>`;

    // Cria a div com a quantidade de vacinas atrasadas
    let divAtrasada = document.createElement("div");
    divAtrasada.innerHTML = `<p><span style="color: #DC2828; background-color: #FBE9E9"><i class="fa-solid fa-triangle-exclamation"></i></span><section><h1>${contVacinaAtrasada()}</h1><p>Atrasadas</p></section></p>`;

    // Cria a div com a quantidade de vacinas Pendentes
    let divPendente = document.createElement("div");
    divPendente.innerHTML = `<p><span style="color: #F59F0A; background-color: #FDECCE"><i class="fa-regular fa-clock"></i></span><section><h1>${contVacinaPendente()}</h1><p>Pendentes</p></section></p>`;

    // Adiciona todas as divs acima ao resumo vacinação
    divResumo.appendChild(divEmdia);
    aparecerAnimado(divEmdia);
    divResumo.appendChild(divAtrasada);
    aparecerAnimado(divAtrasada);
    divResumo.appendChild(divPendente);
    aparecerAnimado(divPendente);
}

// Resumo Geral do Painel
function montarResumoGeral() {
    let divResumo = document.getElementById("visaoGeral");
    divResumo.innerHTML = ""; // Limpa a div do resumo para sempre atualizar os dados

    // Cria a div que contem a quantidade total de animais no rebanho
    let divTotal = document.createElement("div");
    divTotal.innerHTML = `<p>Total de Animais <span style="color: #27684A; background-color: #E9F0ED"><i class="fa-solid fa-cow"></i> </span></p> <h1>${bois.length}</h1>`;

    // Cria a div contendo o peso médio do rebanho
    let divPeso = document.createElement("div");
    divPeso.innerHTML = `<p>Peso Médio <span style="color: #493204; background-color: #FCEFD5"><i class="fa-solid fa-arrow-trend-up"></i> </span></p> <h1>${calcPesoMédio()} Kg</h1>`;

    // Cria a div contendo a quantidade de vacinas em dia do rebanho
    let divVacina = document.createElement("div");
    divVacina.innerHTML = `<p>Vacinas em Dia <span style="color: #38A961; background-color: #E9F6EE"><i class="fa-solid fa-syringe"></i></span></p> <h1>${contVacinaemDia()}</h1>`

    // Cria a div contendo a quantidade de alertas
    let divAlertas = document.createElement("div");
    divAlertas.innerHTML = `<p>Alertas <span style="color: #F59F0A; background-color: #FDECCE"><i class="fa-solid fa-triangle-exclamation"></i></span></p> <h1>${contVacinaAlerta()}</h1>`

    // Adiciona as divs acima na visão geral do painel
    divResumo.appendChild(divTotal);
    aparecerAnimado(divTotal)
    divResumo.appendChild(divPeso);
    aparecerAnimado(divPeso);
    divResumo.appendChild(divVacina);
    aparecerAnimado(divVacina);
    divResumo.appendChild(divAlertas);
    aparecerAnimado(divAlertas); 
    
}

// Função que encolhe ou alonga o menu
function encolherMenu(bot) {
    // Elementos que serão modificados
    let header = $("header");
    let logo = $("#cabeçalho > img");
    let body = $("body");
    let titulo = $("#titulo");
    let spanMenu = $(".span-menu");
    let nav = $("nav");
    
    // Encolher menu
    if (bot.classList[0] == `left`) {
        body.css("grid-template-columns", "5% 95%");
        header.css("width", "5%");

        spanMenu.hide(); // Esconde as palavras do menu
        titulo.hide(); // Esconde o titulo
        logo.css("width", "100%");
        nav.css("align-items", "center");

        // Troca o simbolo da seta para direita
        bot.innerHTML = `<i class="fa-solid fa-angle-right"></i>`; 
        bot.classList.remove("left");
        bot.classList.add("right");
    } else if (bot.classList[0] == `right`) { // Alongar Menu
        body.css("grid-template-columns", "19% 81%");
        header.css("width", "19%");

        spanMenu.show(); // Mostra as palavras

        // Mostra o titulo com uma animação
        titulo.animate({
            height: "show"
        }, "slow", "swing");

        logo.css("width", "25%");
        nav.css("align-items", "stretch");

        // Troca o simbolo da seta para esquerda
        bot.innerHTML = `<i class="fa-solid fa-angle-left"></i>`
        bot.classList.remove("right");
        bot.classList.add("left");
    }
}

// Faz uma div aparecer de forma animada
function aparecerAnimado(div) {
    $(div).css({
        display: "none",
        opacity: 0,
        position: "relative",
        top: "20px"
    }).animate({
        height: "show",
        opacity: 1,
        top: 0
    }, 300, "linear");
}

// Faz uma tabela aparecer de forma animada
function aparecerAnimadoTabela(table) {
    $(table).css({
        opacity: 0,
        position: "relative",
        top: "10px"
    }).animate({
        opacity: 1,
        top: 0
    }, 200, "linear");
}

// Mostra a div correta
function mostraDiv(botao) {
    let divs = document.querySelectorAll(".divs");

    //Mostrar a div correspondente
    for(let i=0; i < divs.length; i++) {
        if(botao == divs[i].id) {
            divs[i].style.display = "block";
        } else {
            divs[i].style.display = "none";
        }
    }
}

// Mostra uma mensagem de sucesso ou erro do formulário
function mostraMensagem(html, tipo) {
    let mensagem = $(".mensagem");
    mensagem.html(html);
    mensagem.removeClass("mensagem-branca mensagem-vermelha mensagemAtiva mensagemDesativa");

    if (tipo == 1) { // Mensagem de Sucesso
        mensagem.addClass("mensagem-branca"); 
    } else if (tipo == 2) { // Mensaagem de erro
        mensagem.addClass("mensagem-vermelha");
    }
    // Faz a mensagem aparecer
    mensagem.addClass("mensagemAtiva");

    // Faz a mensagem Desaparecer depois de um tempo
    setTimeout(() => {
        mensagem.removeClass("mensagemAtiva");
        mensagem.addClass("mensagemDesativa");
        setTimeout(() => {
            mensagem.removeClass("mensagemDesativa");
        }, 300);
    }, 5000);
}


async function iniciarSistema() {
    await carregarBois();

    $("#btnPainel").focus();
    clicou("Painel");
    redimensionarMenu();
}