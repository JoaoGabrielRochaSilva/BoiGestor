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
function montarTabela(tipo, htmlheader, bois) {
    let tabela;
    let divTable = document.createElement("div"); // Cria a div que vai receber a tabela
    let header = document.createElement("div"); // Cria a div que vai receber o header e a tabela
    header.innerHTML = htmlheader;

    // Tabela Painel e Animais
    if (tipo == 1) {
        tabela = "<table id='tableAnimais'> <thead> <tr>  <th>ID</th> <th>NOME</th> <th>RAÇA</th> <th>TIPO</th> <th>PESO</th> <th>VACINA</th> </tr> </thead> <tbody>";
  
        for(let i=0; i < bois.length; i++) {
            tabela += `<tr onclick="EditaRemove(${bois[i].ID}, event)"> <td>#${bois[i].ID}</td> <td>${bois[i].nome}</td>  <td>${bois[i].raca}</td> <td><span class="span-cinza">${bois[i].tipo}</span></td> <td>${bois[i].peso} Kg</td>`;

            if (bois[i].vacina == "Em dia")
                tabela += `<td><span class="span-verde">${bois[i].vacina}</span></td> </tr>`;
            else if (bois[i].vacina == "Atrasada")
                tabela += `<td><span class="span-vermelho">${bois[i].vacina}</span></td> </tr>`;
            else if (bois[i].vacina == "Pendente")
                tabela += `<td><span class="span-laranja">${bois[i].vacina}</span></td> </tr>`;
        }
    } else if (tipo == 2) { // Tabela Relatório
        tabela = "<table id='tableRelatorio'> <thead> <tr> <th>NOME</th> <th>ID</th> <th>RAÇA</th> <th>ALIMENTAÇÂO</th> <th>PRODUÇÂO</th> </tr> </thead> <tbody>";
  
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
        tabela = "<table id='tableVacina'> <thead> <tr> <th>NOME</th> <th>ID</th> <th>RAÇA</th> <th>TIPO</th> <th>STATUS VACINA</th> </tr> </thead> <tbody>";
  
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

//Retorna a aba amostra
function QualAba() {
    const abas = document.querySelectorAll(".divs");
    for (const aba of abas) {
        if (aba.style.display == "block")
            return aba.id;
    }
}

//Aplica o filtro na tabela
function aplicarFiltro() {
    const vetorFiltro = Filtrar();
    let divtab;
    let idTable;
    const Aba = QualAba();

    if (Aba == "Painel") {
        idTable = "#tableAnimais";

        divtab = montarTabela(1, `<h1>Animais Cadastrados</h1><p>${vetorFiltro.length} animais no rebanho</p> <button type="button" command="show-modal" commandfor="filterAnimais"><i class="fa-solid fa-filter"></i> Filtrar </button>`, vetorFiltro);

        // Remove a tabela para manter ela atualizada
        $("#Painel").children(".divtable").remove(); 
        $("#Painel").append(divtab);
        
    } else if (Aba == "Animais") {
        idTable = "#tableAnimais";

        divtab = montarTabela(1, `<h1>Animais Cadastrados</h1><p>${vetorFiltro.length} animais no rebanho</p> <button type="button" command="show-modal" commandfor="filterAnimais"><i class="fa-solid fa-filter"></i> Filtrar </button>`, vetorFiltro);

        // Remove a tabela para manter ela atualizada
        $("#Painel").children(".divtable").remove();
        $("#Animais").children(".divtable").remove(); 
        $("#Animais").append(divtab);

    } else if (Aba == "Relatório") {
        idTable = "#tableRelatorio";

        divtab = montarTabela(2, `<h1>Relatório de Desempenho</h1><p>Alimentação e produção do rebanho</p> <button type="button" command="show-modal" commandfor="filterAnimais"><i class="fa-solid fa-filter"></i> Filtrar </button>`, vetorFiltro);

         // Remove a tabela para manter ela atualizada
        $("#Relatório").children(".divtable").remove();
        $("#Relatório").append(divtab);   

    } else if (Aba == "Vacinação") {
        idTable = "#tableVacina";

        divtab = montarTabela(3, `<h1> <i class="fa-solid fa-syringe" style="color: darkgreen;"></i> Controle de Vacinação</h1> <button type="button" command="show-modal" commandfor="filterAnimais"><i class="fa-solid fa-filter"></i> Filtrar </button>`, vetorFiltro);

        // Remove a tabela para manter ela atualizada
        $("#Vacinação").children(".divtable").remove(); 
        $("#Vacinação").append(divtab);
    }

    aparecerTabela(divtab, idTable);
}

//Limpa os filtros na tabela
function limparFiltro() {
    //Limpa os inputs do filtro
    document.querySelector("#nomeFiltroAnimais").value = "";
    document.querySelector("#idFiltroAnimais").value = "";
    document.querySelector("#racaFiltroAnimais").value = "";
    document.querySelector("#tipoFiltroAnimais").value = "";
    document.querySelector("#pesoFiltroAnimais").value = "";
    document.querySelector("#statusVacina").value = "Todos";
    document.querySelector("#statusProducao").value = "Todos";
    document.querySelector("#statusAlimentacao").value = "Todos";

    aplicarFiltro();
}

// Resumo vacinação
function montarResumoVacina() {
    let divResumo = document.getElementById("resumoVacinação");
    divResumo.innerHTML = ""; // Limpa a div do resumo para sempre atualizar os dados

    // Cria a div com a quantidade de vacinas em dia
    let divEmdia = document.createElement("div");
    divEmdia.innerHTML = `<p><span style="color: #40AC67; background-color: #E9F6EE"><i class="fa-regular fa-circle-check"></i></span><section><h1>${contVacinacao("Em dia")}</h1><p>Em dia</p></section></p>`;

    // Cria a div com a quantidade de vacinas atrasadas
    let divAtrasada = document.createElement("div");
    divAtrasada.innerHTML = `<p><span style="color: #DC2828; background-color: #FBE9E9"><i class="fa-solid fa-triangle-exclamation"></i></span><section><h1>${contVacinacao("Atrasada")}</h1><p>Atrasadas</p></section></p>`;

    // Cria a div com a quantidade de vacinas Pendentes
    let divPendente = document.createElement("div");
    divPendente.innerHTML = `<p><span style="color: #F59F0A; background-color: #FDECCE"><i class="fa-regular fa-clock"></i></span><section><h1>${contVacinacao("Pendente")}</h1><p>Pendentes</p></section></p>`;

    // Adiciona todas as divs acima ao resumo vacinação
    divResumo.appendChild(divEmdia);
    aparecerAnimado(divEmdia);
    divResumo.appendChild(divAtrasada);
    aparecerAnimado(divAtrasada);
    divResumo.appendChild(divPendente);
    aparecerAnimado(divPendente);
}

//Mostra um conjunto de divs em efeito casacata
function mostraDivAtrasado(divs, intervalo) {
    divs.forEach((div, indice)=> {
        setTimeout(() => {
            aparecerAnimado(div);
        }, indice * intervalo);   
    });   
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
    divVacina.innerHTML = `<p>Vacinas em Dia <span style="color: #38A961; background-color: #E9F6EE"><i class="fa-solid fa-syringe"></i></span></p> <h1>${contVacinacao("Em dia")}</h1>`

    // Cria a div contendo a quantidade de alertas
    let divAlertas = document.createElement("div");
    divAlertas.innerHTML = `<p>Alertas <span style="color: #F59F0A; background-color: #FDECCE"><i class="fa-solid fa-triangle-exclamation"></i></span></p> <h1>${contVacinaAlerta()}</h1>`

    //Coloca a classe card-resumo nas divs para agrupar elas
    divTotal.setAttribute("class", "card-resumo");
    divPeso.setAttribute("class", "card-resumo");
    divVacina.setAttribute("class", "card-resumo");
    divAlertas.setAttribute("class", "card-resumo");

    // Adiciona as divs acima na visão geral do painel
    divResumo.appendChild(divTotal);
    divResumo.appendChild(divPeso);
    divResumo.appendChild(divVacina);
    divResumo.appendChild(divAlertas);

    //Pega todas os cards
    const divs = document.querySelectorAll(".card-resumo");
    //Mostra os cards em efeito cascata
    mostraDivAtrasado(divs, 200);
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

//Personaliza a tabela com a biblioteca e depois faz ela aparecer
let dataTable = null;
function aparecerTabela(divTab, idTable) {
    if (dataTable)
        dataTable.destroy();

    aparecerAnimadoTabela(divTab);
    dataTable = new simpleDatatables.DataTable(document.querySelector(idTable), {
        searchable: false,
        sortable: true,
        paging: true,

        perPage: 10,
        perPageSelect: false,

        fixedHeight: false,

        labels: {
            placeholder: "Pesquisar...",
            perPage: "{select} registros por página",
            noRows: "Nenhum registro encontrado",
            info: "Mostrando {start} até {end} de {rows} registros"
        }
    });
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

//Edita ou Remove? Faz aparecer o menu de opções
let animalSelecionado = null; //Animal selecionado para manipulação
function EditaRemove(id, event) {
    animalSelecionado = bois.find(boi => boi.ID == id);
    const menu = document.getElementById("menu-EditaRemove");
    menu.style.left = event.pageX + "px";
    menu.style.top = event.pageY + "px";

    menu.classList.remove("oculto");

    event.stopPropagation();


    document.addEventListener("click", (event) => {

        if (!menu.contains(event.target) || menu.contains(event.target))
            menu.classList.add("oculto");

    });
}

//Preenche o formulário de edição com os dados do boi selecionado
function editarTela() {
    document.getElementById("nomeEdite").value = animalSelecionado.nome;
    document.getElementById("idEdite").value = animalSelecionado.ID;
    document.getElementById("raçaEdite").value = animalSelecionado.raca;
    document.getElementById("tipoEdite").value = animalSelecionado.tipo;
    document.getElementById("pesoEdite").value = animalSelecionado.peso;
}

//Graficos armazenados
 const graficos = {
        vacina: null,
        raca: null,
        tipo: null,
        producao: null,
        peso: null,
        producaoR: null,
        alimentacaoR: null
    };
    
//Destruir graficos criados
function DestruirGrafico(grafico) {
    if (grafico)
        grafico.destroy();
}

//Monta os graficos dinamicamente no dashboard
function montarGraficos() {

    const vacina = document.getElementById("graficoVacina");
    const producao = document.getElementById("graficoProducao");
    const raca = document.getElementById("graficoRaca");
    const tipo = document.getElementById("graficoTipo");

    DestruirGrafico(graficos.vacina);

    graficos.vacina = new Chart(vacina, {
        type: "doughnut",

        data: {
            labels: [
                "Em dia",
                "Pendente",
                "Atrasada"
            ],

            datasets: [{
                data: [contVacinacao("Em dia"), contVacinacao("Pendente"), contVacinacao("Atrasada")],

                backgroundColor: [
                    "#16A34A",
                    "#F59E0B",
                    "#DC2626"  
                ],

                borderColor: [
                    "#15803D",
                    "#B45309",
                    "#B91C1C"
                ],

                borderWidth: 1
            }]
        },

        options: {
            cutout: "60%",
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            plugins: {
                title: {
                    display: true,
                    text: "Vacinação do Rebanho",
                    font: {
                        size: 20,
                        weight: "bold"
                    }
                },

                legend: {
                    position: "bottom",

                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        },

                        usePointStyle: true,
                        pointStyle: "circle"
                    }
                },

                tooltip: {

                    backgroundColor: "#1F2937",

                    titleFont: {
                        size: 15
                    },

                    bodyFont: {
                        size: 14
                    }

                },

                formatter(value, context) {

                    const dados = context.chart.data.datasets[0].data;

                    const total = dados.reduce((a, b) => a + b, 0);

                    const porcentagem = (value / total) * 100;

                    return porcentagem.toFixed(1) + "%";
                }

            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1200,
                easing: "easeOutQuart"
            }

        },
            
    });

    DestruirGrafico(graficos.producao);

    graficos.producao = new Chart(producao, {
        type: "doughnut",

        data: {
            labels: [
                "Acima do Normal",
                "Normal",
                "Abaixo do Normal"
            ],

            datasets: [{
                data: [contProducao("Acima do Normal"), contProducao("Normal"), contProducao("Abaixo do Normal")],

                backgroundColor: [
                    "#167ba38a",
                    "#f50bbb86",
                    "#dc26269a"
                ],

                borderColor: [
                    "#00b7ff",
                    "#ff00bf",
                    "#ff0000"
                ],

                borderWidth: 1
            }], 
        },

        options: {
            cutout: "60%",
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            plugins: {
                title: {
                    display: true,
                    text: "Produção do Rebanho",
                    font: {
                        size: 20,
                        weight: "bold"
                    }
                },

                legend: {
                    position: "bottom",

                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        },

                        usePointStyle: true,
                        pointStyle: "circle"
                    }
                },

                tooltip: {

                    backgroundColor: "#1F2937",

                    titleFont: {
                        size: 15
                    },

                    bodyFont: {
                        size: 14
                    }

                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1200,
                delay: 300,
                easing: "easeOutQuart"
            }
            
        }
  
    });

    const contraca = contarPorCampo("raca");

    DestruirGrafico(graficos.raca);

    graficos.raca = new Chart(raca, {
        type: "bar",

        data: {
            labels: Object.keys(contraca),

            datasets: [{
                label: "Quantidade",
                
                data: Object.values(contraca),

                 backgroundColor: [
                    "#2563EB",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                ],

                 borderRadius: 12
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            plugins: {
                title: {
                    display: true,
                    text: "Quantidade de Raças",
                    font: {
                        size: 20,
                        weight: "bold"
                    }
                },

                tooltip: {

                    backgroundColor: "#1F2937",

                    titleFont: {
                        size: 15
                    },

                    bodyFont: {
                        size: 14
                    }

                }
            },

            scales: {

                x: {
                    grid: {
                        display: false
                    }
                },

                y: {
                    grid: {
                        color: "#ECECEC"
                    }
                }

            },
            animation: {
                duration: 1200,
                delay: 450,
                easing: "easeOutQuart",

                delay(context) {
                    return context.dataIndex * 120;
                }
            }
        }
    });

    const conttipo = contarPorCampo("tipo");

    DestruirGrafico(graficos.tipo);

    graficos.tipo = new Chart(tipo, {
        type: "bar",

        data: {
            labels: Object.keys(conttipo),

            datasets: [{
                label: "Quantidade",
                
                data: Object.values(conttipo),

                backgroundColor: [
                    "#2563EB",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                ],

                borderRadius: 12
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            plugins: {
                title: {
                    display: true,
                    text: "Quantidade de Tipos",
                    font: {
                        size: 20,
                        weight: "bold"
                    }
                },

                tooltip: {

                    backgroundColor: "#1F2937",

                    titleFont: {
                        size: 15
                    },

                    bodyFont: {
                        size: 14
                    }

                }
                
            },

            scales: {

                x: {
                    grid: {
                        display: false
                    }
                },

                y: {
                    grid: {
                        color: "#ECECEC"
                    }
                }

            },
            animation: {
                duration: 1200,
                delay: 600,
                easing: "easeOutQuart",

                delay(context) {
                    return context.dataIndex * 120;
                }
            }
        }
    });

}

//Monta os graficos dinamicamente na aba relatório
function montarGraficosRelatorio() {
    const producao = document.getElementById("producaoR");
    const alimentacao = document.getElementById("alimentacaoR");

    DestruirGrafico(graficos.producaoR);

    graficos.producaoR = new Chart(producao, {
        type: "doughnut",

        data: {
            labels: [
                "Acima do Normal",
                "Normal",
                "Abaixo do Normal"
            ],

            datasets: [{
                data: [contProducao("Acima do Normal"), contProducao("Normal"), contProducao("Abaixo do Normal")],

                backgroundColor: [
                    "#16a34aa8",
                    "#f59f0ba1",
                    "#dc2626a6"
                ],

                borderColor: [
                    "#00ff5e",
                    "#ff6f00",
                    "#ff0000"
                ],

                borderWidth: 1
            }], 
        },

        options: {
            cutout: "60%",
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            plugins: {
                title: {
                    display: true,
                    text: "Produção do Rebanho",
                    font: {
                        size: 20,
                        weight: "bold"
                    }
                },

                legend: {
                    position: "bottom",

                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        },

                        usePointStyle: true,
                        pointStyle: "circle"
                    }
                },

                tooltip: {

                    backgroundColor: "#1F2937",

                    titleFont: {
                        size: 15
                    },

                    bodyFont: {
                        size: 14
                    }

                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1200,
                delay: 300,
                easing: "easeOutQuart"
            }
            
        }
  
    });

    DestruirGrafico(graficos.alimentacaoR);

    graficos.alimentacaoR = new Chart(alimentacao, {
        type: "doughnut",

        data: {
            labels: [
                "Acima do Normal",
                "Normal",
                "Abaixo do Normal"
            ],

            datasets: [{
                data: [contAlimentacao("Acima do Normal"), contAlimentacao("Normal"), contAlimentacao("Abaixo do Normal")],

                backgroundColor: [
                    "#37a316b2",
                    "#f5690ba9",
                    "#d626dc9c"
                ],

                borderColor: [
                    "#3cff00",
                    "#ff6600",
                    "#f700ff"
                ],

                borderWidth: 1
            }], 
        },

        options: {
            cutout: "60%",
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            plugins: {
                title: {
                    display: true,
                    text: "Alimentação do Rebanho",
                    font: {
                        size: 20,
                        weight: "bold"
                    }
                },

                legend: {
                    position: "bottom",

                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        },

                        usePointStyle: true,
                        pointStyle: "circle"
                    }
                },

                tooltip: {

                    backgroundColor: "#1F2937",

                    titleFont: {
                        size: 15
                    },

                    bodyFont: {
                        size: 14
                    }

                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1200,
                delay: 300,
                easing: "easeOutQuart"
            }
            
        }
  
    });
}

async function iniciarSistema() {
    await carregarBois();

    $("#btnPainel").focus();
    clicou("Painel");
    redimensionarMenu();
}