//saving html as variables

var beerData = JSON.parse(document.getElementById("beerData").textContent);
//this is a reference to the html file: 
   // <script type="text/json" id="beerData">
   //      {
   //          "beers": [
   //              {"name": "Bitter Hop", "type": "ipa", "locale": "domestic", "abv": 7.9},
   //              {"name": "Dragonblood Black IPA", "type": "ipa", "locale": "domestic", "abv": 6.5},
   //              {"name": "Good Dog Lager", "type": "lager", "locale": "domestic", "abv": 4.8},
   //              {"name": "Good Dog Snowpants", "type": "stout", "locale": "domestic", "abv": 8.1},
   //              {"name": "Lake Erie 2x IPA", "type": "ipa", "locale": "domestic", "abv": 9.3},
   //              {"name": "Lake Erie Session", "type": "ale", "locale": "domestic", "abv": 4.2},
   //              {"name": "Samwell British Pale Ale", "type": "ale", "locale": "import", "abv": 6.5},
   //              {"name": "Samwell Oatmeal Stout", "type": "stout", "locale": "import", "abv": 5.5},
   //              {"name": "Samwell Winter Ale", "type": "ale", "locale": "import", "abv": 6.8},
   //              {"name": "Sparkwood Beer Five", "type": "lager", "locale": "domestic", "abv": 6.2},
   //              {"name": "Sparkwood Campfire Lager", "type": "lager", "locale": "domestic", "abv": 5.8},
   //              {"name": "Tartan Scottish Ale", "type": "ale", "locale": "import", "abv": 7.5} 
   // ]
var allBeers = beerData.beers;
var beerTemplate = document.getElementById("tmpl-beer").textContent;
//this is a reference to the html file: 
// <script type="text/template" id="tmpl-beer">
//         <% _.forEach(beers, function (beer) { %>
//         <li><%= beer.name %> <small>(<%= beer.abv %>%)</small></li>
//         <% }); %>
//         </script>

var beerList = document.getElementById("beerList");
//this is a reference to the html file: <ul id="beerList"></ul>

var averageAbv = document.getElementById("averageAbv");

var filters = document.getElementById("filters");
//this is a reference to the html file: <div id="filters">
            // <a href="#" class="btn btn-default btn-active" data-filter="all">All</a>
            // <a href="#" class="btn btn-default" data-filter="domestic">Domestic</a>
            // <a href="#" class="btn btn-default" data-filter="imports">Imports</a>
            // <a href="#" class="btn btn-default" data-filter="ale">Ales</a>
            // <a href="#" class="btn btn-default" data-filter="lager">Lagers</a>
            // <a href="#" class="btn btn-default" data-filter="stout">Stouts</a>

var filterLinks = filters.querySelectorAll("a");
// .querySelectorAll Returns a list of the elements within the document (using depth-first pre-order 
//traversal of the document's nodes) that match the specified group of selectors. 

//filterLinks selector all the <a> , specifically
         // <div id="filters">
         //    <a href="#" class="btn btn-default btn-active" data-filter="all">All</a> 
         //    <a href="#" class="btn btn-default" data-filter="domestic">Domestic</a>
         //    <a href="#" class="btn btn-default" data-filter="imports">Imports</a>
         //    <a href="#" class="btn btn-default" data-filter="ale">Ales</a>
         //    <a href="#" class="btn btn-default" data-filter="lager">Lagers</a>
         //    <a href="#" class="btn btn-default" data-filter="stout">Stouts</a>

function loadBeers(beers){
  //innerHTML property changes the html content of the beerList element 
  beerList.innerHTML = _.template(beerTemplate)({beers: beers});
  averageAbv.innerHTML = 'Average Abv: ' + getAverageAbv(beers);
}

function setActiveFilter(active){
    //add active class to the currently selected filter 
    //removes active class from all other filterLinks
  for (i=0; i<filterLinks.length; i++) {
    filterLinks[i].classList.remove('btn-active');
  }

  active.classList.add('btn-active');
}

  function filter(collection, callback){
    var filtered =[];
    for (i=0; i<collection.length; i++) {
        if (callback(collection[i])){
          filtered.push(collection[i]);
        }
    }
    return filtered;
  }

  
  //in this way, we can take the case filterBeers('type', ['ipa', 'ale']);
  // since the second arg for filterBeers is an Array, we would run the internal for loop
  // item = beers [i]; property = type; value = ipa, ale
  //so the for loop checks if the beer type is either ipa or ale. 

  //COMPAREVALUES NOT NEEDED AFTER FILTER BEERS WAS REWRITTEN 
  // function compareValues(item, property, value) {
  //   if (!Array.isArray(value)) {
  //     return item[property] === value;
  //   }
  //   for (var i=0; i<value.length; i++){
  //     if(item[property] === value[i]){
  //       return true;
  //     }
  //   }
  //   return false; 
  // }

  //this function now checks to see if the property inputted === value eg. 'locale' === 'domestic'
  //and can do what compareValues function does, if the value inputted isn't an array 
  function makeFilter(collection, property){
    return function(value) {
      return filter(collection, function (item) {
        return item[property] === value;
        //does the specific item i.e. beer group has a property with the value that we are filtering for?
        //how do we know what is item? because when we look at the filter declaration function,
        // we note that the callback function is given collection[i], which we hereafter 
        //called item.
      });
    }
  }

  function map (collection, callback) {
    var mapped =[];
    for (i=0; i<collection.length; i++) {
      mapped.push(callback(collection[i]));
    }
    return mapped;
  }

  function reduce (collection, callback, initial) {
    var last = initial;
    for (i=0; i<collection.length; i++) {
      last = callback(last, collection[i]);
    }
    return last;
  }

  function add(a, b) {
    return a + b;
  }

  function getAverageAbv(beers) {
    var abvs = map(beers, function (beer) {
      return beer.abv;
    });

    var total = reduce (abvs, add, 0);

    return Math.round((total/ beers.length) * 10)/ 10;
  }

  var filterbyLocale = makeFilter(allBeers, 'locale');
  var filterbyType = makeFilter(allBeers, 'type');


loadBeers(allBeers);


//event listeners for any of the filter buttons (domestic, imports, ale, etc)
filters.addEventListener('click', function (e) {
  e.preventDefault();
  var clicked = e.target;
  //.target is A reference to the object that dispatched the event.
  var filter = clicked.dataset.filter;
  // The HTMLElement.dataset read-only property allows access, both in reading and writing mode, 
  //to all the custom data attributes (data-*) set on the element. It is a map of DOMString, one entry for each custom data attribute.

  //Global attributes are attributes common to all HTML elements;
  //they can be used on all elements, though the attributes may have no effect on some elements.

  //custom data attributes allow proprietary information to be exchanged between the HTML and 
  //its DOM representation that may be used by scripts. All such custom data are available via the 
  //HTMLElement interface of the element the attribute is set on. The HTMLElement.dataset property gives access to them.

  var filteredBeers = [];
  var i;

  setActiveFilter(clicked);

  switch (filter) {
    case 'all':
      filteredBeers = allBeers;
      break;
    case 'domestic':
      filteredBeers = filterbyLocale('domestic');
      break;
    case 'imports':
      filteredBeers = filterbyLocale ('import');
      break;
    case 'ale':
      filteredBeers = filter(allBeers, function(beer){
        return beer.type === 'ale' || beer.type === 'ipa';
      });
      break;
    case 'lager':
      filteredBeers = filterbyType('lager');
      break;
    case 'stout':
      filteredBeers = filterbyType('stout');
      break;
  }
  
  loadBeers(filteredBeers);
});


//1. condensed the case loops (if the beers)
