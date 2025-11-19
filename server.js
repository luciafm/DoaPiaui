import express from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const app = express();
app.use(cors());
app.use(express.json());

// Config do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPYjOTO3Rdu7Rt6JD0_mab0AV40eBqJL8",
  authDomain: "doacao-main.firebaseapp.com",
  projectId: "doacao-main",
  storageBucket: "doacao-main.firebasestorage.app",
  messagingSenderId: "600433774648",
  appId: "1:600433774648:web:43ad92080b25c98aec56cd"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ROTA POST
app.post("/doacoes", async (req, res) => {
  try {
    const data = req.body;

    await addDoc(collection(db, "doacoes"), data);

    res.status(201).json({ msg: "Doação adicionada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro ao salvar a porra da doação" });
  }
});

// Porta
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

//---------------------------------------------------------------------------

import { getDocs } from "firebase/firestore";

// LISTAR DOAÇÕES
app.get("/doacoes", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "doacoes"));
    const lista = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro ao listar as desgraças das doações" });
  }
});

