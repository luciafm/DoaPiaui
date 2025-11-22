import express from "express";
import cors from "cors";
import { db } from "./firebase-admin.js";

const app = express();
app.use(cors());
app.use(express.json());

// ============================
// ROTA DE TESTE
// ============================
app.get("/", (req, res) => {
    res.send("Backend funcionando!");
});

// ============================
// CADASTRO
// ============================
app.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha, whatsapp, bairro } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                success: false,
                msg: "Preencha nome, email e senha"
            });
        }

        const usuariosRef = db.collection("usuarios");
        const snapshot = await usuariosRef.where("email", "==", email).get();

        if (!snapshot.empty) {
            return res.status(400).json({
                success: false,
                msg: "Email já cadastrado"
            });
        }

        const novoUsuario = {
            nome,
            email,
            senha, // EM PRODUÇÃO USA HASH, SEU ANIMAL
            whatsapp: whatsapp || "",
            bairro: bairro || "",
            criadoEm: new Date().toISOString()
        };

        const docRef = await usuariosRef.add(novoUsuario);

        res.status(201).json({
            success: true,
            msg: "Cadastro realizado com sucesso!",
            id: docRef.id
        });

    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.status(500).json({
            success: false,
            msg: "Erro ao cadastrar usuário",
            error: error.message
        });
    }
});

// ============================
// LOGIN
// ============================
app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                msg: "Preencha email e senha"
            });
        }

        const usuariosRef = db.collection("usuarios");
        const snapshot = await usuariosRef.where("email", "==", email).get();

        if (snapshot.empty) {
            return res.status(401).json({
                success: false,
                msg: "Email ou senha incorretos"
            });
        }

        const usuarioDoc = snapshot.docs[0];
        const usuario = usuarioDoc.data();

        if (usuario.senha !== senha) {
            return res.status(401).json({
                success: false,
                msg: "Email ou senha incorretos"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Login realizado com sucesso!",
            usuario: {
                id: usuarioDoc.id,
                nome: usuario.nome,
                email: usuario.email,
                whatsapp: usuario.whatsapp,
                bairro: usuario.bairro,
                criadoEm: usuario.criadoEm
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({
            success: false,
            msg: "Erro ao fazer login",
            error: error.message
        });
    }
});

// ============================
// DOAÇÕES — SPRINT
// ============================

// LISTAR TODAS AS DOAÇÕES
app.get("/doacoes", async (req, res) => {
    try {
        const snap = await db.collection("doacoes").get();
        const lista = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(lista);
    } catch (error) {
        res.status(500).json({
            msg: "Erro ao listar doações",
            error: error.message
        });
    }
});

// DETALHE DE UMA DOAÇÃO
app.get("/doacoes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const docRef = db.collection("doacoes").doc(id);
        const snap = await docRef.get();

        if (!snap.exists) {
            return res.status(404).json({ msg: "Doação não encontrada" });
        }

        const data = snap.data();

        // coloca o link do whatsapp pronto
        data.whatsappLink = `https://wa.me/${data.whatsappDoador}?text=Tenho interesse na doação: ${data.titulo}`;

        res.json({ id: snap.id, ...data });

    } catch (error) {
        res.status(500).json({
            msg: "Erro ao buscar doação",
            error: error.message
        });
    }
});

// BUSCA POR TEXTO (TÍTULO / DESCRIÇÃO)
app.get("/busca/:termo", async (req, res) => {
    try {
        const termo = req.params.termo.toLowerCase();

        const snap = await db.collection("doacoes").get();
        const lista = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const filtrados = lista.filter(x =>
            x.titulo.toLowerCase().includes(termo) ||
            x.descricao.toLowerCase().includes(termo)
        );

        res.json(filtrados);

    } catch (error) {
        res.status(500).json({
            msg: "Erro na busca",
            error: error.message
        });
    }
});

// ============================
// ROTAS ANTIGAS (TESTE)
// ============================
app.post("/add", async (req, res) => {
    try {
        const data = req.body;
        const docRef = await db.collection("teste").add(data);
        res.json({ success: true, id: docRef.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/list", async (req, res) => {
    try {
        const snapshot = await db.collection("teste").get();
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================
// INICIAR SERVIDOR
// ============================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
