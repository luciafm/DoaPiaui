// Função para verificar se há usuário logado
export function getUsuarioLogado() {
  return JSON.parse(localStorage.getItem("usuario")) || null;
}

// Função para salvar usuário no navegador
export function salvarUsuario(usuario) {
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

// Função de logout
export function logout() {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

console.log("app.js carregado!");

// --- Proteção automática de páginas ---
document.addEventListener("DOMContentLoaded", () => {
  const protegido = document.body.getAttribute("data-protegido");
  if (protegido === "true") {
    const usuario = getUsuarioLogado();
    if (!usuario) {
      window.location.href = "login.html";
    }
  }
});