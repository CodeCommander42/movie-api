const express = require('express'),
  bodyParser = require('body-parser')

  const cors = require('cors');
app.use(cors());
  
const passport = require('passport');
require('./passport');

const mongoose = require('mongoose');
const Models = require('./models.js');


const Movies = Models.Movie;
const User = Models.User;
  
const app = express();

const { check, validationResult } = require('express-validator');

app.use(bodyParser.json());
let auth = require('./auth')(app);


/*-local/mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });*/
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req,res) => {
  res.send('Welcome to my flix!')
})

app.get('/movies',/* passport.authenticate('jwt', { session: false }),*/ (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
});

app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({title: req.params.title})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
});

app.get('/user/list', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.find()
  .then((users) => 
  {
    res.status(200).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  })
})

app.post('/user/registration',[check('username', 'username is required').isLength({min:5}),
check('username','username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('password', 'password is required').not().isEmpty(),
check('email','email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array() });
  }

  let hashedPassword = User.hashPassword(req.body.password);
  User.findOne({username: req.body.username})
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.username + ' already exists')
    }
    else {
      User.create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        bithday: req.body.birthday
    })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      })
    }
  })
});

app.put('/user/usernameChange/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndUpdate(
    {username: req.params.username},
    {$set: {
      username: req.body.username
    }
  },
    {new: true},
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } 
      else {
        res.json(updatedUser);
      }
    }
  )
});

app.put('/user/:username/addFavorite/:addFavorite', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndUpdate(
    {username: req.params.username},
    {$push: {favoriteMovies: req.params.addFavorite}},
    {new: true},
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      }
      else {
        res.json(updatedUser);
      }
    }
  )
});

app.put('/user/:username/removeFavorite/:removeFavorite', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndUpdate(
    {username: req.params.username},
    {$pull: {favoriteMovies: req.params.removeFavorite}},
    {new: true},
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(400).send(req.params.removeFavorite + ' was not found');
      }
      else {
        res.json(updatedUser);
      }
    }
  )
});

app.delete('/user/unregister/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndRemove({username: req.params.username})
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.username + ' was not found');
    }
    else {
      res.status(200).send(req.params.username + ' was deleted');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

