const express = require('express');
const {
  createRestaurant,
  getRestaurant,
  getDashboardCounts,
  updateRestaurantById,
  deleteRestaurantById,
  getLatestRestaurant,
  getRestaurantByCategories,
} = require('../Controller/RestaurantController');
const {createBooking} = require('../Controller/BookingController');
const {getAllBookings} = require('../Controller/BookingController');
const {getRestaurantById} = require('../Controller/RestaurantController');
const {getTodayBookings} = require('../Controller/BookingController');
const {CancelledBooking} = require('../Controller/BookingController');
const {getCancelledBookings} = require('../Controller/BookingController');
const {
  createSeat,
  getSeatsByRestaurants,
  deleteSeatsByObjectId,
} = require('../Controller/SeatsController');
const {
  createCategories,
  getSelectedCategories,
  getAllCategories,
} = require('../Controller/CategoriesController');
const router = express.Router();

// Restaurant Routes
router.route('/create-restaurant').post(createRestaurant);
router.route('/get-restaurant').get(getRestaurant);
router.route('/show-restaurant').get(getRestaurantById);
router.route('/update-restaurant/:id').put(updateRestaurantById);
router.route('/delete-restaurant/:id').delete(deleteRestaurantById);
router.route('/get-latest-restaurant').get(getLatestRestaurant);
router
  .route('/get-restaurant-categories/:category')
  .get(getRestaurantByCategories);
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

// Seats Routes
router.route('/create-seats/:id').post(createSeat);
router.route('/get-seats/:id').get(getSeatsByRestaurants);
router.route('/update-seats/:id').delete(deleteSeatsByObjectId);
// Seats Routes

// Categories Routes
router.route('/create-categories').post(createCategories);
router.route('/get-categories').get(getSelectedCategories);
router.route('/get-all-categories').get(getAllCategories);

module.exports = router;
