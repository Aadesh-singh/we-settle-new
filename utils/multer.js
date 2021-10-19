const multerS3 = require('multer-s3');
const multer = require('multer');
const aws = require('aws-sdk');
const path = require('path');
// const AppError = require('./AppError');
const { MulterError } = require('multer');

aws.config.update({
  region: 'ap-south-1',
});

const s3 = new aws.S3({});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    // custom error
    cb(new MulterError('IMAGES_ONLY'));
  }
}

const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        file.originalname +
          path.extname(file.originalname) +
          '-' +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  preservePath: true,
});

const deleteAImage = async (key) => {
  return await s3
    .deleteObject({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    })
    .promise();
};

const deleteImages = async (files) => {
  console.log(files);
  const Objects = files.map((file) => ({ Key: file?.key || file?.path }));
  console.log(Objects);
  if (!Objects || !Objects?.length) return;
  return await s3
    .deleteObjects({
      Bucket: process.env.BUCKET_NAME,
      Delete: {
        Objects,
      },
    })
    .promise();
};

module.exports = { imageUpload, s3, deleteAImage, deleteImages };
