const express = require('express');
const { Sequelize, Joke } = require('./models');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const { LIMIT_EXPR_DEPTH } = require('sqlite3');

// Middleware pour parser le JSON
app.use(express.json());

// Route pour récupérer une blague aléatoire
app.get('/api/jokes/random', async (req, res) => {
    try {
        const joke = await Joke.findOne({ order: Sequelize.literal('RANDOM()') });
        if (joke) {
            res.json(joke);
        } else {
            res.status(404).json({ message: 'No jokes found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:3000`);
});

//Servir le fichier index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour ajouter une nouvelle blague
app.post('/api/jokes', async (req, res) => {
    try {
        const { question, answer } = req.body;
        const newJoke = await Joke.create({ question, answer });
        res.status(201).json(newJoke);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
