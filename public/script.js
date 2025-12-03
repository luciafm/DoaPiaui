async function carregar() {
  try {
    const req = await fetch("http://localhost:3000/usuarios");
    const dados = await req.json();

    document.getElementById("saida").textContent =
      JSON.stringify(dados, null, 2);

  } catch (e) {
    document.getElementById("saida").textContent =
      "Erro: " + e.message;
  }
}

carregar();
