const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = 5000 || process.env.PORT;
const dotenv = require('dotenv');
const connection = require('./DBConnection/Connection');
const path = require('path');
const fileUpload = require('express-fileupload');

app.use(
  express.json({
    limit: '200mb',
  }),
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    limit: '200mb',
    extended: true,
  }),
);
app.use(cors());
dotenv.config({
  path: '.env',
});

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

module.exports = cloudinary;

app.use(fileUpload());

// app.get('/', (req, res) => res.send('Express on Vercel'));

app.listen(PORT, () => {
  console.log(`Backend Port Listening on Port: ${PORT}`);
});

connection();

const RestaurantRoutes = require('./Routes/RestaurantRoutes');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', RestaurantRoutes);

module.exports = app;
