/* 
    Aqui ficam as funções que mexem com o login do usuário
*/

let userCorreto = null;

// Valida se o user e a senha informada são corretos (usando Supabase)
async function validarUser(usuario, senha) {
    const { data, error } = await supabaseClient
        .from("usuarios")
        .select("*")
        .eq("username", usuario)
        .eq("senha", senha);

    if (error) {
        console.log("Erro:", error);
        return false;
    }

    if (data.length > 0) {
        userCorreto = data[0];
        localStorage.setItem("usuario_id", userCorreto.id);
        return true;
    }

    return false;
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