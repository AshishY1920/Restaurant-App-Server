const express = require('express');
const {
  createRestaurant,
  getRestaurant,
} = require('../Controller/RestaurantController');
const {createBooking} = require('../Controller/BookingController');
const {getAllBookings} = require('../Controller/BookingController');
const {getRestaurantById} = require('../Controller/RestaurantController');
const {getTodayBookings} = require('../Controller/BookingController');
const {CancelledBooking} = require('../Controller/BookingController');
const {getCancelledBookings} = require('../Controller/BookingController');
const router = express.Router();

router.route('/create-restaurant').post(createRestaurant);
router.route('/get-restaurant').get(getRestaurant);
router.route('/show-restaurant').get(getRestaurantById);
router.route('/create-booking/:id').post(createBooking);
router.route('/get-all-booking').get(getAllBookings);
router.route('/get-today-booking').get(getTodayBookings);
router.route('/cancel-booking/:id').put(CancelledBooking);
router.route('/get-cancel-booking').get(getCancelledBookings);

module.exports = router;
