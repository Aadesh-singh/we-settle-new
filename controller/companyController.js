const Company = require('../model/Company.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.updateCompanyDetails = catchAsync(async (req, res, next) => {
  const { name, email, phoneNo, address } = req.body;

  if (!name || !email || !phoneNo || !address)
    return next(new AppError('Please fill all fields', 400));

  const company = await Company.findOne();

  if (!company) {
    const newCompany = await Company.create({
      name,
      email,
      phoneNo,
      address,
    });

    return res.status(201).json({ status: 'success', company: newCompany });
  }

  for (let body in req.body) {
    company[body] = req.body[body];
  }

  await company.save();

  return res.status(200).json({ status: 'success', company });
});

exports.getCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findOne();
  return res.status(200).json({ status: 'success', company });
});
