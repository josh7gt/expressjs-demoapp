import express from "express";

const app = express();
const PORT = process.env.PORT || 2999;

app.get("/", (req, res) => {
  res.status(200).send({msg: "Hello"});
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});

