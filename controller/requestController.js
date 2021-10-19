const Request = require('../model/Request.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createRequest = catchAsync(async (req, res, next) => {
  const { firstName, lastName, phoneNo, email, area, whatsappUpdate, url } =
    req.body;

  if (!firstName || !lastName || !phoneNo || !email || !area) {
    return next(new AppError('Please fill all fields', 400));
  }

  if (typeof phoneNo !== 'number' || String(phoneNo).length !== 10) {
    return next(new AppError('Invalid Phone no', 400));
  }

  const request = await Request.create({
    firstName,
    lastName,
    phoneNo,
    email,
    area,
    whatsappUpdate,
    url: url || '',
  });

  return res.status(201).json({
    status: 'success',
    request,
  });
});

exports.getRequest = catchAsync(async (req, res, next) => {
  const requests = await Request.find({}).sort({ createdAt: -1 });
  return res.status(200).json({
    status: 'success',
    requests,
  });
});
