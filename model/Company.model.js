const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
  },
  email: {
    type: String,
    validate: isEmail,
    required: [true, 'Company Email is required'],
  },
  address: {
    type: String,
    required: [true, 'Company address is required'],
  },
  phoneNo: {
    type: Number,
    required: [true, 'Phone no is required'],
  },
});

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;
