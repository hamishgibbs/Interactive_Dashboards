var main_map = L.map('main_map').setView([-19.196521, 29.925063], 7);

  //load a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA'
}).addTo(main_map);

var pointMarkerOptions = {
    radius: 2,
    fillColor: "#000000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

//var markersLayer = L.LayerGroup();
//main_map.addLayer(markersLayer);

//get json from file
var points = $.getJSON("Z_Points.geojson")

//when data is loaded
$.when(points).done(function(){
	
	//defin variable containing json point data
	var points_json = points.responseJSON
	
	//load json point data into the map
	L.geoJson(points_json, {
		pointToLayer: function(feature, latlng) {
			return L.circleMarker(latlng, pointMarkerOptions);
		}
	}).addTo(main_map);

	//console.log(points_json)
	var delayInMilliseconds = 100;

	main_map.on('zoom move', function() {
			//this is changing every little move of the map 
			console.log('zoomed moved') 			
			var map_bounds = main_map.getBounds();
			
			//this timeout doesnt seem to be doing anything
			setTimeout(function() {
					//console.log(map_bounds._southWest);
					//console.log(map_bounds._northEast);
					var map_bounds_north = map_bounds._northEast.lat
					var map_bounds_east = map_bounds._northEast.lng
					var map_bounds_south = map_bounds._southWest.lat
					var map_bounds_west = map_bounds._southWest.lng
					//console.log(map_bounds_north, map_bounds_east, map_bounds_south, map_bounds_west)
					//TRY FILTERING THE DATA TO BE WITHIN MAP BOUND

					var plot_data = [];

					for(var i in points_json.features) {
						//console.log(points_json.features[i].geometry.coordinates)
						//if latitude is less than map_bounds_north AND more
						// than map_bounds_south AND longitude is less than
						// map_bounds_east AND more than map_bounds_west (ie- it is within view):
						//check this to make sure proper points are included
						if ((points_json.features[i].geometry.coordinates[1] < map_bounds_north && points_json.features[i].geometry.coordinates[1] > map_bounds_south && points_json.features[i].geometry.coordinates[0] < map_bounds_east && points_json.features[i].geometry.coordinates[0] > map_bounds_west)) {
							//console.log(points_json.features[i]);
							plot_data.push({x: points_json.features[i].properties.CASES, y: points_json.features[i].properties.DEATHS})
							}
						}
					console.log(plot_data)

					var ctx = chartCanvas.getContext('2d');
					var config = {
					   type: 'scatter',
					   data: {
					      //labels: labels,
					      datasets: [{
					         label: 'Disease Mortality',
					         data: plot_data,
					         backgroundColor: 'rgba(0, 119, 204, 0.3)'
					      }]
					   }
					};
					var chart = new Chart(ctx, config);

					}, delayInMilliseconds);


		});

})

//add in a 1000 ms delay to prevent updating the chart too much


/*
//try adding rodent point data
//this file was imported into QGIS - retry method in R GEOJSON MUST BE IN THE CORRECT FORMAT FOR IMPORT
var points = $.getJSON("Z_Points.geojson",function(data){
  // add GeoJSON layer to the map once the file is loaded
  L.geoJson(data, {
  	pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, pointMarkerOptions);
    }
  }).addTo(main_map);
});

//when point data has been loaded
$.when(points).done(function(){

	//get data for labels - navigate json points (response object), responseJSON (json object), features (array)
	//for every feature in features - return the proprties.X (data dalue for eahc feature) 
	//var labels = points.responseJSON.features.map(function(e) {
	//   return e.properties.pwd_district;
	//});
	//repeat for data - how to make this a 2d array?

	var data = points.responseJSON.features.map(function(e) {
		return {x: e.properties.CASES, y: e.properties.DEATHS}
	});;

	//console.log(data)

	var ctx = chartCanvas.getContext('2d');
	var config = {
	   type: 'scatter',
	   data: {
	      //labels: labels,
	      datasets: [{
	         label: 'Graph Line',
	         data: data,
	         backgroundColor: 'rgba(0, 119, 204, 0.3)'
	      }]
	   }
	};

	//update the chartCanvas variable in the .html document with the data
	var chart = new Chart(ctx, config);

	//console.log(contained)



});



//now move on to saving synthetic zimbabwe data in the proper geojson format

//then how to plot data reliably (scatter plot, bar chart etc)

//then how to change the plot for every visible (or selected) feature

//then how to change map from plot
*/