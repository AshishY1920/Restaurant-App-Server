const cloudinary = require('cloudinary');
const RestaurantModel = require('../Model/RestaurantModel');

// Image Uploader
exports.uploadImage = async image => {
  try {
    const result = await cloudinary.uploader.upload(image);
    return result.secure_url;
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

// Create Restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const {RestaurantName, image, description, address} = req.body;

    const result = await this.uploadImage(image);

    const Restaurant = new RestaurantModel({
      RestaurantName,
      image: result,
      description,
      address,
    });

    await Restaurant.save();

    return res.status(200).json({
      status: 1,
      message: 'Restaurant Created Successfully!',
      data: Restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// get Restaurant
exports.getRestaurant = async (req, res) => {
  try {
    const {page, limit, search} = req.query;
    const Islimit = limit ? parseInt(limit) : 5;
    const skip = page ? (parseInt(page) - 1) * Islimit : 0;

    // search Query

    let query = {};
    if (search) {
      query = {RestaurantName: {$regex: search, $options: 'i'}};
    }

    // Multiple Fields
    // if (search) {
    //   const regex = new RegExp(search, 'i');
    //   query = {
    //     $or: [
    //       { RestaurantName: { $regex: regex } },
    //       { Address: { $regex: regex } }
    //     ]
    //   };
    // }

    const Restaurant = await RestaurantModel.find(query)
      .sort({createdAt: -1})
      .limit(Islimit)
      .skip(skip);

    // count Total Restaurant Documents
    const totalRestaurant = await RestaurantModel.countDocuments({});

    // count Total page
    const totalPages = Math.ceil(totalRestaurant / Islimit);

    return res.status(200).json({
      status: 1,
      message: 'Restaurant Fetched Successfully',
      data: Restaurant,
      pagination: {
        page: page || 1,
        limit: Islimit,
        totalPage: totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// get Restaurant By Id
exports.getRestaurantById = async (req, res) => {
  try {
    const {date} = req.body;
    const Restaurant = await RestaurantModel.findById(req.params.id)
      .select('bookings')
      .populate({
        path: 'bookings',
        match: {
          Bookingdate: date,
        },
      });

    if (!Restaurant) {
      return res.status(400).json({
        status: 0,
        message: 'No Restaurant Found',
      });
    }

    return res.status(200).json({
      status: 1,
      data: Restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};
