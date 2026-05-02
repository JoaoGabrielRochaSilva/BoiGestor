async function buscarUsuarios() {
  const { data, error } = await supabaseClient
    .from("usuarios")
    .select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}