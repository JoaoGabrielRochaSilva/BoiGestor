const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "boiGestorDB";

let client;
let db;

async function conectarBanco() {
    if (!uri) {
        throw new Error("MONGODB_URI não encontrada no arquivo .env");
    }

    client = new MongoClient(uri);

    await client.connect();

    db = client.db(dbName);

    console.log(`Conectado ao MongoDB Atlas! Banco: ${dbName}`);
}

function getDB() {
    if (!db) {
        throw new Error("Banco de dados não conectado.");
    }

    return db;
}

module.exports = {
    conectarBanco,
    getDB
};