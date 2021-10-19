const College = require('../model/College.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createCollege = catchAsync(async (req, res, next) => {
  const { name, city } = req.body;

  if (!name || !city) return next(new AppError('Please fill all field', 400));

  const college = await College.create({
    name,
    city,
  });

  return res.status(200).json({
    status: 'success',
    college,
  });
});

exports.getCollege = catchAsync(async (req, res, next) => {
  const colleges = await College.find({});

  return res.status(200).json({
    status: 'success',
    data: colleges.length,
    colleges,
  });
});

exports.deleteCollege = catchAsync(async (req, res, next) => {
  const { collegeId } = req.params;

  if (!collegeId) return next(new AppError('No college found', 404));

  const college = await College.deleteOne({ _id: collegeId });

  if (!college || !college?.deletedCount)
    return next(new AppError('No college found', 404));

  return res.status(200).json({ status: 'success' });
});

exports.editCollege = catchAsync(async (req, res, next) => {
  const { collegeId } = req.params;

  if (!collegeId || !req.body)
    return next(new AppError('No college found', 404));

  const college = await College.findByIdAndUpdate(collegeId, req.body);

  return res.status(200).json({ status: 'success', college });
});
