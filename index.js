const express = require('express');
  bodyParser = require('body-parser');
  const passport = require('passport');
  const cors = require('cors');
  const mongoose = require('mongoose');
  const { check, validationResult } = require('express-validator');

const app = express();

app.use(cors());
app.use(bodyParser.json());

require('./passport');

let auth = require('./auth')(app);
  


// for local runs mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Models = require('./models.js');

const Movies = Models.Movie;
const User = Models.User;

app.get('/', (req,res) => {
  res.send('Welcome to my flix!')
})

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.get('/user/list', /* passport.authenticate('jwt', { session: false }),*/ (req, res) => {
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

app.get('/user/profile/:username', (req, res) => {
  User.findOne({username: req.params.username})
  .then((user) => {
    res.status(200).json(user);
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
        birthday: req.body.birthday
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

app.put('/user/userinfoChange/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndUpdate(
    {username: req.params.username},
    {$set: {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday
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

app.delete('/user/:username/removeFavorite/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOneAndUpdate(
    {username: req.params.username},
    {$pull: {favoriteMovies: req.params.movieId}},
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

