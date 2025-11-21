console.log("validacao.js carregado!");

// --------------------------------------
// FUNÇÃO DE TOAST BONITO
// --------------------------------------
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

// --------------------------------------
// FUNÇÕES DE VALIDAÇÃO PROFISSIONAIS
// --------------------------------------

// Nome mínimo 3 caracteres
function validarNome(nome) {
  return nome.trim().length >= 3;
}

// Email com regex mais completo
function validarEmail(email) {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexEmail.test(email);
}

// Senha forte: mínimo 8, máximo 32 caracteres + requisitos
function validarSenhaForte(senha) {
  const tamMin = 8;
  const tamMax = 32;

  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

  if (senha.length < tamMin) {
    Swal.fire({
      icon: "error",
      title: "Senha muito curta",
      text: `A senha deve ter no mínimo ${tamMin} caracteres.`
    });
    return false;
  }

  if (senha.length > tamMax) {
    Swal.fire({
      icon: "error",
      title: "Senha muito longa",
      text: `A senha pode ter no máximo ${tamMax} caracteres.`
    });
    return false;
  }

  if (!temMaiuscula || !temMinuscula || !temNumero || !temEspecial) {
    Swal.fire({
      icon: "error",
      title: "Senha fraca",
      text: "A senha deve conter letra maiúscula, minúscula, número e símbolo."
    });
    return false;
  }

  return true;
}

// WhatsApp com 11 dígitos e começando com 9
function validarWhatsapp(valor) {
  const numeros = valor.replace(/\D/g, "");
  return numeros.length === 11 && numeros[2] === "9";
}

// Bairro com mínimo 2 caracteres
function validarBairro(bairro) {
  return bairro.trim().length >= 2;
}

// ------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------
const loginForm = document.getElementById("formLogin");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("emailLogin").value.trim();
    const senha = document.getElementById("senhaLogin").value.trim();

    // -----------------------------
    // VALIDAÇÕES INSTANTÂNEAS
    // -----------------------------

    if (!email) {
      return Swal.fire({
        icon: "error",
        title: "Email obrigatório",
        text: "Digite seu email para continuar."
      });
    }

    if (!validarEmail(email)) {
      return Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "O email digitado não está no formato correto."
      });
    }

    if (!senha) {
      return Swal.fire({
        icon: "error",
        title: "Senha obrigatória",
        text: "Digite sua senha."
      });
    }

    // -----------------------------
    // ENVIO PARA O BACKEND
    // -----------------------------
    try {
      const resp = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      let json = {};

      try {
        json = await resp.json();
      } catch {
        json = {};
      }

      if (resp.status === 200) {
        if (json.usuario) {
          salvarUsuario(json.usuario);
        }

        toast("success", "Login realizado com sucesso!");

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);

      } else {
        Swal.fire({
          icon: "error",
          title: "Login inválido",
          text: json.msg || "Email ou senha incorretos."
        });
      }

    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Erro de conexão",
        text: "Não foi possível conectar ao servidor."
      });
    }
  });
}



// ------------------------------------------------------------
// CADASTRO
// ------------------------------------------------------------
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

    // ------------------------
    // VALIDAÇÕES PROFISSIONAIS
    // ------------------------

    if (!validarNome(nome)) {
      return Swal.fire({
        icon: "error",
        title: "Nome inválido",
        text: "O nome deve ter no mínimo 3 caracteres."
      });
    }

    if (!validarEmail(email)) {
      return Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "O email digitado está incorreto. Exemplo: exemplo@gmail.com"
      });
    }

    if (!validarSenhaForte(senha)) {
      return;
    }

    if (senha !== confirmarSenha) {
      return Swal.fire({
        icon: "error",
        title: "Senhas não coincidem",
        text: "As senhas devem ser iguais."
      });
    }

    if (!validarWhatsapp(whatsapp)) {
      return Swal.fire({
        icon: "error",
        title: "WhatsApp inválido",
        text: "Digite um número com DDD e 11 dígitos. Ex: (86) 99999-9999"
      });
    }

    if (!validarBairro(bairro)) {
      return Swal.fire({
        icon: "error",
        title: "Bairro inválido",
        text: "Digite um bairro válido."
      });
    }

    // ------------------------
    // ENVIO PARA O BACKEND
    // ------------------------
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
        toast("success", "Cadastro realizado com sucesso!");

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);

      } else {
        toast("error", json.msg || "Erro ao cadastrar");
      }

    } catch (error) {
      console.error(error);
      toast("error", "Erro ao conectar ao servidor");
    }
  });
}
