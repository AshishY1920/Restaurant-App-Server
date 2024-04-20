const cloudinary = require('cloudinary');
const RestaurantModel = require('../Model/RestaurantModel');
const moment = require('moment');
const BookingModel = require('../Model/BookingModel');
const SeatsModel = require('../Model/SeatsModel');

// Image Uploader
exports.uploadImage = async image => {
  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: 'TableBookingApp',
    });
    return result;
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

// Create Restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const {RestaurantName, description, address, categories} = req.body;

    const result = await this.uploadImage(req.body.image);

    const Restaurant = new RestaurantModel({
      RestaurantName,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      description,
      address,
      categories,
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
    const totalRestaurant = await RestaurantModel.countDocuments(
      query ? query : {},
    );

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
    const {id, date} = req.query;

    const defaultDate = moment().format('YYYY/MM/DD'); // Get current date
    const Restaurant = await RestaurantModel.findById(id)
      .select('bookings')
      .populate({
        path: 'bookings',
        match: {
          Bookingdate: date || defaultDate,
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

// get Metrics counts
exports.getDashboardCounts = async (req, res) => {
  try {
    let todayDate = moment().format('YYYY/MM/DD');
    const restaurantCount = await RestaurantModel.countDocuments({});
    const AllBookingsCount = await BookingModel.countDocuments({});
    const CancelledBookingCounts = await BookingModel.countDocuments({
      status: 'Cancelled',
    });

    const TodaysBookingCounts = await BookingModel.countDocuments({
      Bookingdate: todayDate,
    });

    return res.status(200).json({
      status: 1,
      message: 'Metrics Count Fetched Successfully',
      metrics_counts: {
        total_restaurant: restaurantCount,
        total_bookings: AllBookingsCount,
        cancelled_booking: CancelledBookingCounts,
        today_booking: TodaysBookingCounts,
      },
      chart_counts_restaurant: {
        total_restaurant: restaurantCount,
      },
      chart_counts_bookings: {
        total_bookings: AllBookingsCount,
        cancelled_booking: CancelledBookingCounts,
        today_booking: TodaysBookingCounts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// Update Restaurant By Id
exports.updateRestaurantById = async (req, res) => {
  try {
    const {RestaurantName, description, address, image} = req.body;
    const restaurant = await RestaurantModel.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        status: 0,
        message: 'Invalid Restaurant Id',
      });
    }

    if (RestaurantName) restaurant.RestaurantName = RestaurantName;
    if (description) restaurant.description = description;
    if (address) restaurant.address = address;
    if (image) {
      // deleting Previous Image
      const [newImage] = await Promise.all([
        cloudinary.v2.uploader.destroy(restaurant.image.public_id),
        this.uploadImage(image),
      ]);

      restaurant.image = {
        public_id: newImage.public_id,
        url: newImage.secure_url,
      };
    }

    await restaurant.save();

    return res.status(200).json({
      status: 1,
      message: 'Restaurant Updated Successfully',
      data: restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// Delete Restaurant By Id
exports.deleteRestaurantById = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findById(req.params.id);

    if (!restaurant) {
      return res.status(200).json({
        status: 0,
        message: 'Invalid Restaurant Id',
      });
    }

    const [] = await Promise.all([
      SeatsModel.deleteMany({owner: restaurant._id}),
      BookingModel.deleteMany({owner: restaurant._id}),
      restaurant.deleteOne(),
    ]);

    return res.status(200).json({
      status: 1,
      message: 'Restaurant All Data Asscociated With It, Deleted Successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// Get All Unique Categories
exports.getAllCategores = async (req, res) => {
  try {
    const categories = await RestaurantModel.aggregate([
      {$match: {categories: {$ne: null}}},
      {$group: {_id: '$categories', image: {$first: '$image'}}},
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
