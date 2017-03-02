//--------------------------------------------------
//VIEW
//--------------------------------------------------

var setHomePage = function() {
	var containerNode = document.querySelector('.content')
	var html = ''
		html += '<p>Welcome to our...website</p>'
		containerNode.innerHTML = html
}

var searchNode = document.querySelector('.search')

searchNode.addEventListener('keydown', function(eventObj) {
	if (eventObj.keyCode === 13) {
		var input = eventObj.target.value
		location.hash = "search/" + input
		eventObj.target.value = ''
	}
})

//--------------------------------------------------
//COLLECTION of MODELS
//--------------------------------------------------

var TimesCollection = Backbone.Collection.extend({
	url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
	// Parse takes in the API response and will return the array that we want
	parse: function(apiResponse) {
		return apiResponse.response.docs
	}

})

//--------------------------------------------------
//CONTROLLER
//--------------------------------------------------
var TimesRouter = Backbone.Router.extend({
	// takes key value of a route and then the value is equal to a method as a string
	// define route, define what it matches to
	routes: {
		"home": "showHomePage",
		"search/:query": "showSearchPage"
	},

	showHomePage: function() {
		setHomePage()
	},

	showSearchPage: function(query) {
		var collectionInstance = new TimesCollection()
		console.log(collectionInstance)
		var promise = collectionInstance.fetch({
			data: {
				q: query,
				'api-key': 'fa162f9ec488494abf21f3f3b2225849'
			}
		})
		promise.then(function() {
			console.log(collectionInstance)
			var htmlStr = ''
			var docsArray = collectionInstance.models
			for (var i = 0; i < docsArray.length; i++) {
				var docModel = docsArray[i]
				htmlStr += '<h3>' + docModel.get('snippet') + '</h3>'
			}
			document.querySelector('.content').innerHTML = htmlStr
		})
	}
})

var instance = new TimesRouter()

Backbone.history.start()














