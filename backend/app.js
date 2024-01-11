const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { User } = require('./models');
const { checkPassword } = require('./middleware/password');

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
    const identifier = req.body.email; 
    try {
        // Vérifiez si l'utilisateur existe
        const user = await User.findOne({ where: { email: identifier } });
        if (!user) {
            throw new Error('Utilisateur introuvable');
        }
        // Récupérez les informations du limiteur de taux pour cet utilisateur
        const rateLimiterRes = await rateLimiter.get(identifier);
        // Si l'utilisateur a déjà été bloqué
        if (rateLimiterRes !== null && rateLimiterRes.consumedPoints >= 3) {
            throw new Error('Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.');
        }
        // Vérifiez le mot de passe
        if (!(await checkPassword(req.body.password, user.password))) {
            await rateLimiter.consume(identifier);
            throw new Error('Mot de passe incorrect');
        }
        // Réinitialisez les points de l'utilisateur après une connexion réussie
        await rateLimiter.delete(identifier);
        next();
    } catch (error) {
        res.status(error.message === 'Utilisateur introuvable' ? 404 : 401).json({ error: error.message });
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
