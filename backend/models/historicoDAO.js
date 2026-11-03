const { getDB } = require("../config/database");

async function registrar(dados) {
    const db = getDB();

    const resultado = await db.collection("historicoBois").insertOne(dados);

    return {
        _id: resultado.insertedId,
        ...dados
    };
}

async function buscarPorBoiId(boiId) {
    const db = getDB();

    const historico = await db.collection("historicoBois")
        .find({ boi_id: boiId })
        .sort({ data_alteracao: -1 })
        .toArray();

    return historico;
}

module.exports = {
    registrar,
    buscarPorBoiId
};