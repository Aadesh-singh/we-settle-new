const Script = require('../model/Script.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.updateScript = catchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError('No data to update'));

  const script = await Script.findOne();

  if (!script) {
    const newScript = await Script.create(req.body);
    return res.status(201).json({ status: 'success', script: newScript });
  }

  for (let body in req.body) {
    script[body] = req.body[body];
  }

  await script.save();

  return res.status(200).json({ status: 'success', script });
});

exports.getScript = catchAsync(async (req, res) => {
  const script = await Script.findOne();
  return res.status(200).json({
    status: 'success',
    script,
  });
});
