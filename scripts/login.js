/*
    Aqui ficam as funções que mexem com o login do usuário.
*/

let userCorreto = null;


// Valida se o usuário e a senha informados são corretos.
async function validarUser(usuario, senha) {
    try {
        const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario.trim(),
                senha
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok || !resultado.success) {
            return false;
        }

        userCorreto = resultado.usuario;

        localStorage.setItem("usuario_id", userCorreto.id);

        return true;

    } catch (error) {
        console.error("Erro ao validar usuário:", error);
        return false;
    }
}


// Recebe os dados do formulário e realiza o login.
async function login() {
    const usuarioRecebe = document.getElementById("user").value;
    const senhaRecebe = document.getElementById("senha").value;

    if (await validarUser(usuarioRecebe, senhaRecebe)) {

        document.getElementById("user").value = "";
        document.getElementById("senha").value = "";

        localStorage.setItem("logado", "true");
        localStorage.setItem("usuario_id", userCorreto.id);

        window.location.href = "../index.html";

    } else {
        aparecerAnimado(document.getElementById("mensagem"));
    }
}


// Realiza o logout do usuário.
function loginOut() {
    localStorage.removeItem("logado");
    localStorage.removeItem("usuario_id");

    userCorreto = null;

    window.location.href = "Login/login.html";
}