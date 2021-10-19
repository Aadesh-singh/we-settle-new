const Wishlist = require('../model/Wishlist.model');
const APIFeatures = require('../utils/ApiFeautures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { exportWishlist } = require('../utils/excel');

exports.getWishlist = catchAsync(async (req, res, next) => {
  const api = new APIFeatures(
    Wishlist.find({ deleted: false })
      .populate('userId')
      .populate('residenceId'),
    req.query
  )
    .filter()
    .limitFields()
    .sort('createdAt', -1)
    .paginate();

  const wishlist = await api.query;
  return res.status(200).json({
    status: 'success',
    length: wishlist.length,
    wishlist,
  });
});

exports.addWishlist = catchAsync(async (req, res, next) => {
  const { id: residenceId } = req.params;

  if (!residenceId) return next(new AppError('Invalid data', 400));

  const isWishlisted = await Wishlist.findOne({
    userId: req?.user?._id,
    residenceId,
  });

  if (isWishlisted) {
    isWishlisted.deleted = !isWishlisted.deleted;
    await isWishlisted.save();
    return res.status(200).json({
      status: 'success',
      wishlist: isWishlisted,
    });
  }
  const wishlist = await Wishlist.create({
    userId: req?.user?._id,
    residenceId,
  });

  return res.status(201).json({
    status: 'success',
    wishlist,
  });
});

exports.deleteWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Wishlist.findOneAndDelete({
    _id: req.params?.id,
  });
  if (!wishlist)
    return res
      .status(400)
      .json({ status: 'fail', message: 'No property found' });
  return res.status(200).json({
    status: 'success',
  });
});

exports.getResidenceWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Wishlist.find({ residenceId: req.params.residenceId })
    .populate('residenceId')
    .populate('userId');

  return res.status(200).json({
    status: 'success',
    wishlist,
  });
});

exports.isUserWishlisted = catchAsync(async (req, res, next) => {
  console.log(req.user, req.user._id.toString());
  const wishlist = await Wishlist.findOne({
    residenceId: req.params?.id,
    userId: req?.user?._id.toString(),
    deleted: false,
  });
  return res.status(201).json({
    status: 'success',
    wishlist,
  });
});

exports.userWishlistedResidence = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) return next(new AppError('User Id is required', 400));

  const wishlist = await Wishlist.find({ userId, deleted: false }).populate(
    'residenceId'
  );

  return res.status(200).json({
    status: 'success',
    wishlist,
  });
});

exports.userWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Wishlist.find({
    userId: req?.user?._id?.toString(),
  }).populate('residenceId');

  return res.status(200).json({
    status: 'success',
    wishlist,
  });
});

exports.exportCsv = catchAsync(async (req, res, next) => {
  const api = new APIFeatures(
    Wishlist.find({ deleted: false })
      .populate('userId')
      .populate('residenceId'),
    req.query
  )
    .filter()
    .limitFields()
    .sort('createdAt', -1)
    .paginate();

  const wishlist = await api.query;
  if (!wishlist?.length) {
    return next(new AppError('No data found', 404));
  }

  const workbookXLSX = exportWishlist(wishlist, req.headers.origin);
  res.setHeader(
    'Content-Type',
    'appication/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachement; filename=Students');
  await workbookXLSX.write(res);
  res.end();
});
