//initialize the map
var main_map = L.map('main_map').setView([-19.196521, 29.925063], 7);

//load a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA'
}).addTo(main_map);

var pointMarkerOptions = {
    radius: 3,
    fillColor: "#000000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

var pointMarkerOptionsHighINFECTION_RATE = {
    radius: 3,
    fillColor: "#FF0000",
    color: "#FF0000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.3
}

var pointMarkerOptionsLowINFECTION_RATE = {
	radius: 3,
    fillColor: "#003AFF",
    color: "#003AFF",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.3
}

var points = $.getJSON("Z_Points.geojson")

$.when(points).done(function(){
	var points_json = points.responseJSON;

	//add points to map
	all_markers = [];

	var mapped_points = L.geoJson(points_json, {
		pointToLayer: function(feature, latlng) {
			var marker = L.circleMarker(latlng, pointMarkerOptions);
			all_markers.push(marker);
			return marker;
		}
	}).addTo(main_map);
	
	//style points based on attribute values
	for (var i in mapped_points._layers){
		if(mapped_points._layers[i].feature.properties.INFECTI >= 0){
			mapped_points._layers[i].setStyle(pointMarkerOptionsHighINFECTION_RATE);
			mapped_points._layers[i].setStyle({radius: (mapped_points._layers[i].feature.properties.CASES_C * 1.5)});
		}else{
			mapped_points._layers[i].setStyle(pointMarkerOptionsLowINFECTION_RATE);
			mapped_points._layers[i].setStyle({radius: (mapped_points._layers[i].feature.properties.CASES_C * 1.5)});
		}
	}

	//initilize scatter plot
	var scatterCtx = scatterChartCanvas.getContext('2d');
	
	var scatterPlotInitData = points_json.features.map(function(e) {
		return {x: e.properties.CASES, y: e.properties.DEATHS, id: e.properties.id}
	});

	var scatterPlotChartData = {
		datasets: [{
			label: 'Disease Mortality',
			data: scatterPlotInitData
		}]
	};

	//options for styling the chart
	var scatterPlotChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
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
	  }//,
	  //onHover: highlightPointOnHover,
	  //onClick: zoomToClickedPoint
	};

	var scatterPlotConfig = {
	   type: 'scatter',
	   data: scatterPlotChartData,
	   options: scatterPlotChartOptions
	};

	//create the new chart
	var scatterPlot = new Chart(scatterCtx, scatterPlotConfig);

});