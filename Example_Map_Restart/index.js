//rework a number of items in this project to functions 
//allow for lots of mapping operations to be completed from the package
//this will require reworking of the workflow of making a map
//do this carefully

//also focus on css - stored in another file

//initialize the map
var main_map = L.map('main_map').setView([-19.196521, 29.925063], 7);

//load a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA'
}).addTo(main_map);

//style of standard point symbols
var pointMarkerOptions = {
    radius: 3,
    fillColor: "#000000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

//style of highlighted point symbols
var highlightedMarkerOptions = {
    radius: 6,
    fillColor: "#FF2D00",
    color: "#FF2D00",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

//style of muted point symbols
var mutedMarkerOptions = {
    radius: 3,
    fillColor: "#000000",
    color: "#000",
    weight: 1,
    opacity: 0.2,
    fillOpacity: 0.2
};

//get json from file
var points = $.getJSON("Z_Points.geojson")

//when data is loaded
$.when(points).done(function(){
	
	//define variable containing json point data
	var points_json = points.responseJSON

	all_markers = [];

	//load json point data into the map
	var mapped_points = L.geoJson(points_json, {
		//style point data using pointMarkerOptions
		pointToLayer: function(feature, latlng) {
			var marker = L.circleMarker(latlng, pointMarkerOptions);
			all_markers.push(marker)
			return marker;
		}
	}).addTo(main_map);

	//add the chart with all point data plotted
	//load chartCanvas variable from the .html docuent
	var ctx = chartCanvas.getContext('2d');
	
	var init_data = points_json.features.map(function(e) {
		return {x: e.properties.CASES, y: e.properties.DEATHS, id: e.properties.id}
	});

	var scatterChartData = {
		datasets: [{
			label: 'Disease Mortality',
			data: init_data
		}]
	};

	//options for styling the chart
	var chartOptions = {
		scales: {
	        xAxes: [{
	            scaleLabel: {
	              	display: true,
   	              	labelString: 'Cases'
	      		}
	      	}],
		    yAxes: [{
		    	scaleLabel: {
         		display: true,
	            labelString: 'Deaths'
        		}
	      }]
	  },
	  onHover: highlightPointOnHover
	}

	function highlightPointOnHover(e){
		var chartHoverData = scatter_plot.getElementsAtEvent(e)

		//return id value of the hovered feature
		var hoverFeatureIds = chartHoverData.map(function (datum) {
	  		return scatter_plot.data.datasets[0].data[datum._index].id;
		});
		
		if (hoverFeatureIds.length != 0){
			for (var i in mapped_points._layers){
				if(mapped_points._layers[i].feature.properties.id == hoverFeatureIds){
					//style leaflet marker (opacity 0, )
					mapped_points._layers[i].setStyle(highlightedMarkerOptions);
				}else{
					mapped_points._layers[i].setStyle(mutedMarkerOptions);
					//make marker opaque
				}
			}
		}else{
			for (var i in mapped_points._layers){
				mapped_points._layers[i].setStyle(pointMarkerOptions);
			}
		}	

		//reset style of all points
	}
	
	var config = {
	   type: 'scatter',
	   data: scatterChartData,
	   options: chartOptions
	};

//create the new chart
	var scatter_plot = new Chart(ctx, config);

	//define the number of ms to wait before executing code - this is not working currently (may be slowing things down)

	//when the main map is zoomed or moved
	main_map.on('zoom move', function() {

		//this is changing every little move of the map 			
		var map_bounds = main_map.getBounds();
		
		//define variables to hold the N, S, E, W extents of the map
		var map_bounds_north = map_bounds._northEast.lat
		var map_bounds_east = map_bounds._northEast.lng
		var map_bounds_south = map_bounds._southWest.lat
		var map_bounds_west = map_bounds._southWest.lng

		//filter chart data for only points within the map bounds
		var plot_data = [];

		//for every feature in the JSON point data
		for(var i in points_json.features) {

			//if latitude is less than map_bounds_north AND latitude is more
			// than map_bounds_south AND longitude is less than
			// map_bounds_east AND longitude is more than map_bounds_west (ie- it is within view):
			if ((points_json.features[i].geometry.coordinates[1] < map_bounds_north && points_json.features[i].geometry.coordinates[1] > map_bounds_south && points_json.features[i].geometry.coordinates[0] < map_bounds_east && points_json.features[i].geometry.coordinates[0] > map_bounds_west)) {
				plot_data.push({x: points_json.features[i].properties.CASES, y: points_json.features[i].properties.DEATHS, id: points_json.features[i].properties.id})
				}
			}

		scatterChartData.datasets.forEach(function(dataset) {
			dataset.data = plot_data
		});

		scatter_plot.update({
			//prevent animations on update
			duration: 0
		});
		
	});
	
	//highlightPointOnHover(main_map.on('zoom move'))


})

//feature ideas:

//on click - zoom t 1km x 1km of point feature
//area selection
//hide chart
//different chart types
//main map on left, multiple charts right in bar, with area selector - adjust data of all charts 

//overall goal:
//simplify each operation into a function
//make it easy to do many standard interactive dashboard tasks:
//i.e. HilightOnHover(map, chart)

//read about double execution https://blog.rodneyrehm.de/archives/20-Preventing-Duplicate-Execution.html