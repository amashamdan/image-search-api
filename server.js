var express = require("express");
var request = require("request");
var app = express();

var url = "https://www.googleapis.com/customsearch/v1?q=soccer&cx=003304933768532957899:opx7yx62ybk&key=AIzaSyDWuYmVM6ZgUWtdg_rIJC1pDcEx4Uldlrg"

app.get("/", function(req, res) {
	request(url, function(err, response, body) {
		console.log(typeof(body), typeof(response));
		res.send(JSON.parse(body));
		res.end();
	});
});

// port 3000 used for localhost during development.
var port = Number(process.env.PORT || 3000)
app.listen(port);