const express = require('express');
const { protect, protectAdmin } = require('../controller/authController');
const { getScript, updateScript } = require('../controller/scriptController');

const router = express.Router();

router
  .route('/')
  .get(protect, protectAdmin, getScript)
  .patch(protect, protectAdmin, updateScript);

module.exports = router;
