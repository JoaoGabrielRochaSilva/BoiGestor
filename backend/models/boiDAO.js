const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

async function listar(usuarioId) {
    const db = getDB();

    const filtro = usuarioId
        ? { usuario_id: usuarioId }
        : {};

    return await db.collection("bois")
        .find(filtro)
        .toArray();
}

async function buscarPorId(id) {
    const db = getDB();

    return await db.collection("bois")
        .findOne({ _id: new ObjectId(id) });
}

async function buscarPorIDAnimal(idAnimal, usuarioId) {
    const db = getDB();

    return await db.collection("bois").findOne({
        ID: idAnimal,
        usuario_id: usuarioId
    });
}

async function cadastrar(dados) {
    const db = getDB();

    const resultado = await db.collection("bois")
        .insertOne(dados);

    return {
        _id: resultado.insertedId,
        ...dados
    };
}

async function atualizar(id, dados) {
    const db = getDB();

    return await db.collection("bois").updateOne(
        { _id: new ObjectId(id) },
        { $set: dados }
    );
}

async function remover(id) {
    const db = getDB();

    return await db.collection("bois")
        .deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorIDAnimal,
    cadastrar,
    atualizar,
    remover
};