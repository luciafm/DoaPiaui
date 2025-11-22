import express from "express";
import cors from "cors";
import { db } from "./firebase-admin.js";

const app = express();
app.use(express.json());
app.use(cors());

// =========================
// ROTAS DE ITENS (Sprint)
// =========================

// Criar item
app.post("/item", async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ erro: "Corpo da requisição vazio." });
    }

    const ref = await db.collection("itens").add(data);

    res.json({ id: ref.id, ...data });
  } catch (err) {
    console.error("Erro ao criar item:", err);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// Listar itens
app.get("/item", async (req, res) => {
  try {
    const snap = await db.collection("itens").get();
    const itens = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    res.json(itens);
  } catch (err) {
    console.error("Erro ao listar itens:", err);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// Buscar item por ID
app.get("/item/:id", async (req, res) => {
  try {
    const doc = await db.collection("itens").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ erro: "Item não encontrado." });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Erro ao buscar item:", err);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// Atualizar item
app.put("/item/:id", async (req, res) => {
  try {
    const data = req.body;

    await db.collection("itens").doc(req.params.id).update(data);

    res.json({ msg: "Item atualizado.", id: req.params.id });
  } catch (err) {
    console.error("Erro ao atualizar item:", err);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// Deletar item
app.delete("/item/:id", async (req, res) => {
  try {
    await db.collection("itens").doc(req.params.id).delete();

    res.json({ msg: "Item deletado." });
  } catch (err) {
    console.error("Erro ao deletar item:", err);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// =========================
// ROTAS DE DOAÇÕES
// =========================

// Listar doações
app.get("/doacoes", async (req, res) => {
  try {
    const snapshot = await db
      .collection("doacoes")
      .orderBy("criadoEm", "desc")
      .get();

    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      doacoes: lista,
    });
  } catch (error) {
    console.error("Erro ao listar doações:", error);
    res.status(500).json({
      success: false,
      msg: "Erro ao listar doações",
      error: error.message,
    });
  }
});

// Busca simples por nome, categoria e bairro
app.get("/buscar", async (req, res) => {
  try {
    const { nome, categoria, bairro } = req.query;

    let query = db.collection("doacoes");

    if (nome) {
      query = query
        .where("nome", ">=", nome)
        .where("nome", "<=", nome + "\uf8ff");
    }

    if (categoria) {
      query = query.where("categoria", "==", categoria);
    }

    if (bairro) {
      query = query.where("bairro", "==", bairro);
    }

    const snapshot = await query.get();

    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      doacoes: lista,
    });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({
      success: false,
      msg: "Erro ao buscar doações",
      error: error.message,
    });
  }
});

// Link automático do WhatsApp
app.get("/doacoes/:id/whatsapp", async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("doacoes").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        msg: "Doação não encontrada",
      });
    }

    const doacao = doc.data();

    if (!doacao.whatsapp) {
      return res.status(400).json({
        success: false,
        msg: "Essa doação não tem WhatsApp cadastrado",
      });
    }

    const numero = doacao.whatsapp.replace(/\D/g, "");
    const texto = encodeURIComponent(
      `Olá! Tenho interesse na sua doação: ${doacao.nome}`
    );

    const link = `https://wa.me/${numero}?text=${texto}`;

    res.status(200).json({
      success: true,
      link,
    });
  } catch (error) {
    console.error("Erro ao gerar link do WhatsApp:", error);
    res.status(500).json({
      success: false,
      msg: "Erro ao gerar link",
      error: error.message,
    });
  }
});

// =========================
// INICIAR SERVIDOR
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
