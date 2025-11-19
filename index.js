import { criarConta, loginUser } from "./auth.js";
import { criarDoacao } from "./db.js";

async function teste() {
  try {
    const user = await criarConta("teste@gmail.com", "123456");
    console.log("Criado:", user.user.email);

    const login = await loginUser("teste@gmail.com", "123456");
    console.log("Logado:", login.user.email);
  } catch (e) {
    console.error("Erro:", e);
  }
}

async function main() {
  try {
    await criarDoacao({
      titulo: "Cesta Básica",
      descricao: "Alimentos diversos",
      status: "aberto",
      criadoEm: new Date()
    });

    await teste();
  } catch (e) {
    console.error("Erro:", e);
  }
}

main();
