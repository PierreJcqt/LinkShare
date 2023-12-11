const { User } = require('../models/index');
const db = require('../models')
const { Kudo } = db.sequelize.models

// Récupérer tous les kudos
exports.getAllKudos = async (req, res) => {
  try {
    const kudos = await Kudo.findAll({
      where: { recipientId: userId }, // userId est l'ID de l'utilisateur en question
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'Recipient', attributes: ['id', 'firstName', 'lastName'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(kudos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer un kudo par ID
exports.getOneKudo = async (req, res) => {
  try {
    const kudo = await Kudo.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'Recipient', attributes: ['id', 'firstName', 'lastName'] },
      ],
    });

    if (!kudo) {
      return res.status(404).json({ error: 'Kudo introuvable' });
    }

    res.status(200).json(kudo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReceivedKudos = async (req, res) => {
  try {
    const userId = req.params.usersId;

    if (!userId) {
      return res.status(400).json({ error: "L'utilisateur est requis" });
    }

    const kudos = await Kudo.findAll({
      where: { recipientId: userId },
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'Recipient', attributes: ['id', 'firstName', 'lastName'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(kudos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Créer un kudo
exports.createKudo = async (req, res) => {
  try {
    // const { senderId, recipientId, message, createdAt } = req.body;
    const { senderId, recipients, message, createdAt } = req.body;

    // if (!senderId || !recipientId || !message || !createdAt) {
    //   return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    // }

    if (!senderId || !recipients || !message || !createdAt) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }
    console.log("req.body:", req.body);
    console.log("senderId:", req.body.senderId);
    console.log("recipients:", req.body.recipients);
    console.log("message:", req.body.message);
    console.log("createdAt:", req.body.createdAt);
    
    // const kudo = await Kudo.create({ senderId, recipientId, message, createdAt });

    // Créez un kudo pour chaque destinataire
    const createdKudos = [];
    for (const recipientId of recipients) {
      const kudo = await Kudo.create({ senderId, recipientId, message, createdAt });
      createdKudos.push(kudo);
    }


    // res.status(201).json(kudo);
    res.status(201).json(createdKudos);

  } catch (error) {
    console.log('Erreur lors de la création du kudo:', error);
    res.status(400).json({ error: error.message });
  }
};


// Supprimer un kudo par ID
exports.deleteKudo = async (req, res) => {
  try {
    const kudo = await Kudo.findByPk(req.params.id);

    if (!kudo) {
      return res.status(404).json({ error: 'Kudo introuvable' });
    }

    await kudo.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

