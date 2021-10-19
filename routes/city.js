const express = require('express');
const { protect, protectAdmin } = require('../controller/authController');
const router = express.Router();

const {
  getCities,
  createCity,
  deleteCity,
  editCity,
} = require('../controller/cityController');

router.route('/').get(getCities).post(protect, protectAdmin, createCity);

router
  .route('/:cityId')
  .patch(protect, protectAdmin, editCity)
  .delete(protect, protectAdmin, deleteCity);

module.exports = router;
