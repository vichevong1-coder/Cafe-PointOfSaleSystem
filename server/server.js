const express = require('express');
const app = express();
const Port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});