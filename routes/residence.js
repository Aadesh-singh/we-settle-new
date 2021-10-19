const express = require('express');
const router = express.Router();

const { imageUpload } = require('../utils/multer');
const {
  createResidence,
  getResidence,
  deleteResidencyImage,
  deleteResidency,
  editResidency,
  sanitizeInput,
  filter,
  validateAreaAndLocation,
  priceRange,
} = require('../controller/residenceController');
const { protect, protectAdmin } = require('../controller/authController');

router
  .route('/')
  .post(
    protect,
    protectAdmin,
    imageUpload.array('images', 9),
    validateAreaAndLocation,
    sanitizeInput,
    createResidence
  )
  .get(getResidence);

router
  .route('/image/:residencyId')
  .patch(protect, protectAdmin, deleteResidencyImage);

router.route('/:residencyId').delete(deleteResidency).patch(
  // protect,
  // protectAdmin,
  imageUpload.array('images'),
  validateAreaAndLocation,
  sanitizeInput,
  editResidency
);

router.post('/filter', filter);
router.get('/price', priceRange);

module.exports = router;
