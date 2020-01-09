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

	console.log(data)

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
});



//now move on to saving synthetic zimbabwe data in the proper geojson format

//then how to plot data reliably (scatter plot, bar chart etc)

//then how to change the plot for every visible (or selected) feature

//then how to change map from plot
