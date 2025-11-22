import express from "express";
import cors from "cors";
import { db } from "./firebase-admin.js"; // importa do teu arquivo certinho

const app = express();
app.use(express.json());
app.use(cors());

// =========================
// ROTAS DA SPRINT
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

// Buscar 1 item
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
// INICIAR SERVIDOR
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
