const express = require('express');
const router = express.Router();

const {
  getAmenities,
  createAmenity,
  deleteAmenity,
  editAmenity,
} = require('../controller/amenityController');
const { protect, protectAdmin } = require('../controller/authController');
const { imageUpload } = require('../utils/multer');

router
  .route('/')
  .get(getAmenities)
  .post(protect, protectAdmin, imageUpload.single('image'), createAmenity);

router
  .route('/:amenityId')
  .delete(protect, protectAdmin, deleteAmenity)
  .patch(protect, protectAdmin, imageUpload.single('image'), editAmenity);

module.exports = router;
