const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Exportando corretamente
const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
