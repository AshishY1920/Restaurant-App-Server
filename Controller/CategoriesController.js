const CategoryModel = require('../Model/CategoryModel');
const {uploadImage} = require('./RestaurantController');

// Create Categories
exports.createCategories = async (req, res) => {
  try {
    const {categoriesName} = req.body;
    const result = await uploadImage(req.body.image);

    const Categories = await new CategoryModel({
      categoriesName,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    await Categories.save();

    return res.status(201).json({
      status: 1,
      message: 'Categories Created Successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// Get All Unique Categories
exports.getSelectedCategories = async (req, res) => {
  try {
    const categories = await RestaurantModel.aggregate([
      {$unwind: '$categories'},
      // Populate the categories field
      {
        $lookup: {
          from: 'categories', // Assuming the name of your categories collection is "categories"
          localField: 'categories',
          foreignField: '_id',
          as: 'populatedCategory',
        },
      },
      {$unwind: '$populatedCategory'},
      // Group by category ID to remove duplicates
      {
        $group: {
          _id: '$populatedCategory._id',
          name: {$first: '$populatedCategory.categoriesName'},
          image: {$first: '$populatedCategory.image'},
        },
      },
      // {$unwind: "$categories"}
      // {$match: {categories: {$ne: null}}},
      // {$group: {_id: '$categories', image: {$first: '$image'}}},
    ]);

    if (!categories) {
      return res.status(400).json({
        status: 0,
        message: 'No Categories Found',
      });
    }

    return res.status(200).json({
      status: 1,
      message: 'Categories Retrieved Successfully',
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({})
      .sort({createdAt: -1})
      .select('-createdAt -updatedAt -__v');

    if (!categories) {
      return res.status(400).json({
        status: 0,
        message: 'No Categories Found',
      });
    }

    return res.status(200).json({
      status: 1,
      message: 'Categories Retrieved Successfully',
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};
