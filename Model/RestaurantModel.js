const mongoose = require('mongoose');

const RestaurantModel = new mongoose.Schema(
  {
    RestaurantName: {
      type: String,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Restaurant', RestaurantModel);
// xxxxxxxx
