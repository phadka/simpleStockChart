const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

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
  let currentTime = Math.floor(new Date().getTime() / 1000);
  let pastTime = currentTime - 30758400;
  let url = 'https://finnhub.io/api/v1/stock/candle?symbol=' + req.body.symbol + '&resolution=D&from=' + pastTime + '&to=' + currentTime + '&token=';
  console.log(url);
  let request = https.request(url, function(response) {
    let data = "";
    response.on('data', function(d) {
      data = data + d;
    });
    response.on('end', function() {
      let finalData = JSON.parse(data);
      let currentPrice = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(finalData.c[finalData.c.length - 1]);
      let msg = "Current price for " + req.body.symbol + " is " + currentPrice + ".";
      let stockLabels = [];
      for (let i = 0; i < finalData.c.length; i++) {
        stockLabels.push(i + "");
      }
      res.render("price", {text: msg, stockLabels: stockLabels, stockData: [finalData.c]});
    });
  });
  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
});
