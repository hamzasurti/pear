const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const app = express();
const config = require("./config");
app.use(express.static(path.join(__dirname, "build")));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/search", cors(), (req, res) => {
  axios
    .get("https://api.yelp.com/v3/businesses/search", {
      params: req.query,
      headers: {
        Authorization: "Bearer " + config.bearerToken
      }
    })
    .then(response => {
      console.log("response", response.data);
      res.send(response.data);
    })
    .catch(function(error) {
      console.error(error);
    });
});

app.listen(process.env.PORT || 8080);
