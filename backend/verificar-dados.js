/*
    Script de verificação
    ----------------------
    Só confere se os dados realmente estão no MongoDB Atlas.
    Rode com: node verificar-dados.js
*/

require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "boiGestorDB";

async function verificar() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);

        console.log(`Conectado ao banco: ${dbName}`);

        const colecoes = await db.listCollections().toArray();
        console.log("Coleções encontradas:", colecoes.map(c => c.name));

        const totalUsuarios = await db.collection("usuarios").countDocuments();
        const totalBois = await db.collection("bois").countDocuments();

        console.log(`👤 usuarios: ${totalUsuarios} documento(s)`);
        console.log(`🐮 bois: ${totalBois} documento(s)`);

        const exemploUsuario = await db.collection("usuarios").findOne();
        console.log("\nExemplo de usuário salvo:", exemploUsuario);
    } catch (erro) {
        console.error("❌ Erro:", erro);
    } finally {
        await client.close();
    }
}

verificar();
