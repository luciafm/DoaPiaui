import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { admin, db };
