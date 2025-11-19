import { db } from "./firebase-config.js";
import { collection, addDoc } from "firebase/firestore";

export async function criarDoacao(dados) {
  return await addDoc(collection(db, "doacoes"), dados);
}
