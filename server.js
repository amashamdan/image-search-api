var express = require("express");
var request = require("request");
var mongodb = require("mongodb");
var app = express();

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.SEARCH_HISTORY;

app.get("/", function(req, res) {
	res.send("Enter search query in the address bar.");
});

app.get("/search/:url", function(req, res) {
	if (req.query.offset) {
		var offset = req.query.offset;
	} else {
		var offset = 1;
	}
	var searchUrl = "https://www.googleapis.com/customsearch/v1?q=" + req.params.url + "&cx=003304933768532957899:opx7yx62ybk&start=" + offset + "&key=AIzaSyDWuYmVM6ZgUWtdg_rIJC1pDcEx4Uldlrg"
	request(searchUrl, function(err, response, body) {
		var responseBody = JSON.parse(body);
		var returnedBody = [];
		var date = new Date();
		createResponse(res, responseBody, returnedBody);
		saveToMongo(req.params.url, date.toString());
	});
})

function createResponse(res, responseBody, returnedBody) {
	for (var item in responseBody.items) {
		var resObject = {};
		if (responseBody.items[item].pagemap.cse_image) {
			resObject.imageurl = responseBody.items[item].pagemap.cse_image[0].src;
		} else {
			resObject.imageurl = "Cannot be read";
		}
		if (responseBody.items[item].pagemap.cse_thumbnail) {
			resObject.thumbnail = responseBody.items[item].pagemap.cse_thumbnail[0].src;
		} else {
			resObject.thumbnail = "Cannot be read";
		}
		resObject.pageUrl = responseBody.items[item].link;
		resObject.snippet = responseBody.items[item].title;
		returnedBody.push(resObject);
	}
	res.send(returnedBody);
	//res.send(responseBody);
	res.end();
}

function saveToMongo(itemSearched, date) {
	MongoClient.connect(mongoUrl, function(err, db) {
		if (err) {
			console.log("Error connecting to database: " + err);
		} else {
			console.log("connection established");
			var searchedItems = db.collection("searched_items");
			searchedItems.insert({
				"item searched": itemSearched,
				"time searched": date
			});
		}
	});
}

// port 3000 used for localhost during development.
var port = Number(process.env.PORT || 3000)
app.listen(port);

/* add index.html for root
add time of search */

