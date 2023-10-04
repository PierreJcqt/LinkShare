const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/users/:id', auth, userCtrl.getOneUser);
router.get('/users', auth, userCtrl.getAllUsers);
router.put('/users/:id', auth, multer, userCtrl.editUser);
router.delete('/users/:id', auth, userCtrl.deleteUserAccount);

module.exports = router;