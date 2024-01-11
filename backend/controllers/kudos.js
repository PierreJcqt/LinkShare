const { User } = require('../models/index');
const db = require('../models');
const { Kudo } = db.sequelize.models;
const { Receive } = db.sequelize.models;


// Récupérer tous les kudos pour un utilisateur spécifique
exports.getAllKudos = async (req, res) => {
  try {
    // Supposons que userId est défini quelque part dans votre contexte, peut-être à partir de req.userId ou un paramètre similaire.
    const userId = req.userId; // ou la manière dont vous obtenez l'ID de l'utilisateur

    const receivedKudos = await Receive.findAll({
      where: { recipientId: userId },
      include: [{
        model: Kudo,
        include: [
          { model: User, as: 'Sender', attributes: ['id', 'firstName', 'lastName'] }
        ]
      }],
      order: [[Kudo, 'createdAt', 'DESC']]
    });

    res.status(200).json(receivedKudos);
  } catch (error) {
    console.error("ERROR FROM GetALLKudo")
    res.status(400).json({ error: error.message });
  }
};

// Récupérer un kudo par ID
exports.getOneKudo = async (req, res) => {
  try {
    const kudoId = req.params.id;
    
    // Trouvez d'abord le kudo
    const kudo = await Kudo.findByPk(kudoId, {
      include: [{ model: User, as: 'Sender', attributes: ['id', 'firstName', 'lastName'] }]
    });

    if (!kudo) {
      return res.status(404).json({ error: 'Kudo introuvable' });
    }

    // Trouvez tous les Receives associés à ce kudo
    const receives = await Receive.findAll({
      where: { kudoId: kudo.id },
      include: [{ model: User, as: 'Recipient', attributes: ['id', 'firstName', 'lastName'] }]
    });

    // Combinez les données kudo et receives pour la réponse
    const kudoWithRecipients = {
      ...kudo.toJSON(),
      Recipients: receives.map(receive => receive.Recipient)
    };

    res.status(200).json(kudoWithRecipients);
  } catch (error) {
    console.error("ERROR FROM GetOneKudo")
    res.status(400).json({ error: error.message });
  }
};

exports.getReceivedKudos = async (req, res) => {
  try {
    const userId = req.params.usersId;
    if (!userId) {
      return res.status(400).json({ error: "L'utilisateur est requis" });
    }
    const receivedKudos = await Receive.findAll({
      where: { recipientId: userId },
      include: [
        {
          model: Kudo,
          as: 'ReceivedKudo',
          include: [{ model: User, as: 'Sender', attributes: ['id', 'firstName', 'lastName'] }]
        }
      ],
      order: [[{ model: Kudo, as: 'ReceivedKudo' }, 'createdAt', 'DESC']]
    });
    const kudos = receivedKudos.map(receive => {
      return {
        ...receive.ReceivedKudo.toJSON(),
        recipientId: receive.recipientId,
        Sender: receive.ReceivedKudo.Sender
      };
    });
    res.status(200).json(kudos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Créer un kudo et ses associations de réception
exports.createKudo = async (req, res) => {
  try {
    const { senderId, recipients, message } = req.body;

    if (!senderId || !recipients || recipients.length === 0 || !message) {
      return res.status(400).json({ error: 'Les destinataires et le message sont obligatoires' });
    }

    // Créer un kudo avec l'ID de l'utilisateur authentifié et la date de création gérée automatiquement par Sequelize
    const kudo = await Kudo.create({ senderId, message });

    // Créer des associations de réception pour chaque destinataire
    const receiveEntries = recipients.map(recipientId => {
      return { recipientId, kudoId: kudo.id };
    });
    const createdReceives = await Receive.bulkCreate(receiveEntries);

    res.status(201).json({ kudo, createdReceives });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Supprimer l'association de réception d'un kudo pour un utilisateur spécifique
exports.deleteKudo = async (req, res) => {
  try {
    const { kudoId, recipientId } = req.params; // Ajoutez recipientId dans les paramètres

    // Supprimez uniquement l'association entre le kudo et l'utilisateur
    await Receive.destroy({ where: { kudoId, recipientId } });

    // Vérifiez s'il y a d'autres associations pour ce kudo
    const remainingReceives = await Receive.count({ where: { kudoId } });

    // Si plus aucune association, supprimez le kudo lui-même
    if (remainingReceives === 0) {
      await Kudo.destroy({ where: { id: kudoId } });
    }

    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

