const mongoose = require('mongoose');

const RestaurantModel = new mongoose.Schema(
  {
    RestaurantName: {
      type: String,
    },
    image: {
      public_id: String,
      url: String,
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
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seats',
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Restaurant', RestaurantModel);
// xxxxxxxx
