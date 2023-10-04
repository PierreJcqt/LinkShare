const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const auth = require('./middleware/auth');
const { Sequelize } = require('./models/index');
const cors = require('cors');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { User } = require('./models');
const { checkPassword } = require('./middleware/password');

// require('dotenv').config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:8080" }));

const userRoutes = require('./routes/user');
const postsRoutes = require('./routes/posts');

// Configurez le rate limiter
const rateLimiter = new RateLimiterMemory({
    keyPrefix: 'login-attempts',
    points: 3, // Nombre de tentatives autorisées
    duration: 15 * 60, // Durée de blocage en secondes (15 minutes)
});

// Middleware pour vérifier le nombre de tentatives de connexion
const rateLimiterMiddleware = async (req, res, next) => {
    const identifier = req.body.email; // Utilisez l'adresse e-mail comme identifiant unique

    try {
        const rateLimiterRes = await rateLimiter.get(identifier);

        // Si l'utilisateur a déjà été bloqué
        if (rateLimiterRes !== null && rateLimiterRes.consumedPoints >= 3) {
            throw new Error('Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.');
        }

        // Vérifiez le mot de passe
        const user = await User.findOne({ where: { email: identifier } });

        if (!user || !(await checkPassword(req.body.password, user.password))) {
            await rateLimiter.consume(identifier);
            throw new Error('Mot de passe incorrect');
        }

        // Réinitialisez les points de l'utilisateur après une connexion réussie
        await rateLimiter.delete(identifier);
        next();
    } catch (error) {
        if (error.message === 'Mot de passe incorrect') {
            res.status(401).json({ error: error.message });
        } else {
            res.status(429).json({ error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.' });
        }
    }
};

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth/login', rateLimiterMiddleware);
app.use('/api/auth', userRoutes);
app.use('/api/posts', postsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || "Une erreur interne s'est produite." });
});

module.exports = app;
