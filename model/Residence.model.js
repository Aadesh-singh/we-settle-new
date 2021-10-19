const mongoose = require('mongoose');

const ResidenceSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Code is required'],
      unique: true,
    },
    name: {
      type: String,
      // required: [true, 'Name is required'],
      trim: true,
      lowercase: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City is required'],
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
      required: [true, 'Area is required'],
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
      // required: [true, 'City is required'],
    },
    college: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
        required: [true, 'College is required'],
      },
    ],
    images: [
      {
        path: {
          type: String,
          required: [true, 'Image is required'],
        },
        url: {
          type: String,
          required: [true, 'Image is required'],
        },
      },
    ],
    amenity: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Amenity',
        required: [true, 'Amenity is required'],
      },
    ],
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required'],
    },
    occupancy: {
      type: [
        {
          type: String,
          enum: ['prime', 'filling fast'],
        },
      ],
      default: ['prime'],
    },
    metaTitle: String,
    metaKeyword: String,
    metaDescription: String,
    status: {
      type: String,
      enum: ['published', 'not published'],
      required: [true, 'Property status is required'],
    },
    price: {
      single: Number,
      double: Number,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    trendingOrder: {
      type: Number,
      min: 1,
      max: [6, 'Trending order should be max of 6'],
    },
  },
  { timestamps: true }
);

// ResidenceSchema.index({ trending: 1, trendingOrder: 1 }, { unique: true });

ResidenceSchema.pre(/find/, function (next) {
  this.find().populate(
    // ['city', 'area', 'location', 'college', 'amenity']
    [
      {
        path: 'city',
        select: 'cityName _id',
      },
      {
        path: 'area',
        select: 'name _id',
      },
      {
        path: 'location',
        select: 'name _id',
      },
      ,
      {
        path: 'college',
        select: 'name _id',
      },
      {
        path: 'amenity',
        select: 'name image',
      },
    ]
  );
  // .sort(['price.single', 1]);
  next();
});

const Residence = mongoose.model('Residence', ResidenceSchema);

module.exports = Residence;
