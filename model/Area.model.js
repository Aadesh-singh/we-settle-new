const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Area name is required'],
      // unique: true,
      trim: true,
      lowercase: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
    },
    slug: String,
    placeType: {
      type: String,
      enum: ['area', 'locality', 'college'],
      required: [true, 'Place type is required'],
    },
    parentArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
    },
  },
  { timestamps: true }
);

AreaSchema.index({ name: 1, city: 1, placeType: 1 }, { unique: true });

// AreaSchema.pre(/find/, function (next) {
//   this.find().populate('parentArea').populate('city');
//   next();
// });

const Area = mongoose.model('Area', AreaSchema);

module.exports = Area;
