const bcrypt = require("bcrypt");
const usuarioDAO = require("../models/usuarioDAO");

async function login(req, res) {
    try {
        const { usuario, senha } = req.body || {};

        // Verifica se os campos foram preenchidos.
        if (!usuario?.trim() || senha === undefined || senha === null || String(senha).trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Informe o usuário e a senha."
            });
        }

        // Busca o usuário pelo username cadastrado no banco.
        const usuarioEncontrado = await usuarioDAO.buscarPorUsuario(usuario.trim());

        // Não informa se o erro foi no usuário ou na senha.
        if (!usuarioEncontrado) {
            return res.status(401).json({
                success: false,
                message: "Usuário ou senha inválidos."
            });
        }

        const senhaInformada = String(senha);
        const senhaArmazenada = String(usuarioEncontrado.senha);

        // Verifica se a senha armazenada já está no formato bcrypt.
        const senhaEhHash = /^\$2[aby]\$\d{2}\$/.test(senhaArmazenada);

        let senhaValida = false;

        if (senhaEhHash) {
            // Compara a senha informada com o hash armazenado.
            senhaValida = await bcrypt.compare(
                senhaInformada,
                senhaArmazenada
            );
        } else {
            // Compatibilidade com usuários antigos que possuem senha em texto puro.
            senhaValida = senhaArmazenada === senhaInformada;

            if (senhaValida) {
                // Atualiza a senha antiga para um hash bcrypt.
                const novaSenha = await bcrypt.hash(senhaInformada, 10);

                await usuarioDAO.atualizar(
                    usuarioEncontrado._id.toString(),
                    { senha: novaSenha }
                );
            }
        }

        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                message: "Usuário ou senha inválidos."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login realizado com sucesso!",
            usuario: formatarUsuario(usuarioEncontrado)
        });

    } catch (erro) {
        console.error("Erro ao realizar login:", erro);

        return res.status(500).json({
            success: false,
            message: "Não foi possível realizar o login."
        });
    }
}

// Remove a senha e converte o _id do MongoDB para id.
function formatarUsuario(doc) {
    if (!doc) return doc;

    const { _id, senha, ...resto } = doc;

    return {
        id: _id.toString(),
        ...resto
    };
}

module.exports = { login };