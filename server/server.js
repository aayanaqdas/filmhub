require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
};

const apiKey = process.env.TMDB_API_KEY;

app.use(cors(corsOptions));


app.listen(8080, () => {
  console.log("Server started on port 8080");
});
