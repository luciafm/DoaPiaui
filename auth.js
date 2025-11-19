import { auth } from "./firebase-config.js";
import { signOut } from "firebase/auth";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

export async function criarConta(email, senha) {
  return await createUserWithEmailAndPassword(auth, email, senha);
}

export async function loginUser(email, senha) {
  return await signInWithEmailAndPassword(auth, email, senha);
}

