const express = require("express");
const router = express.Router();
const { db, auth } = require("./db");

// ======================
// LOGIN
// ======================
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ msg: "Email e senha obrigatórios." });
    }

    const snapshot = await db.collection("usuarios")
      .where("email", "==", email)
      .where("senha", "==", senha)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ msg: "Usuário não encontrado." });
    }

    const user = snapshot.docs[0];
    res.json({ usuario: { id: user.id, ...user.data() } });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ msg: "Erro no login." });
  }
});


// ======================
// CADASTRAR USUARIO
// ======================
router.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, senha, whatsapp, bairro } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ msg: "Dados incompletos." });
    }

    const novo = {
      nome,
      email,
      senha,
      whatsapp: whatsapp || "",
      bairro: bairro || "",
      criadoEm: new Date().toISOString()
    };

    const doc = await db.collection("usuarios").add(novo);
    res.status(201).json({ id: doc.id, ...novo });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ msg: "Erro ao cadastrar usuário." });
  }
});


// ======================
// LISTAR DOACOES
// ======================
router.get("/doacoes", async (req, res) => {
  try {
    const snapshot = await db.collection("doacoes").get();
    const lista = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ doacoes: lista });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ msg: "Erro ao listar doações." });
  }
});


// ======================
// CADASTRAR DOACAO
// ======================
router.post("/doacoes", async (req, res) => {
  try {
    const { titulo, descricao, categoria, localizacao, imagem } = req.body;

    if (!titulo || !descricao) {
      return res.status(400).json({ msg: "Título e descrição são obrigatórios." });
    }

    const nova = {
      titulo,
      descricao,
      categoria: categoria || "Outro",
      localizacao: localizacao || "-",
      imagem: imagem || "",
      criadoEm: new Date().toISOString()
    };

    const doc = await db.collection("doacoes").add(nova);

    res.status(201).json({ id: doc.id, ...nova });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ msg: "Erro ao cadastrar doação." });
  }
});


module.exports = router;
