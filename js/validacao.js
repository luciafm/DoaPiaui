// Seleciona o formulário
const formCriar = document.querySelector("form");

if (formCriar) {
  formCriar.addEventListener("submit", function (event) {
    event.preventDefault();

    // pega os campos
    const nome = document.querySelector("#nome");
    const email = document.querySelector("#email");
    const senha = document.querySelector("#senha");
    const confirmar = document.querySelector("#confirmar");
    const whatsapp = document.querySelector("#whatsapp");
    const bairro = document.querySelector("#bairro");

    // resetar erros
    document.querySelectorAll(".erro").forEach(e => e.remove());

    let valido = true;

    // função auxiliar para erro
    function erro(campo, mensagem) {
      valido = false;
      campo.style.borderColor = "red";

      const msg = document.createElement("p");
      msg.classList.add("erro");
      msg.style.color = "red";
      msg.style.fontSize = "13px";
      msg.style.marginTop = "-10px";
      msg.style.marginBottom = "10px";
      msg.textContent = mensagem;
      campo.insertAdjacentElement("afterend", msg);
    }

    // nome
    if (nome.value.trim() === "") erro(nome, "Nome obrigatório.");

    // email
    const regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(email.value)) erro(email, "Email inválido.");

    // senha
    if (senha.value.length < 6) erro(senha, "A senha deve ter pelo menos 6 caracteres.");

    // confirmar senha
    if (confirmar.value !== senha.value) erro(confirmar, "As senhas não coincidem.");

    // whatsapp
    if (whatsapp.value.trim().length < 9) erro(whatsapp, "Digite um número válido.");

    // bairro
    if (bairro.value.trim() === "") erro(bairro, "Bairro obrigatório.");

    // se estiver válido → enviar para firebase depois
    if (valido) {
      alert("Campos válidos! Agora pode enviar ao Firebase.");
      formCriar.submit(); // ou chamar função de criar conta
    }
  });
}

const formLogin = document.querySelector("#formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.querySelector("#emailLogin");
    const senha = document.querySelector("#senhaLogin");

    document.querySelectorAll(".erro").forEach(e => e.remove());
    let valido = true;

    function erro(campo, mensagem) {
      valido = false;
      campo.style.borderColor = "red";
      const msg = document.createElement("p");
      msg.classList.add("erro");
      msg.style.color = "red";
      msg.style.fontSize = "13px";
      msg.textContent = mensagem;
      campo.insertAdjacentElement("afterend", msg);
    }

    if (!/\S+@\S+\.\S+/.test(email.value)) erro(email, "Email inválido.");
    if (senha.value.trim() === "") erro(senha, "Digite sua senha.");

    if (valido) {
      alert("Login válido! Agora pode chamar loginUser().");
      formLogin.submit();
    }
  });
}
