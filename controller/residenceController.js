const Area = require('../model/Area.model');
const City = require('../model/City.model');
const Residence = require('../model/Residence.model');
const APIFeatures = require('../utils/ApiFeautures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { deleteImages } = require('../utils/multer');

// check area is in city and location in area
exports.validateAreaAndLocation = catchAsync(async (req, res, next) => {
  if (!req.body?.area || !req.body?.city)
    return next(new AppError('Area, city is required', 400, req));
  if (!req.body?.location) {
    const area = await Area.find({
      _id: req.body.area,
      city: req.body.city,
      placeType: 'area',
    });
    if (!area)
      return next(new AppError('No area found in selected city', 400, req));
    return next();
  }

  const location = await Area.find({
    _id: req.body?.location,
    parentArea: req.body?.area,
    placeType: 'locality',
  });

  if (!location)
    return next(new AppError('No location found in selected area', 400, req));

  return next();
});

// parser
exports.sanitizeInput = (req, res, next) => {
  if ('amenity' in req.body) {
    if (
      req.body.amenity === '' ||
      !(req.body.amenity.startsWith('[') || req.body.amenity.startsWith('{'))
    )
      return next(new AppError('Invalid amenity data', 400, req));
    req.body.amenity = JSON.parse(req.body.amenity);
  }
  if ('college' in req.body) {
    if (
      req.body.college === '' ||
      !(req.body.college.startsWith('[') || req.body.college.startsWith('{'))
    )
      return next(new AppError('Invalid college data', 400, req));
    req.body.college = JSON.parse(req.body.college);
  }
  if ('occupancy' in req.body) {
    if (
      req.body.occupancy === '' ||
      !(
        req.body.occupancy.startsWith('[') || req.body.occupancy.startsWith('{')
      )
    )
      return next(new AppError('Invalid Occupancy data', 400, req));
    req.body.occupancy = JSON.parse(req.body.occupancy);
  }
  next();
};

exports.createResidence = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if (!req.files || !req.files?.length)
    return next(new AppError('Image is required'));

  const {
    name,
    city,
    area,
    college,
    location,
    amenity,
    gender,
    singlePrice,
    doublePrice,
    status,
    code,
    occupancy,
  } = req.body;

  if (!code || !city || !area || !gender)
    return next(new AppError('Please fill all fields', 400, req));

  // either of price need to be required
  if (!(singlePrice || doublePrice)) {
    return next(new AppError('Single or double price is required', 400, req));
  }

  const images = req.files.map((file) => ({
    path: file?.key,
    url: file?.location,
  }));

  const residence = await Residence.create({
    images,
    name,
    city,
    area,
    college,
    location,
    amenity,
    price: {
      single: singlePrice,
      double: doublePrice,
    },
    status,
    gender,
    code,
    occupancy,
  });

  return res.status(201).json({ status: 'success', residence });
});

exports.getResidence = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Residence.find(), req.query)
    .or(['area', 'location', 'city', 'college'])
    .filter()
    .limitFields()
    .sort('createdAt', -1)
    .paginate();
  const residencies = await feature.query;
  return res
    .status(200)
    .json({ status: 'success', length: await Residence.count(), residencies });
});

exports.deleteResidencyImage = catchAsync(async (req, res, next) => {
  const { residencyId } = req.params;
  const { imageId } = req.body;

  if (!residencyId || !imageId)
    return next(new AppError('Residency not found', 404));

  const residence = await Residence.findOne(
    {
      _id: residencyId,
      'images._id': imageId,
    },
    { 'images.$': 1 }
  );

  if (!residence) return next(new AppError('No Residence Found', 404));

  if (residence?.images?.length) {
    console.log(residence.images);
    await deleteImages(residence.images);
    await Residence.findByIdAndUpdate(residencyId, {
      $pull: { images: { _id: imageId } },
    });
  }

  return res.status(200).json({ status: 'success' });
});

exports.deleteResidency = catchAsync(async (req, res, next) => {
  const { residencyId } = req.params;

  if (!residencyId) return next(new AppError('Residency not found', 404));

  const residence = await Residence.findById(residencyId);
  if (!residence) return next(new AppError('No Residence Found', 404));

  if (residence?.images?.length) await deleteImages(residence?.images);

  await residence.remove();

  return res.status(200).json({
    status: 'success',
  });
});

exports.editResidency = catchAsync(async (req, res, next) => {
  const { residencyId } = req.params;

  if (!residencyId) return next(new AppError('Residency not found', 404, req));

  let image;

  if (req.body?.trending === 'true' && !parseInt(req?.body?.trendingOrder))
    return next(new AppError('Trending Order is required', 400, req));

  if (req.body?.trending === 'true') {
    const trending = await Residence.findOne({
      _id: { $ne: residencyId },
      trendingOrder: req.body?.trendingOrder,
    });
    if (trending)
      return next(
        new AppError('Trending Order is already assigned to property', 400, req)
      );
  }

  if (req.files && req.files?.length) {
    image = req.files.map((file) => ({ path: file?.key, url: file?.location }));
  }

  const data = { ...req.body };

  if (data?.trending === 'true')
    data['trendingOrder'] = parseInt(req?.body?.trendingOrder);
  const { singlePrice, doublePrice } = req.body;
  if (singlePrice) {
    delete data.singlePrice;
    data['$set'] = { 'price.single': singlePrice };
  }

  if (doublePrice) {
    delete data.doublePrice;
    data['$set'] = { 'price.double': doublePrice };
  }

  if (image) data['$push'] = { images: { $each: image } };

  console.log(data);

  const residence = await Residence.findByIdAndUpdate(residencyId, data, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ status: 'success', residence });
});

exports.filter = catchAsync(async (req, res, next) => {
  // const name = req.body.name ? req.body.name.replace(/[^\w\s]/gi, '') : '';
  const result = await Area.find({
    name: { $regex: req.body.name, $options: 'sig' },
  })
    .populate('city')
    .lean();

  const city = await City.find({
    cityName: { $regex: req.body.name, $options: 'sig' },
  }).lean();
  const results = [...result, ...city];
  return res
    .status(200)
    .json({ status: 'success', length: result.length, results: results });
});

exports.priceRange = catchAsync(async (req, res, next) => {
  const result = await Residence.aggregate([
    {
      $group: {
        _id: 'price',
        max: { $max: '$price.single' },
        min: { $min: '$price.single' },
      },
    },
  ]);

  return res.status(200).json({
    status: 'success',
    result: result[0],
  });
});
