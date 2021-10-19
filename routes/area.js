const express = require('express');
const {
  getArea,
  createArea,
  deleteArea,
  editArea,
  getAreaByCity,
  getLocalityByArea,
} = require('../controller/areaController');
const { protect, protectAdmin } = require('../controller/authController');
const router = express.Router();

router.route('/').get(getArea).post(createArea);

router
  .route('/:areaId')
  .delete(protect, protectAdmin, deleteArea)
  .patch(protect, protectAdmin, editArea);

router.route('/city/:cityId').get(getAreaByCity);
router.route('/locality/area/:areaId').get(getLocalityByArea);

module.exports = router;
