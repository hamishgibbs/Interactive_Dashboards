//initialize the map
var main_map = L.map('main_map').setView([-19.196521, 29.925063], 7);

//load a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA'
}).addTo(main_map);

//define function to update chart data
/*function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
*/


var pointMarkerOptions = {
    radius: 2,
    fillColor: "#000000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

//get json from file
var points = $.getJSON("Z_Points.geojson")

//when data is loaded
$.when(points).done(function(){
	
	//define variable containing json point data
	var points_json = points.responseJSON
	console.log(points_json)
	//load json point data into the map
	var mapped_points = L.geoJson(points_json, {
		//style point data using pointMarkerOptions
		pointToLayer: function(feature, latlng) {
			return L.circleMarker(latlng, pointMarkerOptions);
		}
	}).addTo(main_map);

	//add the chart with all point data plotted
	//load chartCanvas variable from the .html docuent
	var ctx = chartCanvas.getContext('2d');
	
	var init_data = points_json.features.map(function(e) {
		return {x: e.properties.CASES, y: e.properties.DEATHS}
	});

	var scatterChartData = {
		datasets: [{
			label: 'Scatter Plot Data',
			data: init_data
		}]
	};

	//options for styling the chart
	var chartOptions = {
		scales: {
	        xAxes: [{
	            scaleLabel: {
	              	display: true,
   	              	labelString: 'Infection Rate'
	      		}
	      	}],
		    yAxes: [{
		    	scaleLabel: {
         		display: true,
	            labelString: 'Cases'
        		}
	      }]
	  },
	  onHover: handleChartHover
	}
	
	var config = {
	   type: 'scatter',
	   data: scatterChartData,
	   options: chartOptions
	};

//create the new chart
	var scatter_plot = new Chart(ctx, config);

	//define the number of ms to wait before executing code - this is not working currently (may be slowing things down)
	var delayInMilliseconds = 100;

	//when the main map is zoomed or moved
	main_map.on('zoom move', function() {

		//this is changing every little move of the map 			
		var map_bounds = main_map.getBounds();
		console.log(map_bounds)
		
		//this timeout doesnt seem to be doing anything
		setTimeout(function() {

				//define varibales to hold the N, S, E, W extents of the map
				var map_bounds_north = map_bounds._northEast.lat
				var map_bounds_east = map_bounds._northEast.lng
				var map_bounds_south = map_bounds._southWest.lat
				var map_bounds_west = map_bounds._southWest.lng

				//filter chart data for only points within the map bounds
				var plot_data = [];

				//for every feature in the JSON point data
				for(var i in points_json.features) {
					//console.log(points_json.features[i].geometry.coordinates)
					//if latitude is less than map_bounds_north AND latitude is more
					// than map_bounds_south AND longitude is less than
					// map_bounds_east AND longitude is more than map_bounds_west (ie- it is within view):
					if ((points_json.features[i].geometry.coordinates[1] < map_bounds_north && points_json.features[i].geometry.coordinates[1] > map_bounds_south && points_json.features[i].geometry.coordinates[0] < map_bounds_east && points_json.features[i].geometry.coordinates[0] > map_bounds_west)) {
						plot_data.push({x: points_json.features[i].properties.CASES, y: points_json.features[i].properties.DEATHS})
						}
					}

				scatterChartData.datasets.forEach(function(dataset) {
					dataset.data = plot_data
				});
				scatter_plot.update({
					duration: 0
				});
				
				}, delayInMilliseconds);
			

	});

	function handleChartHover(e){
		var chartHoverData = scatter_plot.getElementsAtEvent(e)
		//console.log(chartHoverData[0]._view.x)
		if (chartHoverData.length != 0) {
			var hoveredXValue = chartHoverData[0]._view.x;
			var hoveredYVlaue = chartHoverData[0]._view.y;
			console.log(hoveredXValue)
			mapped_points.eachLayer(function (layer) {
				//console.log(layer.feature.properties.CASES)
				if (layer.feature.properties.CASES == hoveredXValue && layer.feature.properties.DEATHS == hoveredYVlaue) {
					console.log(layer.feature)
				}
			})

		};
		//console.log(chartHoverData.length)
		//var hoveredXValue = 
		//var hoveredYValue = 
		/*
		geoJsonLayer.eachLayer(function(layer) {
  			layer.bindPopup(layer.feature.properties.name);
		});
		*/
		//get the point in 

		//continue here to highlight any point hovered over in the plot
	}

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