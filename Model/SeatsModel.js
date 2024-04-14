const mongoose = require('mongoose');

const SeatsModel = new mongoose.Schema(
  {
    seats: [
      {
        seat: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Seats', SeatsModel);
