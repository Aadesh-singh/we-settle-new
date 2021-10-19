const express = require('express');
const router = express.Router();
const {
  register,
  login,
  protect,
  test,
  protectAdmin,
  getMe,
  logout,
  getUsers,
  activate,
  forgotPassword,
  changePassword,
} = require('../controller/authController');

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/').get(protect, protectAdmin, test);

router.get('/me', protect, getMe);

router.get('/admin', protect, protectAdmin, getMe);

router.get('/logout', protect, logout);

router.route('/users').get(protect, protectAdmin, getUsers);

router.get('/activate/:token', activate);

router.post('/forgot-password', forgotPassword);
router.post('/change-password', changePassword);
module.exports = router;
