const express = require("express");
const router = express.Router();
const db = require("./db");

// ========== LOGIN ==========
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const snap = await db
      .collection("usuarios")
      .where("email", "==", email)
      .where("senha", "==", senha)
      .get();

    if (snap.empty) {
      return res.status(400).json({ msg: "Email ou senha incorretos" });
    }

    const usuario = { id: snap.docs[0].id, ...snap.docs[0].data() };
    res.json({ usuario });

  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// ========= CADASTRAR USUÁRIO ===========
router.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, senha, whatsapp, bairro } = req.body;

    const doc = await db.collection("usuarios").add({
      nome,
      email,
      senha,
      whatsapp,
      bairro,
      criadoEm: new Date()
    });

    res.json({ id: doc.id });

  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// ========== LISTAR DOAÇÕES ==========
router.get("/doacoes", async (req, res) => {
  try {
    const snap = await db.collection("doacoes").get();

    const dados = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ doacoes: dados });

  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

module.exports = router;

// Cadastrar nova doação
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
