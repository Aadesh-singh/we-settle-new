const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const RequestSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last name is required'],
    },
    email: {
      type: String,
      validate: isEmail,
      required: [true, 'Email is required'],
      unique: [true, 'Email should be unique'],
    },
    phoneNo: {
      type: Number,
      required: [true, 'Phone no is required'],
      min: 10,
    },
    area: {
      type: String,
      trim: true,
      required: [true, 'Area is required'],
    },
    whatsappUpdate: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
    },
  },
  { timestamps: true }
);

const Request = mongoose.model('Request', RequestSchema);

module.exports = Request;
