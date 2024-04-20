const mongoose = require('mongoose');

const CategoriesModel = new mongoose.Schema(
  {
    categoriesName: {
      type: String,
    },
    image: {
        public_id: String,
        url: String
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

module.exports = mongoose.model('Categories', CategoriesModel);
