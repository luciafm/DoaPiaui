import { salvarUsuario } from "./app.js";

console.log("validacao.js carregado!");

// Função de toast
function toast(icon, title) {
  Swal.fire({
    icon,
    title,
    toast: true,
    position: "top-end",
    timer: 2000,
    showConfirmButton: false
  });
}

// Validações (email, senha etc) permanecem iguais

// -----------------------------
// LOGIN
// -----------------------------
const loginForm = document.getElementById("formLogin");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("emailLogin").value.trim();
    const senha = document.getElementById("senhaLogin").value.trim();

    if (!email) return Swal.fire({ icon:"error", title:"Email obrigatório" });
    if (!senha) return Swal.fire({ icon:"error", title:"Senha obrigatória" });

    try {
      const resp = await fetch("https://doapiaui.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const json = await resp.json();

      if (resp.status === 200 && json.usuario) {
        salvarUsuario(json.usuario);
        toast("success", "Login realizado com sucesso!");
        setTimeout(() => window.location.href = "pages/doacoes.html", 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Login inválido",
          text: json.msg || "Email ou senha incorretos."
        });
      }

    } catch (err) {
      console.error(err);
      Swal.fire({ icon:"error", title:"Erro de conexão", text:"Não foi possível conectar ao servidor." });
    }
  });
}
