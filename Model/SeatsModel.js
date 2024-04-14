const mongoose = require('mongoose');

const SeatsModel = new mongoose.Schema(
  {
    seats: {
      type: [String],
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

module.exports = mongoose.model('Seats', SeatsModel);
