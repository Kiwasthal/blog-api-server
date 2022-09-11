const express = require('express');
const apiRouter = require('./routes/api');
const app = express();
const passport = require('passport');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

require('dotenv').config();

// --- Database Configuration

const mongoDB = process.env.MONGO_URI;
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(mongoDB, mongoOptions, () =>
  console.log('Connected to database')
);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to database'));
// --- Cors Origin

let corsOptions = {
  origin: [
    'https://kiwasthal-blog.vercel.app',
    'https://kiwasthal.github.io/blog-api-cms',
    'http://localhost:8080',
  ],
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors(corsOptions));

// --- Pasport Authentication

require('./config/passport');

// app.use(passport.initialize());
// app.use(passport.session());

app.use('/api', cors(corsOptions), apiRouter);

app.listen(port, () => console.log(`Server listening on ${port}`));
