import { salvarUsuario } from "./app.js";

console.log("validacao.js carregado!");

// --- LOGIN ---
const loginForm = document.getElementById("formLogin");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;
    
    try {
      const resp = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });
      
      const json = await resp.json();
      
      if (resp.status === 200) {
        // Salva usuário caso venha do backend
        if (json.usuario) {
          salvarUsuario(json.usuario);
        }
        alert("Login realizado com sucesso!");
        window.location.href = "index.html";
      } else {
        alert(json.msg || "Erro ao fazer login");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar ao servidor");
    }
  });
}

// --- CADASTRO ---
const cadastroForm = document.getElementById("formCadastro");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const nome = document.getElementById("nomeCadastro").value;
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;
    const confirmarSenha = document.getElementById("confirmarCadastro").value;
    const whatsapp = document.getElementById("whatsappCadastro").value;
    const bairro = document.getElementById("bairroCadastro").value;

    // Validação das senhas
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const resp = await fetch("http://localhost:3000/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nome, 
          email, 
          senha, 
          whatsapp, 
          bairro 
        })
      });
      
      const json = await resp.json();
      
      if (resp.status === 201) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
      } else {
        alert(json.msg || "Erro ao cadastrar");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar ao servidor");
    }
  });
}