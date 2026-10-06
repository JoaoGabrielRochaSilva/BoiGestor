/* 
    Aqui ficam as funções que mexem com os dados do usuário e seu rebanho
*/

var bois = [];

//Conta algum campo do objeto boi (Raça, tipo ,etc...)
function contarPorCampo(campo) {

    const contagem = {};

    for (const boi of bois) {

        const valor = boi[campo].trim().toLowerCase();

        contagem[valor] = (contagem[valor] || 0) + 1;

    }

    return contagem;
}

//Conta algum status de alimentação no rebanho
function contAlimentacao(status) {
    let total = 0;
    for (const boi of bois) {
        if (boi.alimentacao == status)
            total++;
    }
    return total;
}

//Conta algum status de producao no rebanho
function contProducao(status) {
    let total = 0;
    for (const boi of bois) {
        if (boi.producao == status)
            total++;
    }
    return total;
}

//Conta algum status de vacina no rebanho
function contVacinacao(status) {
    let total = 0;
    for (const boi of bois) {
        if (boi.vacina == status)
            total++;
    }
    return total;
}

//Buscar bois do usuário logado
async function carregarBois() {
    const usuarioId = localStorage.getItem("usuario_id");

    try {
        const resposta = await fetch(`${API_BASE_URL}/bois?usuario_id=${usuarioId}`);

        if (!resposta.ok) {
            console.log("Erro ao buscar bois:", resposta.statusText);
            bois = [];
            return;
        }

        bois = await resposta.json();
    } catch (error) {
        console.log("Erro ao buscar bois:", error);
        bois = [];
    }
}

// Retorna a quantidade de vacinas que precisam de atenção
function contVacinaAlerta() {
    return contVacinacao("Atrasada") + contVacinacao("Pendente");    
}

// Retorna o peso médio dos animais do rebanho
function calcPesoMédio() {
    let Total = 0;

    for(let i=0; i < bois.length; i++) {
        Total += bois[i].peso;
    }

    return bois.length > 0 ? Math.trunc(Total / bois.length) : 0;
}

// verifica se o id já esta sendo usando por outro boi
function validarID(id) {
    for(let i=0; i < bois.length; i++) {
        if (id == bois[i].ID)
            return true;
    }
    return false;
}

//Formata o texto dos inputs (Raça e Tipo)
function formatarTexto(texto) {
    return texto
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(" ");
}

//Adiciona um boi no banco (MongoDB, via backend)
async function adicionar() {
    let html;

    let boiadd = {
        nome: document.getElementById("nome").value.trim(),
        ID: document.getElementById("id").value.trim(),
        raca: formatarTexto(document.getElementById("raça").value),
        tipo: formatarTexto(document.getElementById("tipo").value),
        peso: Number(document.getElementById("peso").value.trim()),

        // 🔥 VALORES AUTOMÁTICOS
        alimentacao: "Normal",
        producao: "Normal",
        vacina: "Em dia",

        usuario_id: localStorage.getItem("usuario_id")
    };

    if (
        boiadd.nome.length == 0 ||
        boiadd.ID.length == 0 ||
        boiadd.raca.length == 0 ||
        boiadd.tipo.length == 0 ||
        validarID(boiadd.ID)
    ) {
        if (validarID(boiadd.ID)) {
            html = `<h1>Id duplicado</h1><p>Já tem um animal com este Id #${boiadd.ID}</p>`;
            mostraMensagem(html, 2);   
        } else {
            html = "<h1>Campos Obrigatórios</h1><p>Preencha todos os campos antes de adicionar</p>";
            mostraMensagem(html, 2);
        }    
    } else {

        try {
            const resposta = await fetch(`${API_BASE_URL}/bois`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(boiadd)
            });

            const resultado = await resposta.json();

            if (!resposta.ok || !resultado.success) {
                console.log(resultado.error || resposta.statusText);
                html = "<h1>Erro</h1><p>Erro ao salvar no banco</p>";
                mostraMensagem(html, 2);
                return;
            }
        } catch (error) {
            console.log(error);
            html = "<h1>Erro</h1><p>Erro ao salvar no banco</p>";
            mostraMensagem(html, 2);
            return;
        }

        html = `<h1>Animal Cadastrado! 🐮</h1><p>${boiadd.nome} de ID #${boiadd.ID} foi adicionado ao rebanho</p>`;
        mostraMensagem(html, 1);

        // Limpar inputs
        document.getElementById("nome").value = "";
        document.getElementById("id").value = "";
        document.getElementById("raça").value = "";
        document.getElementById("tipo").value = "";
        document.getElementById("peso").value = "";

        document.getElementById("adicionarModal").close(); //Fechar modal de cadastro

        // 🔥 Atualiza lista local
        await carregarBois();
    }
}

//Função que salva as alterações do formulário de edição
async function Salvar() {
    const nome = document.getElementById("nomeEdite").value.trim();
    const id = document.getElementById("idEdite").value.trim();
    const raca = formatarTexto(document.getElementById("raçaEdite").value);
    const tipo = formatarTexto(document.getElementById("tipoEdite").value);
    const peso = document.getElementById("pesoEdite").value.trim();

    if (
        nome.length == 0 ||
        id.length == 0 ||
        raca.length == 0 ||
        tipo.length == 0 ||
        validarID(id) && id != animalSelecionado.ID
    ) {
        if (validarID(id) && id != animalSelecionado.ID) {
            html = `<h1>Id duplicado</h1><p>Já tem um animal com este Id #${id}</p>`;
            mostraMensagem(html, 2);   
        } else {
            html = "<h1>Campos Obrigatórios</h1><p>Preencha todos os campos antes de alterar</p>";
            mostraMensagem(html, 2);
        }
    } else {
        const indice = bois.indexOf(animalSelecionado);

        if (indice != -1) {
            const boiAtualizado = {
                nome: nome,
                ID: id,
                raca: raca,
                tipo: tipo,
                peso: Number(peso)
            };

            try {
                const resposta = await fetch(`${API_BASE_URL}/bois/${animalSelecionado.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(boiAtualizado)
                });

                const resultado = await resposta.json();

                if (!resposta.ok || !resultado.success) {
                    console.log(resultado.error || resposta.statusText);
                    html = "<h1>Erro</h1><p>Erro ao alterar no banco</p>";
                    mostraMensagem(html, 2);
                    return;
                }
            } catch (error) {
                console.log(error);
                html = "<h1>Erro</h1><p>Erro ao alterar no banco</p>";
                mostraMensagem(html, 2);
                return;
            }

            // Atualiza a cópia local só depois de confirmar que salvou no banco
            Object.assign(animalSelecionado, boiAtualizado);
            bois[indice] = animalSelecionado;

            html = `<h1>Animal Atualizado! 🐮</h1><p>${animalSelecionado.nome} de ID #${animalSelecionado.ID} foi alterado</p>`;
            mostraMensagem(html, 1);
        } else {
            html = "<h1>ID não encontrado</h1><p>Erro ao tentar buscar o ID, tente novamente...</p>";
            mostraMensagem(html, 2);
        }
        // Limpar inputs
        document.getElementById("nomeEdite").value = "";
        document.getElementById("idEdite").value = "";
        document.getElementById("raçaEdite").value = "";
        document.getElementById("tipoEdite").value = "";
        document.getElementById("pesoEdite").value = "";

        document.getElementById("editarModal").close(); //Fechar modal de edição
    }
}

//Função que remove um animal do rebanho
async function removerAnimal() {
    try {
        const resposta = await fetch(`${API_BASE_URL}/bois/${animalSelecionado.id}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (!resposta.ok || !resultado.success) {
            console.log(resultado.error || resposta.statusText);
            html = "<h1>Erro</h1><p>Erro ao remover do banco</p>";
            mostraMensagem(html, 2);
            return;
        }
    } catch (error) {
        console.log(error);
        html = "<h1>Erro</h1><p>Erro ao remover do banco</p>";
        mostraMensagem(html, 2);
        return;
    }

    // Remove da lista local só depois de confirmar que removeu do banco
    for(let i=0; i < bois.length; i++) {
        if (bois[i].ID == animalSelecionado.ID)
            bois.splice(i, 1);
    }

    html = `<h1>Animal Removido! 🐮</h1><p>${animalSelecionado.nome} de ID #${animalSelecionado.ID} foi removido do rebanho</p>`;
    mostraMensagem(html, 1);
}

//Filtra os bois com base no formulário de filtro
function Filtrar() {
    const nome = document.querySelector("#nomeFiltroAnimais").value.trim().toLowerCase();
    const id = document.querySelector("#idFiltroAnimais").value.trim().toLowerCase();
    const raca = document.querySelector("#racaFiltroAnimais").value.trim().toLowerCase();
    const tipo = document.querySelector("#tipoFiltroAnimais").value.trim().toLowerCase();
    const peso = Number(document.querySelector("#pesoFiltroAnimais").value.trim());
    const statusVacina = document.querySelector("#statusVacina").value;
    const statusProducao = document.querySelector("#statusProducao").value;
    const statusAlimentacao = document.querySelector("#statusAlimentacao").value;

    let vetorFiltro = bois;

    if (nome.length != 0) {
        vetorFiltro = vetorFiltro.filter(boi => {
            return boi.nome.toLowerCase().includes(nome);
        });
    }

    if (id.length != 0) {
        vetorFiltro = vetorFiltro.filter(boi => {
            return String(boi.ID).includes(id);
        });
    }

    if (raca.length != 0) {
        vetorFiltro = vetorFiltro.filter(boi => {
            return boi.raca.toLowerCase().includes(raca);
        });
    }

    if (tipo.length != 0) {
        vetorFiltro = vetorFiltro.filter(boi => {
            return boi.tipo.toLowerCase().includes(tipo);
        });
    }

    if (peso > 0) {
        vetorFiltro = vetorFiltro.filter(boi => {
            return boi.peso >= peso;
        });
    }

    if (statusVacina != "Todos") {
        vetorFiltro = vetorFiltro.filter(boi => {
            return boi.vacina == statusVacina;
        });
    }

    if (statusProducao != "Todos") {
        vetorFiltro = vetorFiltro.filter(boi => {
            return boi.producao == statusProducao;
        });
    }

    if (statusAlimentacao != "Todos") {
        vetorFiltro = vetorFiltro.filter(boi => {
            return boi.alimentacao == statusAlimentacao;
        });
    }

    return vetorFiltro;
}