const express = require('express');
const { protect, protectAdmin } = require('../controller/authController');
const {
  addWishlist,
  getResidenceWishlist,
  deleteWishlist,
  isUserWishlisted,
  userWishlistedResidence,
  getWishlist,
  userWishlist,
  exportCsv,
} = require('../controller/wishlist.controller');

const router = express.Router();

router.route('/').get(protect, protectAdmin, getWishlist);

router.get('/export', exportCsv);
router
  .route('/:id')
  .get(protect, isUserWishlisted)
  .post(protect, addWishlist)
  .delete(protect, protectAdmin, deleteWishlist);

router
  .route('/residence/:residenceId')
  .get(protect, protectAdmin, getResidenceWishlist);

router.get('/user/all', protect, userWishlist);
router
  .route('/user/:userId')
  .get(protect, protectAdmin, userWishlistedResidence);

module.exports = router;
