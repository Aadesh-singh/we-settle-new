const City = require('../model/City.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createCity = catchAsync(async (req, res, next) => {
  const { cityName } = req.body;
  if (!cityName) return next(new AppError('city name is required', 400));

  const city = await City.create({
    cityName,
  });

  return res.status(201).json({ status: 'success', city });
});

exports.getCities = catchAsync(async (req, res, next) => {
  const cities = await City.find();

  return res.status(200).json({
    status: 'success',
    length: cities.length,
    cities,
  });
});

exports.editCity = catchAsync(async (req, res, next) => {
  const { cityId } = req.params;

  if (!cityId) return next(new AppError('No city found', 404));

  const city = await City.findById(cityId);

  const { cityName } = req.body;
  if (!city || !cityName) return next(new AppError('No city found', 404));

  city.cityName = cityName;

  await city.save();

  return res.status(200).json({ status: 'success', city });
});

exports.deleteCity = catchAsync(async (req, res, next) => {
  const { cityId } = req.params;

  if (!cityId) return next(new AppError('No city found', 404));

  const city = await City.findByIdAndDelete({ _id: cityId });

  if (!city) return next(new AppError('No city found', 400));
  return res.status(200).json({ status: 'success' });
});
