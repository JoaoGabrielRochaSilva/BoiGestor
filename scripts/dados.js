/* 
    Aqui ficam as funções que mexem com os dados do usuário
*/

var bois = [];

// 🔥 Buscar bois do usuário logado
async function carregarBois() {
    const usuarioId = localStorage.getItem("usuario_id");

    const { data, error } = await supabaseClient
        .from("bois")
        .select("*")
        .eq("usuario_id", usuarioId);

    if (error) {
        console.log("Erro ao buscar bois:", error);
        bois = [];
    } else {
        bois = data;
    }
}

// Retorna a quantidade de vacinas pendentes
function contVacinaPendente() {
    let Total = 0;
    for(let i=0; i < bois.length; i++) {
        if (bois[i].vacina == "Pendente")
            Total++;
    }
    return Total; 
}

// Retorna a quantidade de vacinas atrasadas
function contVacinaAtrasada() {
    let Total = 0;
    for(let i=0; i < bois.length; i++) {
        if (bois[i].vacina == "Atrasada")
            Total++;
    }
    return Total;    
}

// Retorna a quantidade de vacinas que precisam de atenção
function contVacinaAlerta() {
    return contVacinaAtrasada() + contVacinaPendente();    
}

// Retorna a quantidade de vacinas em dia
function contVacinaemDia() {
    let Total = 0;
    for(let i=0; i < bois.length; i++) {
        if (bois[i].vacina == "Em dia")
            Total++;
    }
    return Total;
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

// 🔥 Adiciona um boi no banco (Supabase)
async function adicionar() {
    let html;

    let boiadd = {
        nome: document.getElementById("nome").value,
        ID: document.getElementById("id").value,
        raca: document.getElementById("raça").value,
        tipo: document.getElementById("tipo").value,
        peso: Number(document.getElementById("peso").value),

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

        const { error } = await supabaseClient
            .from("bois")
            .insert([boiadd]);

        if (error) {
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

        // 🔥 Atualiza lista local
        await carregarBois();
    }
}

//Função que salva as alterações do formulário de edição
function Salvar() {
    const nome = document.getElementById("nomeEdite").value;
    const id = document.getElementById("idEdite").value;
    const raca = document.getElementById("raçaEdite").value;
    const tipo = document.getElementById("tipoEdite").value;
    const peso = document.getElementById("pesoEdite").value;

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
        animalSelecionado.nome = nome;
        animalSelecionado.ID = id;
        animalSelecionado.raca = raca;
        animalSelecionado.tipo = tipo;
        animalSelecionado.peso = Number(peso);
        html = `<h1>Animal Atualizado! 🐮</h1><p>${animalSelecionado.nome} de ID #${animalSelecionado.ID} foi alterado</p>`;
        mostraMensagem(html, 1);

        // Limpar inputs
        document.getElementById("nomeEdite").value = "";
        document.getElementById("idEdite").value = "";
        document.getElementById("raçaEdite").value = "";
        document.getElementById("tipoEdite").value = "";
        document.getElementById("pesoEdite").value = "";

        document.getElementById("editarModal").close(); //Fechar modal
    }
}

//Função que remove um animal do rebanho
function removerAnimal() {
    for(let i=0; i < bois.length; i++) {
        if (bois[i].ID == animalSelecionado.ID)
            bois.slice(i, 1);
    }

    html = `<h1>Animal Removido! 🐮</h1><p>${animalSelecionado.nome} de ID #${animalSelecionado.ID} foi removido ao rebanho</p>`;
    mostraMensagem(html, 1);
}