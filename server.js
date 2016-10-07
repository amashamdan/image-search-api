/* load needed packages/ */
var express = require("express");
var request = require("request");
var mongodb = require("mongodb");
var app = express();

var MongoClient = mongodb.MongoClient;
/* The url to connect to the database is saved in environment variables. */
var mongoUrl = process.env.SEARCH_HISTORY;
/* This is the response array which the user will receive. */
var returnedBody;
/* get request on root folder. */
app.get("/", function(req, res) {
	/* index.html is sent as repsonse. */
	res.sendFile(__dirname + "/index.html");
});
/* get request to search for an item */
app.get("/search/:url", function(req, res) {
	/* checl if the user entered an offset query */
	if (req.query.offset) {
		/* if yes, it is saved in offset variable. */
		var offset = req.query.offset;
	} else {
		/* else, offset is defaulted to 1, which means no results will be skipped. */
		var offset = 1;
	}
	/* This is the url used for Google's custom search engine. it uses the user-entered url and offset. */
	var searchUrl = "https://www.googleapis.com/customsearch/v1?q=" + req.params.url + "&cx=003304933768532957899:opx7yx62ybk&start=" + offset + "&key=AIzaSyDWuYmVM6ZgUWtdg_rIJC1pDcEx4Uldlrg"
	/* request module used to send a get request to the search engine. */
	request(searchUrl, function(err, response, body) {
		/* The response is parsed and saved in responseBody. */
		var responseBody = JSON.parse(body);
		/* returnedBody (which the user will receive) is reset. */
		returnedBody = [];
		/* The date the search is done is saved. */
		var date = new Date();
		/* createResponse function is called to prepare the response for the user. */
		createResponse(res, responseBody, returnedBody);
		/* connectToMongo function is called to save data in mongo. Nore that date is converted to a string since it is originally an object. */
		connectToMongo("save", res, req.params.url, date.toString());
	});
});
/* get request to display most recent searches. */
app.get("/history", function(req, res) {
	/* returnedBody is reset. */
	returnedBody = [];
	/* connectToMongo function is called to load data. */
	connectToMongo("load", res);
});
/* createResponse function. It exctracts the information from the search engine response and sends it to the user. */
function createResponse(res, responseBody) {
	/* For every item in the reponse: */
	for (var item in responseBody.items) {
		/* Each search result is stored in resObject. */
		var resObject = {};
		/* In case a result doesn't have an image, a message is saved instead of the link. */
		if (responseBody.items[item].pagemap.cse_image) {
			resObject.imageurl = responseBody.items[item].pagemap.cse_image[0].src;
		} else {
			resObject.imageurl = "Cannot be read";
		}
		/* Same is done for the thumbnail image. */
		if (responseBody.items[item].pagemap.cse_thumbnail) {
			resObject.thumbnail = responseBody.items[item].pagemap.cse_thumbnail[0].src;
		} else {
			resObject.thumbnail = "Cannot be read";
		}
		/* The page URL and snippet are saved. */
		resObject.pageUrl = responseBody.items[item].link;
		/* The property title can be changed to snippet, but title is shorter. */
		resObject.snippet = responseBody.items[item].title;
		/* The resObject (representing a result entry) is saved in returnedBody. */
		returnedBody.push(resObject);
	}
	/* returnedBody is sent as response for the client. */
	res.send(returnedBody);
	res.end();
}
/* connectToMongo function, it connects to the database and saves or loads search history information. */
function connectToMongo(status, res, itemSearched, date) {
	MongoClient.connect(mongoUrl, function(err, db) {
		/* This is an error in conneciton. */
		if (err) {
			console.log("Error connecting to database: " + err);
		} else {
			/* upon successfull connection, a message is logged. */
			console.log("connection established");
			/* Collection to save items is initialized. */
			var searchedItems = db.collection("searched_items");
			/* The status variable defines whether it is needed to save or load data, and that's checked by the if statement below. */
			if (status == "save") {
				/* In case of save, the item searched for and the time it was searched are added to the collection as a document. */
				searchedItems.insert({
					"item searched": itemSearched,
					"time searched": date
				});
			} else if (status == "load") {
				/* If it is needed to load data, The documents are loaded, _id is removed from display, then the items are sorted according to their id, and finally the first ten results are used. */
				searchedItems.find({}, {"_id": false}).sort({"_id": -1}).limit(10).toArray(function(err, result) {
					/* The result is sent to the client */
					res.send(result);
					res.end();
				})
			}
		}
	});
}

// port 3000 used for localhost during development.
var port = Number(process.env.PORT || 3000)
app.listen(port);
