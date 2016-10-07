### Image Search Abstraction Layer
* In this application, the user can get the image URL, thumbnail URL, alt text and page url for a set of images relating to a given search string.
   
* The can paginate through the responses by adding a ?offset parameter to the URL.

* The can get a list of the ten most recently submitted search strings.

### Examples
To search for an item (soccer for example), add '/search/soccer' after this page's URL:

`https://imagesearch-api.herokuapp.com/search/soccer`

For pagination, the user can set an offset in the results. An offset of 6 will display results starting from result 6 (will skip first 5). Add '?offset=6' at the end of the URL:

`https://imagesearch-api.herokuapp.com/search/soccer?offset=6`

To view a list of the ten most recent search entries, add '/history' at the end of this page's URL:

`https://imagesearch-api.herokuapp.com/history`