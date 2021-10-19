const express = require('express');
const { protect, protectAdmin } = require('../controller/authController');
const {
  getRequest,
  createRequest,
} = require('../controller/requestController');
const router = express.Router();

router.route('/').get(protect, protectAdmin, getRequest).post(createRequest);

module.exports = router;
