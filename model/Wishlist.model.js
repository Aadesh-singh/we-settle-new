const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    residenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Residence',
      required: [true, 'Residence is required'],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

WishlistSchema.index({ userId: 1, residenceId: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = Wishlist;
