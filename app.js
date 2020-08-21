const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
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

app.post("/back", function(req, res) {
  res.redirect("/");
});

app.post("/", function(req, res) {
  var request = https.request('https://finnhub.io/api/v1/quote?symbol=' + req.body.symbol + '&token=bspqddnrh5rf33i22k4g', function(response) {
    response.on('data', function(d) {
      var data = JSON.parse(d);
      fs.readFile(__dirname + "/price.html", function(err, file) {
        res.write(file);
        var msg = "Price for " + req.body.symbol + " is " + data.c + "$.";
        res.write('<script type="text/javascript">$("#text").html("' + msg + '");</script>');
        res.send();
      });
    });
  });
  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
});
