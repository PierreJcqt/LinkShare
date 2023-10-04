const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require ('../models/index');
const { checkPassword } = require('../middleware/password');

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/;

exports.signup = (req, res, next) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email    = req.body.email;
    let password = req.body.password;

  // Permet de vérifier que tous les champs sont complétés
    if(email == null || email == '' || firstName == null || firstName == ''|| lastName == null || lastName == '' || password == null || password == '') {
        return res.status(400).json({ error: 'Tous les champs doivent être renseignés' });
    } 

  // Permet de contrôler la longueur du prénom
    if(firstName.length <= 2 || firstName.length >= 15) {
        return res.status(400).json({ error: 'Le prénom doit contenir 3 à 15 caractères' });
    }

   // Permet de contrôler la longueur du nom
    if(lastName.length <= 3 || lastName.length >= 15) {
        return res.status(400).json({ error: 'Le nom doit contenir 3 à 15 caractères' });
    }

  // Permet de contrôler la validité de l'adresse mail
    if(!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Adresse mail invalide' });
    }

  // Permet de contrôler la validité du mot de passe
    if(!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir entre 8 et 15 caractères dont au moins une lettre majuscule, une lettre minusucle, un chiffre et un symbole' });
    }

  // Permet de vérifier que l'utilisateur que l'on souhaite créer n'existe pas déjà
    User.findOne({
        attributes: ['firstName' || 'lastName' || 'email'],
        where: { 
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            email: req.body.email
        }
    })
    .then(userExist => {
        if(!userExist) {
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = User.create({
                    userId: req.body.userId,
                    firstName: req.body.firstName, 
                    lastName: req.body.lastName,
                    email: req.body.email,
                    isAdmin: req.body.isAdmin,
                    password: hash
                })            
                // RAJOUTER PEUX ETRE USER.SAVE() ICI
                .then(user => res.status(201).json({ message: 'Votre compte a bien été créé !', user }))
                .catch(error => res.status(400).json({ error: '⚠ Oops, une erreur s\'est produite !' }));
            })
            .catch(error => res.status(500).json({ error: 'Une erreur s\'est produite lors de la création de votre compte' }));
        } else {
            return res.status(404).json({ error: 'Cet utilisateur existe déjà' })
        }
    })
    .catch(error => res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !' }));
    };


// FONCTION LOGIN V1 FIRST

// exports.login = (req, res, next) => {
//     try {
//         /**** récupérer le user de la base de données avec findOne ***/
//         User.findOne({
//                 where: {
//                     email: req.body.email
//                 }
//             })
//             .then((user) => {
//                 if (!user) {
//                     return res.status(404).json({
//                         message: 'Utilisateur introuvable'
//                     });
//                 } 
//                 /*** comparer le mot de passe avec bcrypt ***/
//                 bcrypt.compare(req.body.password, user.password)
//                     .then((valid) => {
//                         if (!valid) {
//                             return res.status(401).json({
//                                 message: 'Mot de passe incorrect '
//                             });
//                         }      
//                         res.status(200).json({
//                             user: {
//                                 id: user.id,
//                                 firstName: user.firstName,
//                                 lastName: user.lastName,
//                                 email: req.body.email,
//                                 password: req.body.password,
//                                 isAdmin: user.isAdmin,
//                                 imageUrl: user.imageUrl
//                             },
//                             userId: user.id,
//                             isAdmin: user.isAdmin,
//                             token: jwt.sign({
//                                     userId: user.id,
//                                     isAdmin: user.isAdmin,
//                                 },
//                                 `RANDOM_TOKEN_SECRET`, {
//                                     expiresIn: '24h'
//                                 }
//                             )
//                         });
//                     })
//                     .catch(error => res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !'}));
//             })
//             .catch(error => res.status(500).json({
//                 error
//             }));
//     } catch (error) {
//         console.log(error)
//     }
// };




// v2 3 tentatives new

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        if (!(await checkPassword(req.body.password, user.password))) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }
        res.status(200).json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: req.body.email,
                password: req.body.password,
                isAdmin: user.isAdmin,
                imageUrl: user.imageUrl
            },
            userId: user.id,
            isAdmin: user.isAdmin,
            token: jwt.sign({
                    userId: user.id,
                    isAdmin: user.isAdmin,
                },
                'RANDOM_TOKEN_SECRET', {
                    expiresIn: '24h'
                }
            )
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "⚠ Oops, une erreur s'est produite !" });
    }
};


//v2 avec blocage 15mn si 3 failed

// const FIFTEEN_MINUTES = 15 * 60 * 1000;

// exports.login = (req, res, next) => {
//     try {
//         User.findOne({
//             where: {
//                 email: req.body.email
//             }
//         })
//         .then((user) => {
//             if (!user) {
//                 return res.status(404).json({
//                     message: 'Utilisateur introuvable'
//                 });
//             }
//             const now = new Date();
//             if (user.failedAttempts >= 3) {
//                 // const now = new Date();
//                 const lastFailedAttempt = new Date(user.lastFailedAttempt);
//                 const difference = now.getTime() - lastFailedAttempt.getTime();
//                 console.log('failedAttempts:', user.failedAttempts);
//                 console.log('lastFailedAttempt:', user.lastFailedAttempt);
//                 console.log('Difference (ms):', difference); // Modifiez cette ligne pour afficher la bonne valeur
//                 const FIFTEEN_MINUTES = 15 * 60 * 1000;
//                 if (difference < FIFTEEN_MINUTES) {
//                     return res.status(429).json({
//                         message: 'Votre compte a été bloqué suite à 3 tentatives de connexion infructueuses'
//                     });
//                 }
//             }
//             bcrypt.compare(req.body.password, user.password)
//                 .then((valid) => {
//                     if (!valid) {
//                         user.update({
//                             failedAttempts: user.failedAttempts + 1,
//                             lastFailedAttempt: now
//                         })
//                         .then(() => {
//                             // Récupérer les données de l'utilisateur à jour
//                             User.findOne({ where: { email: req.body.email } })
//                             .then((updatedUser) => {
//                                 console.log('failedAttempts:', updatedUser.failedAttempts);
//                                 console.log('lastFailedAttempt:', updatedUser.lastFailedAttempt);
//                                 console.log('Difference (ms):', now - updatedUser.lastFailedAttempt);
//                                 // Effectuez la vérification du blocage ici
//                                 if (updatedUser.failedAttempts >= 3) {
//                                     if (now - updatedUser.lastFailedAttempt < FIFTEEN_MINUTES) {
//                                         return res.status(429).json({
//                                             message: 'Votre compte a été bloqué suite à 3 tentatives de connexion infructueuses'
//                                         });
//                                     }
//                                 }
//                                 return res.status(401).json({
//                                     message: 'Mot de passe incorrect'
//                                 });
//                             })
//                             .catch(error => res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !'}));
//                         })
//                         .catch(error => res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !'}));
//                         } else {
//                             user.update({ failedAttempts: 0, lastFailedAttempt: null }) // Modifier cette ligne pour mettre à jour le lastFailedAttempt lors de la connexion réussie
//                                 .then(() => {
//                                     res.status(200).json({
//                                         user: {
//                                             id: user.id,
//                                             firstName: user.firstName,
//                                             lastName: user.lastName,
//                                             email: req.body.email,
//                                             password: req.body.password,
//                                             isAdmin: user.isAdmin,
//                                             imageUrl: user.imageUrl
//                                         },
//                                         userId: user.id,
//                                         isAdmin: user.isAdmin,
//                                         token: jwt.sign({
//                                                 userId: user.id,
//                                                 isAdmin: user.isAdmin,
//                                             },
//                                             `RANDOM_TOKEN_SECRET`, {
//                                                 expiresIn: '24h'
//                                             }
//                                         )
//                                     });
//                                 })
//                                 .catch(error => {
//                                     console.log("Erreur détaillée :", error);
//                                     res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !'})
//                                 });
//                         }
//                     })
//                     .catch(error => {
//                         console.log("Erreur détaillée :", error);
//                         res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !'})
//                     });
//                 })
//     .catch(error => res.status(500).json({ error }));
//     } catch (error) {
//         console.log(error);
//     }
// };



exports.editUser = (req, res, next) => {
    try {
        const userObject = req.file
        ? {
            ...JSON.parse(req.body.user),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
            }`
            }
        : { ...req.body }
        console.log(userObject)
        req.user.update(userObject).then(user => res.status(200).json({ user }))
    } catch (error) {
        res.status(400).json({ error })
    }
    }


exports.getOneUser = async (req, res) => {
    // on trouve l'utilisateur et on renvoie l'objet user
        try {
        const user = await User.findOne({
            where: { id: req.params.id },
        });
        res.status(200).send(user);
        } catch (error) {
        return res.status(500).send({ error: "Erreur serveur" });
        }
    };


exports.getAllUsers = (req, res, next) => {
    User.findAll({ attributes: ['id', 'firstName', 'lastName', 'email', 'imageUrl'] })
        .then(users => res.status(200).json({ users }))
        .catch(error => res.status(404).json({ error }))
};


exports.deleteUserAccount = (req, res, next) => {
    const id = req.params.id;
    User.findOne({
        attributes: ['id'],
        where: { id: id }
    })
    .then(user => {
        if(user) {
            User.destroy({ 
                where: { id: id } 
            })
            .then(() => res.status(200).json({ message: 'Votre compte a été supprimé' }))
            .catch(() => res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !' }));
            
        } else {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
        }
    })
    .catch(error => res.status(500).json({ error: '⚠ Oops, une erreur s\'est produite !' }));
    };

