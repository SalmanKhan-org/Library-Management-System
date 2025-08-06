const express = require('express');
const { login } = require('../controllers/userControllers/login');
const { registerUser } = require('../controllers/userControllers/register');
const { logout } = require('../controllers/userControllers/logout');
const { deleteUser } = require('../controllers/userControllers/deleteUser');
const { getUserDetails } = require('../controllers/userControllers/getUserDetails');
const { getMyDetails } = require('../controllers/userControllers/getMyDetails');
const { updateUserDetails } = require('../controllers/userControllers/updateUserDetails');
const { authenticateToken, isAdmin } = require('../middlewares/authToken');
const upload = require('../middlewares/multer');
const { getAllUsers } = require('../controllers/userControllers/getAllUsers');
const router = express.Router();

router.post('/login',login);
router.post('/register', registerUser);
router.get('/logout', logout);
router.delete('/:id', deleteUser);
router.get('/profile/:id', getUserDetails);
router.get('/me',authenticateToken, getMyDetails);
router.put('/me/update',authenticateToken, upload.single('image'), updateUserDetails);
router.get('/admin/get/all', authenticateToken, isAdmin, getAllUsers);

module.exports = router;