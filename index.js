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
    title: 'Star wars',
    release: 'May 25, 1977',
    director: 'George Lucas'
  },
  {
    title: 'The Matrix',
    release: 'March 31, 1999',
    director: 'The Wachowskis'
  }
];

app.get('/movies/:details', (req, res) => {
  res.send('details of this movie based on the title');
});

app.get('/movies', (req, res) => {
  res.json(movieList);
});

app.get('/movies/:details/:genre', (req, res) => {
  res.send('what genre the movie is');
});

app.get('movies/:details/:director', (req, res) => {
  res.send('details of the director of the movie');
});

app.post('/user/:registration', (req,res) => {
  res.send('user has been successfuly registered');
});

app.put('/user/:usernameChange', (req, res) => {
  res.send('username has been successfuly changed');
});

app.put('user/:addFavorite', (req, res) => {
  res.send('your movie has been successfuly been added to your favorites');
});

app.put('user/:removeFavorite', (req, res) => {
  res.send('the movie has been successfuly removed from your favorites');
});

app.delete('user/:unregister', (req, res) => {
  res.send('you have successfuly been unregistered');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});