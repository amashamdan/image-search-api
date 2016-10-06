var express = require("express");
var request = require("request");
var app = express();

app.get("/", function(req, res) {
	res.send("Enter search query in the address bar.");
});

app.get("/search/:url", function(req, res) {
	var searchUrl = "https://www.googleapis.com/customsearch/v1?q=" + req.params.url + "&cx=003304933768532957899:opx7yx62ybk&key=AIzaSyDWuYmVM6ZgUWtdg_rIJC1pDcEx4Uldlrg"
	request(searchUrl, function(err, response, body) {
		var responseBody = JSON.parse(body);
		var returnedBody = [];
		createResponse(res, responseBody, returnedBody);
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

// port 3000 used for localhost during development.
var port = Number(process.env.PORT || 3000)
app.listen(port);

/* add index.html for root
add time of search */