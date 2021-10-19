const { deleteImages } = require('./multer');

class AppError extends Error {
  constructor(message, statusCode, req) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.files = req?.file ? [req?.file] : req?.files || '';
    this.deleteImage();
    Error.captureStackTrace(this, this.constructor);
  }

  async deleteImage() {
    console.log('delete');
    if (this.files) await deleteImages(this.files).then();
  }
}

module.exports = AppError;
