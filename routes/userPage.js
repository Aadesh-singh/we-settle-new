const router = require('express').Router();
const path = require('path');
const {
  protectAuthPage,
  protectPage,
} = require('../controller/authController');

router.get('/', (req, res) => {
  const file = path.resolve('public/index.html');
  return res.sendFile(file);
});

router.get('/property-detail/:city/:area', (req, res) => {
  const file = path.resolve('public/properties-details.html');
  return res.sendFile(file);
});

router.get('/values', (req, res) => {
  const file = path.resolve('public/our-values.html');
  return res.sendFile(file);
});

router.get('/refer-and-earn', (req, res) => {
  const file = path.resolve('public/refer-and-earn.html');
  return res.sendFile(file);
});

router.get('/property/:city', (req, res) => {
  const file = path.resolve('public/filtered-props.html');
  return res.sendFile(file);
});

router.get('/404', (req, res) => {
  const file = path.resolve('public/404.html');
  return res.sendFile(file);
});

router.get('/login', protectAuthPage, (_, res) => {
  const file = path.resolve('public/login.html');
  return res.sendFile(file);
});

router.get('/register', protectAuthPage, (_, res) => {
  const file = path.resolve('public/register.html');
  return res.sendFile(file);
});

router.get('/activate', protectAuthPage, (_, res) => {
  const file = path.resolve('public/activate.html');
  return res.sendFile(file);
});

router.get('/forgot-password', protectAuthPage, (_, res) => {
  const file = path.resolve('public/forgot.html');
  return res.sendFile(file);
});

router.get('/change-password', protectAuthPage, (_, res) => {
  const file = path.resolve('public/changePassword.html');
  return res.sendFile(file);
});

router.get('/wishlist', protectPage, (_, res) => {
  const file = path.resolve('public/wishlist.html');
  return res.sendFile(file);
});

router.get('/edit', protectPage, (_, res) => {
  const file = path.resolve('public/edit-profile.html');
  return res.sendFile(file);
});

module.exports = router;
