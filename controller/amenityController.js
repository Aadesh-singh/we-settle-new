const Amenity = require('../model/Amenity.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { deleteAImage } = require('../utils/multer');

exports.getAmenities = catchAsync(async (req, res, next) => {
  const amenities = await Amenity.find({});

  return res.status(200).json({
    status: 'success',
    length: amenities.length,
    amenities,
  });
});

exports.createAmenity = catchAsync(async (req, res, next) => {
  const file = req?.file;
  if (!file || !file?.key || !file?.location || !req.body?.name)
    return next(new AppError('Image and name is required', 400, req));

  const amenity = await Amenity.create({
    name: req.body?.name.toLowerCase(),
    image: {
      path: file?.key,
      url: file?.location,
    },
  });

  return res.status(201).json({
    status: 'success',
    amenity,
  });
});

exports.deleteAmenity = catchAsync(async (req, res, next) => {
  const { amenityId } = req.params;
  if (!amenityId) return next(new AppError('No amenity found', 404));

  const amenity = await Amenity.findById(amenityId);

  if (!amenity) return next(new AppError('No amenity found', 404));

  const imagePath = amenity?.image?.path;
  if (imagePath) {
    await deleteAImage(imagePath);
  }

  await amenity.remove();

  return res.status(200).json({ status: 'success' });
});

exports.editAmenity = catchAsync(async (req, res, next) => {
  const { amenityId } = req.params;
  if (!amenityId) return next(new AppError('No amenity found', 404, req));

  const amenity = await Amenity.findById(amenityId);

  if (!amenity) return next(new AppError('No amenity found', 404, req));

  const file = req?.file;
  const { name } = req?.body;
  const imagePath = amenity?.image?.path;

  if (file && file?.key && imagePath) {
    await deleteAImage(imagePath);
    amenity.image = {
      path: file?.key,
      url: file?.location,
    };
  }

  if (name) amenity.name = name;

  await amenity.save();

  return res.status(200).json({
    status: 'success',
    amenity,
  });
});
