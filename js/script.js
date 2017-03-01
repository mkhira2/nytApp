r,//--------------------------------------------------
//VIEW
//--------------------------------------------------

var setHomePage = function() {
	var containerNode = document.querySelector('.container')
	var html = ''
		html += '<p>Welcome to our...website</p>'
		containerNode.innerHTML = html
}

var setSearchPage = function() {
	
}

var searchNode = document.querySelector('.search')

searchNode.addEventListener('keydown', function(eventObj) {
	if (eventObj.keyCode === 13) {
		var input = eventObj.target.value
		location.hash = "search/" + input
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
		console.log('heres your' + query)
	}
})

var instance = new TimesRouter()

Backbone.history.start()














