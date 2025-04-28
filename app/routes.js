

module.exports = function(app, passport, { User, Item, io }) {
  app.get('/', function(req, res) {
    res.render('index.ejs', { user: req.user || null, title: 'Home' });
  });

  app.get('/home', isLoggedIn, (req, res) => {
    Item.find().then(items => {
      res.render('home.ejs', {items, user: req.user, title: 'All Bids'});
    })
    .catch(err => {
      next(err);
    })
  });

  app.get('/items/new', isLoggedIn, (req, res) => {
    res.render('newItem.ejs', { user: req.user, title: 'New Item' });
  });

  app.post('/items/new', isLoggedIn, (req, res) => {
    const { name, description, imgURL, basePrice } = req.body;
    const newItem = new Item({
      name,
      description,
      imgURL,
      basePrice,
    });
    newItem.save().then(() => {
      res.redirect('/home');
    }).catch(err => {
      res.status(500).send('Error saving item');
    });
  });

  app.get('/items/:itemID', isLoggedIn, (req, res) => {
    const id = req.params.itemID;
    Item.findById(id).then((item) => {
      if (item) {
        res.render('item.ejs', { item, user: req.user, title: item.name});
      } else {
        res.status(404).json({ error: `Item does not exist`})
      }
    })
    .catch(error => {
      res.json({ error: `There was an error: ${error}`});
    });
  });

  app.get('/users', isLoggedIn, (req, res) => {
    User.find().then(users => {
      res.json({users: users})
    })
  });

  app.post('/bid', isLoggedIn, (req, res) => {
    const id = req.body._id;
    const bid = req.body.bid;
    const premium = req.body.premium;
    Item.findOneAndUpdate(
      { _id: id},
      {
        $set: {
          highestBid: bid,
          highestBidder: req.user,
        },
        $push: {
          bids: { $each: [{ user: req.user, bid, premium}], $position: 0}
        }
      },
      { new: true }
    ).then(item => {
      res.json(item);
      io.emit('bid', item);
    })
    .catch(err => {
      res.json({err})
    })
  });

  app.get('/logout', function(req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage'), user: null, title: 'Login' });
  });

  app.post('/login', passport.authenticate('login', {
    successRedirect : '/home',
    failureRedirect : '/login',
    failureFlash : true
  }));

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage'), user: null, title: 'Sign up'  });
  });

  app.post('/signup', passport.authenticate('signup', {
    successRedirect : '/home',
    failureRedirect : '/signup',
    failureFlash : true
  }));
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
