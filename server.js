var express = require("express");
var request = require("request");
var app = express();

app.get("/", function(req, res) {
	res.send("Enter search query in the address bar.");
});

app.get("/search/:url", function(req, res) {
	console.log(req.params.url);
	var searchUrl = "https://www.googleapis.com/customsearch/v1?q=" + req.params.url + "&cx=003304933768532957899:opx7yx62ybk&key=AIzaSyDWuYmVM6ZgUWtdg_rIJC1pDcEx4Uldlrg"
	request(searchUrl, function(err, response, body) {
		console.log(typeof(body), typeof(response));
		res.send(JSON.parse(body));
		res.end();
	});
})

// port 3000 used for localhost during development.
var port = Number(process.env.PORT || 3000)
app.listen(port);

/* add index.html for root
add time of search */