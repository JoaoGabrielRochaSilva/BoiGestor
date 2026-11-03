const express = require("express");

const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

// Lista todos os usuários
router.get("/", usuarioController.listar);

// Busca um usuário pelo ID
router.get("/:id", usuarioController.buscarPorId);

// Cadastra um novo usuário
router.post("/", usuarioController.cadastrar);

// Atualiza um usuário
router.put("/:id", usuarioController.atualizar);

// Remove um usuário
router.delete("/:id", usuarioController.remover);

module.exports = router;