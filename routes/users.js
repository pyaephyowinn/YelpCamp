const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users')

router.route('/register')
   .get( users.createRegisterForm)
   .post( users.createUser);

router.route('/login')
   .get( users.renderLoginForm)
   .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', failureMessage: true }),
      users.login);

router.get('/logout', users.logout);

module.exports = router;