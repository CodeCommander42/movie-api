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

app.get('/movies', (req, res) => {
  res.json(topBooks);
})