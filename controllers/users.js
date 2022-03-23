const User = require('../models/user');

module.exports.createRegisterForm = (req, res) => {
   res.render('users/register')
}

module.exports.createUser = async (req, res, next) => {
   try {
      let { username, email, password } = req.body;
      let user = new User({username, email});
      let newUser = await User.register(user, password);
      req.login(newUser, (err) => {
         if(err) return next(err);
         req.flash('success', 'Welcome to Yelp Camp')
         res.redirect('/campgrounds');
      })
   } catch (e) {
      req.flash('error', e.message);
      res.redirect('/register')
   }
}

module.exports.renderLoginForm = (req, res) => {
   res.render('users/login');
}

module.exports.login = (req, res) => {
   req.flash('success', `Welcome back, ${req.body.username.replace(/^\w/, (c) => c.toUpperCase())} !`);
   const returnUrl = req.session.returnTo || 'campgrounds';
   delete req.session.returnTo;
   res.redirect(returnUrl);
}

module.exports.logout = (req, res) => {
   req.logout();
   req.flash('success', 'Bye!');
   res.redirect('/campgrounds');
}