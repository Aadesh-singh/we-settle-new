const mongoose = require('mongoose');

const SeoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Website name is required'],
    },
    metaTitle: {
      type: String,
      required: [true, 'Meta Title is required'],
    },
    metaKeyword: {
      type: String,
      required: [true, 'Meta Keyword is required'],
    },
    metaDescription: {
      type: String,
      required: [true, 'Meta Description is required'],
    },
    logo: {
      path: {
        type: String,
        required: [true, 'Image is required'],
      },
      url: {
        type: String,
        required: [true, 'Image is required'],
      },
    },
    favicon: {
      path: {
        type: String,
        required: [true, 'Image is required'],
      },
      url: {
        type: String,
        required: [true, 'Image is required'],
      },
    },
  },
  { timestamps: true }
);

const Seo = mongoose.model('Seo', SeoSchema);

module.exports = Seo;
