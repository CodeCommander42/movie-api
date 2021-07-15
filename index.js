const express = require('express'),
  bodyParser = require('body-parser')
  
const app = express();

app.use(bodyParser.json());

let movieList = [
  {
    title: 'Lord of the Rings',
    release: 'December 9, 2001',
    director: 'Peter Jackson'
  },
  {
    title: 'Star Wars',
    release: 'May 25, 1977',
    director: 'George Lucas'
  },
  {
    title: 'The Matrix',
    release: 'March 31, 1999',
    director: 'The Wachowskis'
  }
];

app.get('/movies', (req, res) => {
  res.json(movieList);
});

app.get('/movies/by-title/:title', (req, res) => {
  res.send('details of this movie like genre and director based on the title!!!!!!!!!');
});

app.post('/user/registration/:register', (req,res) => {
  res.send('user has been successfuly registered');
});

app.put('/user/usernameChange/:usernameChange', (req, res) => {
  res.send('username has been successfuly changed');
});

app.put('user/addFavorite/:addFavorite', (req, res) => {
  res.send('your movie has been successfuly been added to your favorites');
});

app.put('user/removeFavorite/:removeFavorite', (req, res) => {
  res.send('the movie has been successfuly removed from your favorites');
});

app.delete('user/unregister/:unregister', (req, res) => {
  res.send('you have successfuly been unregistered');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});