const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    email: {
      type: String,
      validate: isEmail,
      required: [true, 'Email is required'],
      unique: [true, 'Email should be unique'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    phoneNo: {
      type: Number,
      required: [true, 'Phone no is required'],
      min: 10,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
    },
    college: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
      enum: {
        values: ['user', 'admin'],
        message: 'Invalid Role!',
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (
  userPassword,
  hashedPassword
) {
  return await bcrypt.compare(userPassword, hashedPassword);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
