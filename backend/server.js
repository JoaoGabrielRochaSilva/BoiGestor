/*
    Servidor Backend do Boi Gestor
    ------------------------------
    Esse arquivo substitui o Supabase.
    Ele é quem realmente conversa com o MongoDB Atlas.
    O navegador (front-end) nunca fala direto com o banco:
    ele manda pedidos (fetch) pra esse servidor, e o servidor
    fala com o MongoDB usando o driver oficial do Node.js.
*/

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que o front-end (rodando em outra porta/origem) acesse essa API
app.use(cors());
// Permite receber JSON no corpo das requisições (req.body)
app.use(express.json());

// String de conexão e nome do banco vêm do arquivo .env (NUNCA direto no código)
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "boiGestorDB";

// Confere se o .env foi carregado corretamente antes de tentar conectar.
// Sem isso, o erro que aparece é bem confuso (undefined.startsWith).
if (!uri) {
    console.error("❌ MONGODB_URI não foi encontrada.");
    console.error("   Verifique se existe um arquivo '.env' dentro da pasta 'backend/'");
    console.error("   (mesmo nível de server.js), com a linha MONGODB_URI=... preenchida.");
    process.exit(1);
}

const client = new MongoClient(uri);
let db;

// Conecta no MongoDB Atlas uma única vez, quando o servidor sobe
async function conectarBanco() {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log(`✅ Conectado ao MongoDB Atlas! Banco: ${dbName}`);
    } catch (erro) {
        console.error("❌ Erro ao conectar no MongoDB Atlas:", erro);
        process.exit(1);
    }
}

// Transforma o _id do Mongo (ObjectId) em "id" (string), pra ficar parecido
// com o formato que o front-end já usava com o Supabase
function formatarDocumento(doc) {
    if (!doc) return doc;
    const { _id, ...resto } = doc;
    return { id: _id.toString(), ...resto };
}

// Rota "/" só existe pra confirmar que o servidor está de pé.
// O site em si (index.html/login.html) NÃO roda aqui — ele roda no Live Server,
// e por trás dos panos ele chama as rotas /api/... deste servidor.
app.get("/", (req, res) => {
    res.send("✅ Servidor Boi Gestor rodando! Abra o index.html/login.html pelo Live Server para usar o sistema.");
});

/* ---------------------------------------------------
   ROTA: LOGIN
   Recebe usuario/senha e verifica na coleção "usuarios"
--------------------------------------------------- */
app.post("/api/login", async (req, res) => {
    try {
        const { usuario, senha } = req.body;

        // Busca só pelo username. A senha é comparada depois, como texto,
        // porque no banco ela pode ter ficado salva como número (ex: 321)
        // em vez de texto (ex: "321"), e o Mongo é rígido com tipos.
        const usuarioEncontrado = await db
            .collection("usuarios")
            .findOne({ username: usuario });

        const senhaBate =
            usuarioEncontrado && String(usuarioEncontrado.senha) === String(senha);

        if (senhaBate) {
            res.json({ success: true, usuario: formatarDocumento(usuarioEncontrado) });
        } else {
            res.json({ success: false });
        }
    } catch (erro) {
        console.error("Erro no /api/login:", erro);
        res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
});

/* ---------------------------------------------------
   ROTA: LISTAR USUÁRIOS
--------------------------------------------------- */
app.get("/api/usuarios", async (req, res) => {
    try {
        const usuarios = await db.collection("usuarios").find({}).toArray();
        res.json(usuarios.map(formatarDocumento));
    } catch (erro) {
        console.error("Erro no /api/usuarios:", erro);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

/* ---------------------------------------------------
   ROTA: LISTAR BOIS DE UM USUÁRIO
   GET /api/bois?usuario_id=xxxx
--------------------------------------------------- */
app.get("/api/bois", async (req, res) => {
    try {
        const { usuario_id } = req.query;

        const filtro = usuario_id ? { usuario_id: usuario_id } : {};
        const bois = await db.collection("bois").find(filtro).toArray();

        res.json(bois.map(formatarDocumento));
    } catch (erro) {
        console.error("Erro no GET /api/bois:", erro);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

/* ---------------------------------------------------
   ROTA: ADICIONAR UM BOI
   POST /api/bois
--------------------------------------------------- */
app.post("/api/bois", async (req, res) => {
    try {
        const novoBoi = req.body;
        const resultado = await db.collection("bois").insertOne(novoBoi);

        res.json({
            success: true,
            boi: formatarDocumento({ _id: resultado.insertedId, ...novoBoi }),
        });
    } catch (erro) {
        console.error("Erro no POST /api/bois:", erro);
        res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
});

/* ---------------------------------------------------
   ROTA: ATUALIZAR UM BOI (usada futuramente pela função Salvar)
   PUT /api/bois/:id
--------------------------------------------------- */
app.put("/api/bois/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        await db
            .collection("bois")
            .updateOne({ _id: new ObjectId(id) }, { $set: dadosAtualizados });

        res.json({ success: true });
    } catch (erro) {
        console.error("Erro no PUT /api/bois/:id:", erro);
        res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
});

/* ---------------------------------------------------
   ROTA: REMOVER UM BOI (usada futuramente pela função removerAnimal)
   DELETE /api/bois/:id
--------------------------------------------------- */
app.delete("/api/bois/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection("bois").deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true });
    } catch (erro) {
        console.error("Erro no DELETE /api/bois/:id:", erro);
        res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
});

// Sobe o servidor só depois de garantir a conexão com o banco
conectarBanco().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
});
