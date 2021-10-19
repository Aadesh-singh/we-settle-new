const Area = require('../model/Area.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/ApiFeautures');

const parentArea = {
  path: 'parentArea',
  select: '_id name',
};

exports.getArea = catchAsync(async (req, res, next) => {
  const api = new APIFeatures(Area.find(), req.query)
    .filter()
    .limitFields()
    .populate(parentArea)
    .populate('city')
    .sort();
  const areas = await api.query;
  return res.status(200).json({
    status: 'success',
    length: areas.length,
    areas,
  });
});

exports.getAreaByCity = catchAsync(async (req, res, next) => {
  const { cityId } = req.params;
  if (!cityId) return next(new AppError('City is required'));

  const areas = await Area.find({ city: cityId, placeType: 'area' })
    .populate(parentArea)
    .populate('city');

  if (!areas) return next(new AppError('No area found', 404));

  return res.status(200).json({ areas, status: 'success' });
});

exports.getLocalityByArea = catchAsync(async (req, res, next) => {
  const { areaId } = req.params;
  if (!areaId)
    return next(new AppError('City is required'))
      .populate(parentArea)
      .populate('city');

  const areas = await Area.find({ parentArea: areaId, placeType: 'locality' })
    .populate(parentArea)
    .populate('city');

  if (!areas) return next(new AppError('No area found', 404));

  return res.status(200).json({ areas, status: 'success' });
});

exports.createArea = catchAsync(async (req, res, next) => {
  const { name, city, placeType, parentArea } = req.body;

  if (!name || !city || !placeType)
    return next(new AppError('Area name and city is required', 400));

  const area = await Area.create({
    name,
    city,
    placeType,
    parentArea: parentArea || null,
  });

  return res.status(200).json({
    status: 'success',
    area,
  });
});

exports.deleteArea = catchAsync(async (req, res, next) => {
  const { areaId } = req.params;
  if (!areaId) return next(new AppError('No area found', 404));

  const area = await Area.deleteOne({ _id: areaId });

  if (!area || !area?.deletedCount)
    return next(new AppError('No area found', 404));

  console.log(area);

  return res.status(200).json({ status: 'success' });
});

exports.editArea = catchAsync(async (req, res, next) => {
  const { areaId } = req.params;
  if (!areaId || !req.body) return next(new AppError('No area found', 404));

  const area = await Area.findByIdAndUpdate(areaId, req.body)
    .populate(parentArea)
    .populate('city');

  if (!area) return next(new AppError('No area found', 404));

  return res.status(200).json({ status: 'success', area });
});
