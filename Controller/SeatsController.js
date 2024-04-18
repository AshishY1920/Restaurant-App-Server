const RestaurantModel = require('../Model/RestaurantModel');
const SeatsModel = require('../Model/SeatsModel');

// Create Seat
exports.createSeat = async (req, res) => {
  try {
    const {seats} = req.body;
    const Restaurant = await RestaurantModel.findById(req.params.id);

    if (!seats) {
      return res.status(400).json({
        status: 0,
        message: 'Seats is Required Field',
      });
    }

    // checking if Seats Array Includes the value which is sending the user
    const existingSeats = await SeatsModel.find({
      'seats.seat': {$in: seats.map(seat => seat.seat)},
      // seats: {$elemMatch: {$in: seats}},
      owner: Restaurant._id,
    });

    if (existingSeats.length > 0) {
      // let exists = existingSeats.seats.map(seat => seat.seats.join(', '));
      const existingSeatNumbers = existingSeats
        .map(seat => seat.seats.map(s => s.seat))
        .flat();
      return res.status(400).json({
        status: 0,
        message: `One or more seats already exist in the restaurant ${existingSeatNumbers}`,
      });
    }

    const Seat = await new SeatsModel({
      seats: seats,
      owner: Restaurant._id,
    });

    Restaurant.seats.push(Seat._id);

    await Seat.save();
    await Restaurant.save();

    return res.status(200).json({
      status: 1,
      message: 'Seats Created Successfully',
      data: Seat,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

// Get Seats By Restaurant Id
exports.getSeatsByRestaurants = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findById(req.params.id);
    const seats = await SeatsModel.find({owner: restaurant._id}).select(
      '-_id -seats._id -owner -createdAt -updatedAt',
    );

    return res.status(200).json({
      status: 1,
      message: 'Seats Retrieved Successfully',
      data: seats,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};
