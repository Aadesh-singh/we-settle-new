const Seo = require('../model/Seo.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { deleteAImage } = require('../utils/multer');

exports.updateSeo = catchAsync(async (req, res, next) => {
  const file = req.files;
  const { name, metaTitle, metaDescription, metaKeyword } = req.body;
  console.log(req.body);
  const images = [];

  if (file?.logo) images.push(file?.logo[0]);
  if (file?.favicon) images.push(file?.favicon[0]);

  req.files = images;

  if (!name || !metaTitle || !metaDescription || !metaKeyword)
    return next(new AppError('Please Fill all field', 400, req));

  const seo = await Seo.findOne();

  if (!seo) {
    if (!file?.logo || !file?.favicon)
      return next(new AppError('Image is required', 400, req));

    const newSeo = await Seo.create({
      name,
      metaTitle,
      metaDescription,
      metaKeyword,
      logo: {
        path: file?.logo[0]?.key,
        url: file?.logo[0]?.location,
      },
      favicon: {
        path: file?.favicon[0]?.key,
        url: file?.favicon[0]?.location,
      },
    });

    return res.status(201).json({ status: 'success', seo: newSeo });
  }

  if (file?.logo || file?.logo?.length) {
    await deleteAImage(seo?.logo?.path);
    seo.logo = {
      path: file?.logo[0]?.key,
      url: file?.logo[0]?.location,
    };
  }

  if (file?.favicon || file?.favicon?.length) {
    await deleteAImage(seo?.favicon?.path);
    seo.favicon = {
      path: file?.favicon[0]?.key,
      url: file?.favicon[0]?.location,
    };
  }

  for (let body in req.body) {
    seo[body] = req.body[body];
  }

  await seo.save();

  return res.status(200).json({ status: 'success', seo });
});

exports.getSeo = catchAsync(async (req, res, next) => {
  const seo = await Seo.findOne();

  return res.status(200).json({ status: 'success', seo });
});
