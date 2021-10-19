const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'College name is required'],
    unique: true,
    trim: true,
    
  },

  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
});

const College = mongoose.model('College', CollegeSchema);

module.exports = College;
