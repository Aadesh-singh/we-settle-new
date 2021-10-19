const { deleteAImage, deleteImages } = require('./multer');

const deleteFile = async (file = null, files = null) => {
  console.log(file, files);
  if (file) {
    return await deleteAImage(file?.key);
  }
  await deleteImages(files);
};

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(async (e) => {
      if (req?.file || req?.files) {
        // await deleteAImage(req?.file?.key);
        await deleteFile(req?.file, req?.files)
          .then((res) => console.log(1, res))
          .catch((err) => console.log(2, err));
      }
      return next(e);
    });
  };
};
