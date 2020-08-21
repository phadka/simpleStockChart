const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  console.log(req.body.symbol);
  var request = https.request('https://finnhub.io/api/v1/quote?symbol=' + req.body.symbol + '&token=bspqddnrh5rf33i22k4g', function(response) {
    response.on('data', function(d) {
      var data = JSON.parse(d);
      res.send("Price for " + req.body.symbol + " is: " + data.c + "$.");
    });
  });
  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
});