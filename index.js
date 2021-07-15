const express = require('express'),
  bodyParser = require('body-parser'),
  
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
]


app.get('/movies', (req, res) => {
  res.json(movieList);
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});