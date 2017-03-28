//--------------------------------------------------
// MODELS
//--------------------------------------------------
var TimesCollection = Backbone.Collection.extend({

    url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
    parse: function(apiResponse) {
        //parse takes in the api response and will return the array that we want 
        console.log(apiResponse)
        return apiResponse.response.docs
    }
})

var TimesModel = Backbone.Model.extend({
    url: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
    parse: function(apiResponse) {
        return apiResponse.response.docs[0]
    }
})





//--------------------------------------------------
// VIEWS
//--------------------------------------------------
var setHomePage = function() {
    var containerNode = document.querySelector('.pageContent')
    var html = ''
    html += '<p>Newspaper</p>'
    containerNode.innerHTML = html
}
var DetailsView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.model, 'sync', this._render)
    },

    _render: function() {
        var containerNode = document.querySelector('.pageContent')
        var html = ''
        if (this.model.get('multimedia').length) {
            html += '<img class="fetchedArt" src="http://www.nytimes.com/' + this.model.get('multimedia')[0].url + '">'
        }
        else {
        	html+= 'No image available'
        }
        html += '<br />'
        if (this.model.get('section_name')) {
            html += '<div class="sectionName">' + 'From Section: ' + this.model.get('section_name') + '</div>'
        }
        else {
        	html += 'No section available'
        }
        html += '<div class="headline">' + this.model.get('headline')['main'] + '</div>'
        html += '<div class="leadParagraph">' + this.model.get('lead_paragraph') + '</div>'
        
        containerNode.innerHTML = html
    }
})

var ListView = Backbone.View.extend({
    initialize: function() {
        console.log('list view', this)
        document.querySelector('.pageContent').innerHTML = '<img src="default.gif">'
            //listenTo takes 3 inputs: 
            //(1) the object we are listening to
            //(2) the name of the event that the object will broadcast
            //(3) the function we should run upon hearing that event

        //(`this` is a reference to a view instance)
        this.listenTo(this.collection, 'sync', this._render)
    },
    _render: function() {
        var containerNode = document.querySelector('.pageContent')
        var html = ''
        this.collection.forEach(function(inputModel) {
                html += '<a href="#detail/' + inputModel.get('_id') + '">'
                html += '<div class="summary">'
                html += '<h3>' + inputModel.get('snippet') + '</h3>' //.get access the attributes of model
                html += '</div'
                html += '</a>'
            })
            //above is the same as below
            // var articlesArray = this.collection.models
            // console.log(articlesArray)
            // for (var index = 0; index < articlesArray.length; index = index + 1){
            // 	var model = articlesArray[index]
            // 	html += '<div class="summary">'
            // 		html += '<h3>' + model.get('snippet') + '</h3>'
            // 	html += '</div'
            // }
        containerNode.innerHTML = html
    }

})

var searchNode = document.querySelector('.search')
searchNode.addEventListener('keydown', function(eventObj) {
        if (eventObj.keyCode === 13) {
            var input = eventObj.target.value //take the input from the search bar
            location.hash = 'search/' + input //make that input become the url after the hashtag
            eventObj.target.value = ''
        }
    })


//--------------------------------------------------
// CONTROLLER
//--------------------------------------------------

var TimesRouter = Backbone.Router.extend({
    //takes key value of a route and then the value is equal to a method as a string
    //define route, define what it matches to

    routes: {
        "home": "showHomePage",
        "search/:query": "showSearches",
        "detail/:articleID": "showDetailPage"
    },
    showHomePage: function() {
        setHomePage()
    },
    showSearches: function(query) {
        var collectionInstance = new TimesCollection()
        collectionInstance.fetch({
            data: {
                q: query,
                'api-key': 'fa162f9ec488494abf21f3f3b2225849'
            }
        })

        var viewInstance = new ListView({
            collection: collectionInstance
        })

    },
    showDetailPage: function(articleID) {
        var modelInstance = new TimesModel() //new instance of model
        modelInstance.fetch({
            data: {
                'api-key': 'fa162f9ec488494abf21f3f3b2225849',
                'fq': '_id:' + articleID
            }
        })
        new DetailsView({
            model: modelInstance
        })
    }
})

var instance = new TimesRouter()
Backbone.history.start()
