const express = require('express');
const {
  createRestaurant,
  getRestaurant,
  getDashboardCounts,
} = require('../Controller/RestaurantController');
const {createBooking} = require('../Controller/BookingController');
const {getAllBookings} = require('../Controller/BookingController');
const {getRestaurantById} = require('../Controller/RestaurantController');
const {getTodayBookings} = require('../Controller/BookingController');
const {CancelledBooking} = require('../Controller/BookingController');
const {getCancelledBookings} = require('../Controller/BookingController');
const router = express.Router();

// Restaurant Routes
router.route('/create-restaurant').post(createRestaurant);
router.route('/get-restaurant').get(getRestaurant);
router.route('/show-restaurant').get(getRestaurantById);
// Restaurant Routes

// Bookings Routes
router.route('/create-booking/:id').post(createBooking);
router.route('/get-all-booking').get(getAllBookings);
router.route('/get-today-booking').get(getTodayBookings);
router.route('/cancel-booking/:id').put(CancelledBooking);
router.route('/get-cancel-booking').get(getCancelledBookings);
// Bookings Routes

// Dashboard Metrics Counts
router.route('/get-dashboard-metrics-counts').get(getDashboardCounts);
// Dashboard Metrics Counts

module.exports = router;
