const BookingModel = require('../Model/BookingModel');
const RestaurantModel = require('../Model/RestaurantModel');
const {uploadImage} = require('./RestaurantController');

exports.createBooking = async (req, res) => {
  try {
    const Restaurant = await RestaurantModel.findById(req.params.id);
    const {RestaurantName, image, price, Bookingdate, Bookingtime, Seat} =
      req.body;

    const IsExists = await RestaurantModel.findOne({Seat: {$in: Seat}});

    if (IsExists) {
      return res.status(400).json({
        status: 0,
        message: 'The Selected Table Is Currently UnAvailable...',
      });
    }

    const result = await uploadImage(image);

    const Booking = new BookingModel({
      RestaurantName,
      image: result,
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

exports.getTodayBookings = async (req, res) => {
  try {
    const {page, limit} = req.query;
    const Islimit = limit ? parseInt(limit) : 5;
    const skip = page ? (parseInt(page) - 1) * Islimit : 0;

    const date = new Date(); // Get current date
    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;

    const Bookings = await BookingModel.find({
      Bookingdate: formattedDate,
    })
      .sort({createdAt: -1})
      .limit(Islimit)
      .skip(skip);

    // counting Total Documents
    const totalBookings = await BookingModel.countDocuments({
      Bookingdate: formattedDate,
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
