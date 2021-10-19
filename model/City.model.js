const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: [true, 'City name is required'],
    unique: true,
    trim: true,
  },
});

CitySchema.pre('save', function (next) {
  this.cityName = this.cityName.toLowerCase();
  next();
});

const City = mongoose.model('City', CitySchema);

module.exports = City;
