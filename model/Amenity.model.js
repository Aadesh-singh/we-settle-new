const mongoose = require('mongoose');
const { deleteAImage } = require('../utils/multer');

const AmenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Amenity should have a name'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  image: {
    path: {
      type: String,
      required: [true, 'Image must have apath'],
    },
    url: {
      type: String,
      required: [true, 'Image must have a path'],
    },
  },
});

const Amenity = mongoose.model('Amenity', AmenitySchema);

module.exports = Amenity;
