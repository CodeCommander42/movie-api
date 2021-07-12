const express = require('express');
const app = express();

let topBooks = [
  {
    title: 'Harry Potter',
    author: 'J.K. Rowling'
  },
  {
    title: 'Lord of the Rings',
    author: 'J.R.R Tolkien'
  },
  {
    title: 'Twilight',
    author: 'Stephanie Meyer'
  },
]

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!!!');
});

app.get('/movies', (req, res) => {
  res.json(topBooks);
});

app.use(express.static('public'));

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});