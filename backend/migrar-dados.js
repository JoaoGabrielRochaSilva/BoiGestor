/*
    Script de migração de dados: Supabase -> MongoDB Atlas
    --------------------------------------------------------
    Esse script é pra ser rodado UMA VEZ SÓ, manualmente, pelo terminal:

        node migrar-dados.js

    Ele faz o seguinte:
    1. Conecta no Supabase (usando as mesmas credenciais que já
       estavam no seu scripts/supabase.js antigo) e baixa todos os
       registros das tabelas "usuarios" e "bois".
    2. Conecta no MongoDB Atlas (usando o .env).
    3. Insere os "usuarios" no Mongo, guardando qual "id" novo
       (gerado pelo Mongo) corresponde a qual "id" antigo (do Supabase).
    4. Insere os "bois", já trocando o campo usuario_id antigo
       pelo novo id do Mongo, pra manter a ligação entre boi e dono.

    IMPORTANTE: rode esse script só uma vez. Se rodar de novo, ele
    vai duplicar os dados (ele não verifica se já rodou antes).
*/

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { MongoClient } = require("mongodb");

// Mesmas credenciais que estavam em scripts/supabase.js
const supabaseUrl = "https://gymkndwvevakskrgvdqa.supabase.co";
const supabaseKey = "sb_publishable_haOFszpBrraiwsP-lPRSvA_3zWPhfwb";
const supabase = createClient(supabaseUrl, supabaseKey);

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "boiGestorDB";

async function migrar() {
    const mongoClient = new MongoClient(mongoUri);

    try {
        console.log("Conectando no MongoDB Atlas...");
        await mongoClient.connect();
        const db = mongoClient.db(dbName);
        console.log("✅ Conectado no Mongo.");

        // ---------- 1. USUÁRIOS ----------
        console.log("\nBuscando usuários no Supabase...");
        const { data: usuariosSupabase, error: erroUsuarios } = await supabase
            .from("usuarios")
            .select("*");

        if (erroUsuarios) throw erroUsuarios;
        console.log(`Encontrados ${usuariosSupabase.length} usuário(s).`);

        // Mapa: id antigo (Supabase) -> id novo (Mongo, como string)
        const mapaIdsUsuarios = {};

        for (const usuarioAntigo of usuariosSupabase) {
            const { id: idAntigo, ...resto } = usuarioAntigo;
            const resultado = await db.collection("usuarios").insertOne(resto);
            mapaIdsUsuarios[idAntigo] = resultado.insertedId.toString();
        }
        console.log(`✅ ${usuariosSupabase.length} usuário(s) inserido(s) no Mongo.`);

        // ---------- 2. BOIS ----------
        console.log("\nBuscando bois no Supabase...");
        const { data: boisSupabase, error: erroBois } = await supabase
            .from("bois")
            .select("*");

        if (erroBois) throw erroBois;
        console.log(`Encontrados ${boisSupabase.length} boi(s).`);

        const boisConvertidos = boisSupabase.map((boiAntigo) => {
            const { id: idAntigo, usuario_id: usuarioIdAntigo, ...resto } = boiAntigo;
            return {
                ...resto,
                usuario_id: mapaIdsUsuarios[usuarioIdAntigo] || null,
            };
        });

        if (boisConvertidos.length > 0) {
            await db.collection("bois").insertMany(boisConvertidos);
        }
        console.log(`✅ ${boisConvertidos.length} boi(s) inserido(s) no Mongo.`);

        console.log("\n🎉 Migração concluída com sucesso!");
    } catch (erro) {
        console.error("\n❌ Erro durante a migração:", erro);
    } finally {
        await mongoClient.close();
    }
}

migrar();
