const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const usuarioDAO = require("../models/usuarioDAO");

// Lista todos os usuários cadastrados
async function listar(req, res) {
    try {
        const usuarios = await usuarioDAO.listar();

        return res.status(200).json(
            usuarios.map(formatarUsuario)
        );

    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível listar os usuários."
        });
    }
}

// Busca um usuário pelo ID
async function buscarPorId(req, res) {
    try {
        const { id } = req.params;

        // Validação do ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID do usuário inválido."
            });
        }

        const usuario = await usuarioDAO.buscarPorId(id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado."
            });
        }

        return res.status(200).json({
            success: true,
            usuario: formatarUsuario(usuario)
        });

    } catch (erro) {
        console.error("Erro ao buscar usuário:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível buscar o usuário."
        });
    }
}

// Cadastra um novo usuário
async function cadastrar(req, res) {
    try {
        const { username, senha } = req.body;

        // Validação dos campos obrigatórios
        if (
            !username?.trim() ||
            senha === undefined ||
            senha === null ||
            !String(senha).trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Preencha todos os campos obrigatórios."
            });
        }

        // Verifica se o nome de usuário já está cadastrado
        const usuarioExistente = await usuarioDAO.buscarPorUsuario(
            username.trim()
        );

        if (usuarioExistente) {
            return res.status(409).json({
                success: false,
                message: `O usuário ${username} já está cadastrado.`
            });
        }

        // Criptografa a senha antes de persistir
        const senhaCriptografada = await bcrypt.hash(
            String(senha),
            10
        );

        const novoUsuario = {
            username: username.trim(),
            senha: senhaCriptografada
        };

        const usuarioSalvo = await usuarioDAO.cadastrar(novoUsuario);

        return res.status(201).json({
            success: true,
            message: "Usuário cadastrado com sucesso!",
            usuario: formatarUsuario(usuarioSalvo)
        });

    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível cadastrar o usuário."
        });
    }
}

// Atualiza os dados de um usuário
async function atualizar(req, res) {
    try {
        const { id } = req.params;
        const { username, senha } = req.body;

        // Validação do ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID do usuário inválido."
            });
        }

        // Verifica se o usuário existe
        const usuarioAntigo = await usuarioDAO.buscarPorId(id);

        if (!usuarioAntigo) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado."
            });
        }

        // Validação dos campos enviados
        if (
            username !== undefined && !username?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "O nome de usuário não pode ficar vazio."
            });
        }

        if (
            senha !== undefined &&
            (senha === null || !String(senha).trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "A senha não pode ficar vazia."
            });
        }

        // Verifica se existe alguma informação para atualizar
        if (username === undefined && senha === undefined) {
            return res.status(400).json({
                success: false,
                message: "Informe pelo menos um campo para atualizar."
            });
        }

        // Verifica se o novo username já pertence a outro usuário
        if (
            username !== undefined &&
            username.trim() !== usuarioAntigo.username
        ) {
            const usuarioExistente = await usuarioDAO.buscarPorUsuario(
                username.trim()
            );

            if (
                usuarioExistente &&
                usuarioExistente._id.toString() !== id
            ) {
                return res.status(409).json({
                    success: false,
                    message: `O usuário ${username} já está cadastrado.`
                });
            }
        }

        // Monta o objeto com os dados atualizados
        const dadosAtualizados = {};

        if (username !== undefined) {
            dadosAtualizados.username = username.trim();
        }

        if (senha !== undefined) {
            dadosAtualizados.senha = await bcrypt.hash(
                String(senha),
                10
            );
        }

        const resultado = await usuarioDAO.atualizar(
            id,
            dadosAtualizados
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado."
            });
        }

        const usuarioAtualizado = await usuarioDAO.buscarPorId(id);

        return res.status(200).json({
            success: true,
            message: "Usuário atualizado com sucesso!",
            usuario: formatarUsuario(usuarioAtualizado)
        });

    } catch (erro) {
        console.error("Erro ao atualizar usuário:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível atualizar o usuário."
        });
    }
}

// Remove um usuário cadastrado
async function remover(req, res) {
    try {
        const { id } = req.params;

        // Validação do ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID do usuário inválido."
            });
        }

        // Verifica se o usuário existe
        const usuarioExistente = await usuarioDAO.buscarPorId(id);

        if (!usuarioExistente) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado."
            });
        }

        const resultado = await usuarioDAO.remover(id);

        if (resultado.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuário removido com sucesso!"
        });

    } catch (erro) {
        console.error("Erro ao remover usuário:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível remover o usuário."
        });
    }
}

// Formata o documento e impede o envio da senha
function formatarUsuario(doc) {
    if (!doc) return doc;

    const { _id, senha, ...resto } = doc;

    return {
        id: _id.toString(),
        ...resto
    };
}

module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    atualizar,
    remover
};