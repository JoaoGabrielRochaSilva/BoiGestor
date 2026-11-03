/*
    Servidor Backend do Boi Gestor

    Responsável por configurar o Express, conectar ao MongoDB
    e disponibilizar as rotas da API.
*/

// Carrega as variáveis do arquivo .env.
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { conectarBanco } = require("./config/database");

// Importação das rotas.
const boiRoutes = require("./routes/boiRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./routes/authRoutes");
const historicoRoutes = require("./routes/historicoRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações do Express.

// Permite que o front-end acesse a API.
app.use(cors());

// Permite receber dados no formato JSON.
app.use(express.json());


// Rota inicial para verificar se o servidor está funcionando.
app.get("/", (req, res) => {
    res.send(
        "Servidor Boi Gestor rodando! Abra o index.html/login.html pelo Live Server para utilizar o sistema."
    );
});


// Registro das rotas da API.

// Rotas dos animais.
app.use("/api/bois", boiRoutes);

// Rotas dos usuários.
app.use("/api/usuarios", usuarioRoutes);

// Rotas de autenticação.
app.use("/api/auth", authRoutes);

// Rotas do histórico.
app.use("/api/historico", historicoRoutes);


// Conecta ao MongoDB antes de iniciar o servidor.
async function iniciarServidor() {
    try {
        await conectarBanco();

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });

    } catch (erro) {
        console.error("Erro ao iniciar o servidor:", erro);
        process.exit(1);
    }
}

iniciarServidor();