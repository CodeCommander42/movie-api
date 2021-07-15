const express = require('express'),
  morgan = require('morgan');
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

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!!!');
});

app.get('/movies', (req, res) => {
  res.json(topBooks);
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});

//exercise 4