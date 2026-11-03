const express = require("express");
const router = express.Router();

const historicoController = require("../controllers/historicoController");

// Lista o histórico de um animal específico.
router.get("/:boi_id", historicoController.listarPorBoi);

// Cadastra um registro manual no histórico.
router.post("/", historicoController.cadastrar);

module.exports = router;