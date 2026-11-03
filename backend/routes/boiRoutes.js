const express = require("express");
const router = express.Router();

const boiController = require("../controllers/boiController");

router.get("/", boiController.listar);
router.post("/", boiController.cadastrar);
router.put("/:id", boiController.atualizar);
router.delete("/:id", boiController.remover);

module.exports = router;