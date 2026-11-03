const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

// Lista todos os usuários cadastrados
async function listar() {
    const db = getDB();

    const usuarios = await db.collection("usuarios")
        .find({})
        .toArray();

    return usuarios;
}

// Busca um usuário pelo ID
async function buscarPorId(id) {
    const db = getDB();

    const usuario = await db.collection("usuarios")
        .findOne({ _id: new ObjectId(id) });

    return usuario;
}

// Busca um usuário pelo nome de usuário
async function buscarPorUsuario(usuario) {
    const db = getDB();

    const usuarioEncontrado = await db.collection("usuarios")
        .findOne({ username: usuario });

    return usuarioEncontrado;
}

// Cadastra um novo usuário
async function cadastrar(dados) {
    const db = getDB();

    const resultado = await db.collection("usuarios")
        .insertOne(dados);

    return {
        _id: resultado.insertedId,
        ...dados
    };
}

// Atualiza os dados de um usuário
async function atualizar(id, dados) {
    const db = getDB();

    const resultado = await db.collection("usuarios")
        .updateOne(
            { _id: new ObjectId(id) },
            { $set: dados }
        );

    return resultado;
}

// Remove um usuário
async function remover(id) {
    const db = getDB();

    const resultado = await db.collection("usuarios")
        .deleteOne({ _id: new ObjectId(id) });

    return resultado;
}

module.exports = {
    listar,
    buscarPorId,
    buscarPorUsuario,
    cadastrar,
    atualizar,
    remover
};