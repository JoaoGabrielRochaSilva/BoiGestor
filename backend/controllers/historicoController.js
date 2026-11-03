const historicoDAO = require("../models/historicoDAO");

async function listarPorBoi(req, res) {
    try {
        const { boi_id } = req.params;

        if (!boi_id?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Informe o ID do animal."
            });
        }

        const historico = await historicoDAO.buscarPorBoiId(boi_id.trim());

        // Mantém o retorno como array, conforme o funcionamento original.
        return res.status(200).json(
            historico.map(formatarDocumento)
        );

    } catch (erro) {
        console.error("Erro ao listar histórico do animal:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível consultar o histórico do animal."
        });
    }
}

async function cadastrar(req, res) {
    try {
        const {
            boi_id,
            usuario_id,
            peso,
            producao,
            alimentacao,
            data_alteracao,
            tipo_registro
        } = req.body || {};

        if (
            !boi_id?.trim() ||
            !usuario_id ||
            peso === undefined ||
            peso === null ||
            String(peso).trim() === "" ||
            !producao?.trim() ||
            !alimentacao?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Preencha todos os campos obrigatórios do histórico."
            });
        }

        const pesoNumerico = Number(peso);

        if (!Number.isFinite(pesoNumerico) || pesoNumerico <= 0) {
            return res.status(400).json({
                success: false,
                message: "O peso deve ser um número maior que zero."
            });
        }

        let dataRegistro = new Date();

        if (data_alteracao !== undefined && data_alteracao !== null) {
            dataRegistro = new Date(data_alteracao);

            if (Number.isNaN(dataRegistro.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Informe uma data válida para o histórico."
                });
            }
        }

        const novoHistorico = {
            boi_id: boi_id.trim(),
            usuario_id,
            peso: pesoNumerico,
            producao: producao.trim(),
            alimentacao: alimentacao.trim(),
            data_alteracao: dataRegistro,
            tipo_registro: tipo_registro?.trim() || "manual"
        };

        const historicoSalvo = await historicoDAO.registrar(novoHistorico);

        return res.status(201).json({
            success: true,
            message: "Registro do histórico cadastrado com sucesso!",
            historico: formatarDocumento(historicoSalvo)
        });

    } catch (erro) {
        console.error("Erro ao cadastrar histórico:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível cadastrar o registro no histórico."
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

module.exports = {
    listarPorBoi,
    cadastrar
};