// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Charge ta clé de service Firebase
const serviceAccount = require('./serviceAccountKey.json');

// Initialise Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Accès à Firestore
const db = admin.firestore();

// Initialise Express
const app = express();
app.use(cors());
app.use(express.json());

// Route racine
app.get('/', (req, res) => {
    res.send('API Pique-Me OK');
});

// Route de test pour Firestore
app.get('/test', async (req, res) => {
    try {
        const snapshot = await db.collection('parcs').limit(10).get();
        const parcs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(parcs);
    } catch (error) {
        console.error('Erreur Firestore:', error);
        res.status(500).json({ error: 'Impossible de lire la collection parcs' });
    }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
