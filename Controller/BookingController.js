const BookingModel = require('../Model/BookingModel');
const RestaurantModel = require('../Model/RestaurantModel');
const {uploadImage} = require('./RestaurantController');
const moment = require('moment');

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const Restaurant = await RestaurantModel.findById(req.params.id);
    const {RestaurantName, image, price, Bookingdate, Bookingtime, Seat} =
      req.body;

    // const IsExists = await BookingModel.findOne({Seat: {$in: Seat}});

    if (!Restaurant) {
      return res.status(400).json({
        status: 0,
        message: 'No Restaurant Found',
      });
    }

    // if (IsExists) {
    //   return res.status(400).json({
    //     status: 0,
    //     message: 'The Selected Table Is Currently UnAvailable...',
    //   });
    // }

    const result = await uploadImage(image);

    const Booking = new BookingModel({
      RestaurantName,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      price,
      Bookingdate,
      Bookingtime,
      Seat,
      owner: Restaurant._id,
    });

    Restaurant.bookings.push(Booking._id);
    await Booking.save();
    await Restaurant.save();

    return res.status(200).json({
      status: 1,
      message: 'Seat Booked Successfully',
      data: Booking,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const {page, limit} = req.query;
    const Islimit = limit ? parseInt(limit) : 5;
    const skip = page ? (parseInt(page) - 1) * Islimit : 0;
    const Bookings = await BookingModel.find({})
      .sort({createdAt: -1})
      .limit(Islimit)
      .skip(skip);

    // counting Total Documents
    const totalBookings = await BookingModel.countDocuments({});

    // counting Total Pages
    const totalPages = Math.ceil(totalBookings / Islimit);

    return res.status(200).json({
      status: 1,
      message: 'Bookings Fetched Successfully',
      data: Bookings,
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

// Get Today's Booking
exports.getTodayBookings = async (req, res) => {
  try {
    const {page, limit} = req.query;
    const Islimit = limit ? parseInt(limit) : 5;
    const skip = page ? (parseInt(page) - 1) * Islimit : 0;

    const todayDate = moment().format('YYYY/MM/DD'); // Get current date

    const Bookings = await BookingModel.find({
      Bookingdate: todayDate,
    })
      .sort({createdAt: -1})
      .limit(Islimit)
      .skip(skip);

    // counting Total Documents
    const totalBookings = await BookingModel.countDocuments({
      Bookingdate: todayDate,
    });

    // counting Total Pages
    const totalPages = Math.ceil(totalBookings / Islimit);

    return res.status(200).json({
      status: 1,
      message: 'Bookings Fetched Successfully',
      data: Bookings,
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

// Cancel Booking
exports.CancelledBooking = async (req, res) => {
  try {
    const {status} = req.body;

    const CheckIsCancelled = await BookingModel.findById(req.params.id);

    if (!CheckIsCancelled) {
      return res.status(400).json({
        status: 0,
        message: 'Booking Not Found',
      });
    }

    if (CheckIsCancelled.status === 'Cancelled') {
      return res.status(400).json({
        status: 0,
        message: 'Appointment Already Cancelled',
      });
    }

    CheckIsCancelled.CancelledSeats = CheckIsCancelled.Seat;

    await CheckIsCancelled.save();

    const Booking = await BookingModel.findByIdAndUpdate(
      req.params.id,
      {status, $unset: {Seat: ''}},
      {new: true},
    );

    return res.status(200).json({
      status: 1,
      message: 'Booking Cancelled Successfully',
      Booking,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// Get Cancelled Bookings
exports.getCancelledBookings = async (req, res) => {
  try {
    const {page, limit} = req.query;
    const Islimit = limit ? parseInt(limit) : 5;
    const skip = page ? (parseInt(page) - 1) * Islimit : 0;

    const Bookings = await BookingModel.find({
      status: 'Cancelled',
    })
      .sort({createdAt: -1})
      .limit(Islimit)
      .skip(skip);

    // counting Total Documents
    const totalBookings = await BookingModel.countDocuments({
      status: 'Cancelled',
    });

    // counting Total Pages
    const totalPages = Math.ceil(totalBookings / Islimit);

    return res.status(200).json({
      status: 1,
      message: 'Bookings Fetched Successfully',
      data: Bookings,
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
