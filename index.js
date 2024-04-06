const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const Post = require('./models/Post');
const Tag = require('./models/Tag');
const session = require('express-session');
require('./models/association');
const bodyParser = require('body-parser');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const passpostLocal = require('./config/passport-local');
// Handle POST request to create a new pos

const port = 8000;
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(express.static('assets'));

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes'));

sequelize
  .sync()
  .then(() => {
    console.log('Database and tables synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
app.listen(port, function (err) {
  if (err) {
    console.log('Error');
  }
  console.log('running');
});
