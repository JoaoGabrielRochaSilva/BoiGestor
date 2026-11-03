/*
    Busca todos os usuários cadastrados no sistema.
*/
async function buscarUsuarios() {
    try {
        const resposta = await fetch(`${API_BASE_URL}/usuarios`);

        const resultado = await resposta.json();

        if (!resposta.ok) {
            console.error("Erro ao buscar usuários:", resultado.message);
            return [];
        }

        return Array.isArray(resultado) ? resultado : [];

    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return [];
    }
}