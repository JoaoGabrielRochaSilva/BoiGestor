/* 
    Aqui ficam as funções que mexem com a navegação do site
*/

// Verifica se o user esta logado
$(window).ready(function() {
    let logado = localStorage.getItem("logado");

    if (logado !== "true") {
        window.location.href = "Login/login.html";
    } else {
        // Abre direto na parte painel e inicia o sistema
        $(document).ready(function() {
            iniciarSistema();
        });
    }
});

// Principal função de navegação do site
function clicou(botao) {
    mostraDiv(botao);
    let divtab;

    if (botao == "Painel") {
        montarResumoGeral();

        divtab = montarTabela(1, `<h1>Animais Cadastrados</h1><p>${bois.length} animais no rebanho</p>`);

        $("#Painel").children(".divtable").remove(); // Remove a tabela para manter ela atualizada
        $("#Painel").append(divtab);

    } else if (botao == "Animais") {
         divtab = montarTabela(1, `<h1>Animais Cadastrados</h1><p>${bois.length} animais no rebanho</p>`);

        $("#Animais").children(".divtable").remove(); // Remove a tabela para manter ela atualizada
        $("#Animais").append(divtab);

    } else if (botao == "Relatório") {
         divtab = montarTabela(2, `<h1>Relatório de Desempenho</h1><p>Alimentação e produção do rebanho</p>`);

        $("#Relatório").children(".divtable").remove(); // Remove a tabela para manter ela atualizada
        $("#Relatório").append(divtab);

    } else if (botao == "Vacinação") {
        montarResumoVacina();

         divtab = montarTabela(3, `<h1> <i class="fa-solid fa-syringe" style="color: darkgreen;"></i> Controle de Vacinação</h1>`);

        $("#Vacinação").children(".divtable").remove(); // Remove a tabela para manter ela atualizada
        $("#Vacinação").append(divtab);

    } 
    aparecerAnimadoTabela(divtab);
}

