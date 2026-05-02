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
function validarID(boiadd) {
    for(let i=0; i < bois.length; i++) {
        if (boiadd.ID == bois[i].ID)
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
        validarID(boiadd)
    ) {
        if (validarID(boiadd)) {
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