const mongoose = require('mongoose');

const BookingModel = new mongoose.Schema(
  {
    RestaurantName: {
      type: String,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    Bookingdate: {
      type: String,
    },
    Bookingtime: {
      type: String,
    },
    Seat: {
      type: [String],
    },
    status: {
      type: String,
      enum: ['Booked', 'Cancelled'],
      default: 'Booked',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Booking', BookingModel);
