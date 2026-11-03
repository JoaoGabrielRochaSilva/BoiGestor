const { ObjectId } = require("mongodb");

const boiDAO = require("../models/boiDAO");
const historicoDAO = require("../models/historicoDAO");

async function cadastrar(req, res) {
    try {
        const {
            nome,
            ID,
            raca,
            tipo,
            peso,
            alimentacao,
            producao,
            vacina,
            usuario_id
        } = req.body;

        // Validação dos campos obrigatórios
        if (
            !nome?.trim() ||
            !ID?.toString().trim() ||
            !raca?.trim() ||
            !tipo?.trim() ||
            peso === undefined ||
            peso === null ||
            String(peso).trim() === "" ||
            !usuario_id
        ) {
            return res.status(400).json({
                success: false,
                message: "Preencha todos os campos obrigatórios."
            });
        }

        // Validação do peso
        const pesoNumerico = Number(peso);

        if (!Number.isFinite(pesoNumerico) || pesoNumerico <= 0) {
            return res.status(400).json({
                success: false,
                message: "O peso deve ser um número maior que zero."
            });
        }

        // Verifica se o ID já está cadastrado para esse usuário
        const boiExistente = await boiDAO.buscarPorIDAnimal(
            ID.toString().trim(),
            usuario_id
        );

        if (boiExistente) {
            return res.status(409).json({
                success: false,
                message: `Já existe um animal cadastrado com o ID ${ID}.`
            });
        }

        // Monta o objeto que será persistido
        const novoBoi = {
            nome: nome.trim(),
            ID: ID.toString().trim(),
            raca: raca.trim(),
            tipo: tipo.trim(),
            peso: pesoNumerico,
            alimentacao: alimentacao || "Normal",
            producao: producao || "Normal",
            vacina: vacina || "Em dia",
            usuario_id
        };

        const boiSalvo = await boiDAO.cadastrar(novoBoi);

        return res.status(201).json({
            success: true,
            message: "Animal cadastrado com sucesso!",
            boi: formatarDocumento(boiSalvo)
        });

    } catch (erro) {
        console.error("Erro ao cadastrar animal:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível cadastrar o animal."
        });
    }
}

function formatarDocumento(doc) {
    if (!doc) return doc;

    const { _id, ...resto } = doc;

    return {
        id: _id.toString(),
        ...resto
    };
}

// Lista todos os animais cadastrados
async function listar(req, res) {
    try {
        const { usuario_id } = req.query;

        const bois = await boiDAO.listar(usuario_id);

        return res.status(200).json(
            bois.map(boi => formatarDocumento(boi))
        );

    } catch (erro) {
        console.error("Erro ao listar animais:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível listar os animais."
        });
    }
}

// Atualiza os dados de um animal
async function atualizar(req, res) {
    try {
        const { id } = req.params;

        const {
            nome,
            ID,
            raca,
            tipo,
            peso,
            alimentacao,
            producao,
            vacina
        } = req.body;

        // Validação do ID do documento
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID do animal inválido."
            });
        }

        // Verifica se o animal existe
        const boiAntigo = await boiDAO.buscarPorId(id);

        if (!boiAntigo) {
            return res.status(404).json({
                success: false,
                message: "Animal não encontrado."
            });
        }

        // Validação dos campos obrigatórios
        if (
            !nome?.trim() ||
            !ID?.toString().trim() ||
            !raca?.trim() ||
            !tipo?.trim() ||
            peso === undefined ||
            peso === null ||
            String(peso).trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Preencha todos os campos obrigatórios."
            });
        }

        // Validação do peso
        const pesoNumerico = Number(peso);

        if (!Number.isFinite(pesoNumerico) || pesoNumerico <= 0) {
            return res.status(400).json({
                success: false,
                message: "O peso deve ser um número maior que zero."
            });
        }

        // Verifica se o ID já está cadastrado para esse usuário
        const boiExistente = await boiDAO.buscarPorIDAnimal(
            ID.toString().trim(),
            boiAntigo.usuario_id
        );

        if (
            boiExistente &&
            boiExistente._id.toString() !== id
        ) {
            return res.status(409).json({
                success: false,
                message: `Já existe um animal cadastrado com o ID ${ID}.`
            });
        }

        // Monta o objeto com os dados atualizados
        const boiAtualizado = {
            nome: nome.trim(),
            ID: ID.toString().trim(),
            raca: raca.trim(),
            tipo: tipo.trim(),
            peso: pesoNumerico,
            alimentacao: alimentacao || "Normal",
            producao: producao || "Normal",
            vacina: vacina || "Em dia",
            usuario_id: boiAntigo.usuario_id
        };

        const resultado = await boiDAO.atualizar(id, boiAtualizado);

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Animal não encontrado."
            });
        }

        // Registra as alterações no histórico
        await historicoDAO.registrar({
            boi_id: id,
            data_alteracao: new Date(),
            dados_antigos: boiAntigo,
            dados_novos: {
                _id: boiAntigo._id,
                ...boiAtualizado
            }
        });

        return res.status(200).json({
            success: true,
            message: "Animal atualizado com sucesso!",
            boi: {
                id,
                ...boiAtualizado
            }
        });

    } catch (erro) {
        console.error("Erro ao atualizar animal:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível atualizar o animal."
        });
    }
}

// Remove um animal cadastrado
async function remover(req, res) {
    try {
        const { id } = req.params;

        // Validação do ID do documento
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID do animal inválido."
            });
        }

        // Verifica se o animal existe
        const boiExistente = await boiDAO.buscarPorId(id);

        if (!boiExistente) {
            return res.status(404).json({
                success: false,
                message: "Animal não encontrado."
            });
        }

        const resultado = await boiDAO.remover(id);

        if (resultado.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Animal não encontrado."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Animal removido com sucesso!"
        });

    } catch (erro) {
        console.error("Erro ao remover animal:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível remover o animal."
        });
    }
}

// Formata o documento retornado pelo MongoDB
function formatarDocumento(doc) {
    if (!doc) return doc;

    const { _id, ...resto } = doc;

    return {
        id: _id.toString(),
        ...resto
    };
}

module.exports = {
    listar,
    cadastrar,
    atualizar,
    remover
};