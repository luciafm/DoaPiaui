import express from "express";
import cors from "cors";
import { db } from "./firebase-admin.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
    res.send("Backend funcionando!");
});

// ===== ROTA DE CADASTRO =====
app.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha, whatsapp, bairro } = req.body;
        
        // Validação básica
        if (!nome || !email || !senha) {
            return res.status(400).json({ 
                success: false, 
                msg: "Preencha todos os campos obrigatórios (nome, email e senha)" 
            });
        }

        // Verifica se o email já existe
        const usuariosRef = db.collection("usuarios");
        const snapshot = await usuariosRef.where("email", "==", email).get();
        
        if (!snapshot.empty) {
            return res.status(400).json({ 
                success: false, 
                msg: "Email já cadastrado" 
            });
        }

        // Cria o novo usuário com TODOS os campos incluindo data
        const novoUsuario = {
            nome,
            email,
            senha, // ⚠️ IMPORTANTE: Em produção, use hash (bcrypt)
            whatsapp: whatsapp || "",
            bairro: bairro || "",
            criadoEm: new Date().toISOString() // Data de criação
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

// ===== ROTA DE LOGIN =====
app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({ 
                success: false, 
                msg: "Preencha email e senha" 
            });
        }
        if (!usuarioEncontrado) {
           return res.status(401).json({ msg: "Email ou senha incorretos" });
        }
        // Busca usuário pelo email
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

        // Verifica senha
        if (usuario.senha !== senha) {
            return res.status(401).json({ 
                success: false, 
                msg: "Email ou senha incorretos" 
            });
        }

        // Login bem-sucedido
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

// Criar documento (rota antiga)
app.post("/add", async (req, res) => {
    try {
        const data = req.body;
        const docRef = await db.collection("teste").add(data);
        res.json({ success: true, id: docRef.id });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Listar documentos (rota antiga)
app.get("/list", async (req, res) => {
    try {
        const snapshot = await db.collection("teste").get();
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(docs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});