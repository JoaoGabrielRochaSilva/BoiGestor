/* 
    Aqui ficam as funções que mexem com o login do usuário
*/

let userCorreto = null;

// Valida se o user e a senha informada são corretos (usando o backend + MongoDB)
async function validarUser(usuario, senha) {
    try {
        const resposta = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, senha })
        });

        const resultado = await resposta.json();

        if (resultado.success) {
            userCorreto = resultado.usuario;
            localStorage.setItem("usuario_id", userCorreto.id);
            return true;
        }

        return false;
    } catch (error) {
        console.log("Erro:", error);
        return false;
    }
}

// recebe o login do usuario
async function login() {
    let useRecebe = document.getElementById("user").value;
    let senhaRecebe = document.getElementById("senha").value;

    if (await validarUser(useRecebe, senhaRecebe))  {
        document.getElementById("user").value = "";
        document.getElementById("senha").value = "";

        localStorage.setItem("logado", "true");
        localStorage.setItem("usuario_id", userCorreto.id);

        window.location.href = "../index.html";

    } else {
        aparecerAnimado(document.getElementById("mensagem"));
    }
}

// Sai do usuario
function loginOut() {
    localStorage.removeItem("logado");
    localStorage.removeItem("usuario_id");
    window.location.href = "Login/login.html";
}