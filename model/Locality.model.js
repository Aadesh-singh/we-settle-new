const mongoose = require('mongoose');

const LocalitySchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, 'Location is required'],
      unique: true,
      trim: true,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
    },
    slug: String,
  },
  { timestamps: true }
);

const Location = mongoose.model('Location', LocalitySchema);

module.exports = Location;
