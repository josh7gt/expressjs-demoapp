import express from "express";

const app = express();
const PORT = process.env.PORT || 2999;

app.get("/", (req, res) => {
  res.status(201).send({msg: "Hello"});
});

app.get("/api/users", (req, res) => {
  res.send([
  { id: 1, username: "John", display: "John Doe" },
  { id: 2, username: "Jane", display: "Jane Doe"},
  { id: 3, username: "Jill", display: "Jill Doe"}
  ]);
});



app.get('/api/products', (req, res) => {
  res.send([
    { id: 11, name: 'Apple', price: 1.99 },
    { id: 12, name: 'Orange', price: 2.99 },
    { id: 13, name: 'Banana', price: 0.99 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});

