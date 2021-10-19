const express = require('express');
const { protect, protectAdmin } = require('../controller/authController');

const router = express.Router();

const { updateSeo, getSeo } = require('../controller/SeoController');
const { imageUpload } = require('../utils/multer');

router
  .route('/')
  .get(protect, protectAdmin, getSeo)
  .patch(
    protect,
    protectAdmin,
    imageUpload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'favicon', maxCount: 1 },
    ]),
    updateSeo
  );

module.exports = router;
