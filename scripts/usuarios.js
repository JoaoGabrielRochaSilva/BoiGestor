async function buscarUsuarios() {
  try {
    const resposta = await fetch(`${API_BASE_URL}/usuarios`);

    if (!resposta.ok) {
      console.log("Erro ao buscar usuários:", resposta.statusText);
      return [];
    }

    return await resposta.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}