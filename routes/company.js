const express = require('express');
const { protect, protectAdmin } = require('../controller/authController');

const router = express.Router();

const {
  getCompany,
  updateCompanyDetails,
} = require('../controller/companyController');

router
  .route('/')
  .get(protect, protectAdmin, getCompany)
  .patch(protect, protectAdmin, updateCompanyDetails);

module.exports = router;
