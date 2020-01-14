var main_map = L.map('main_map').setView([-16.970303, 32.079454], 2);

//load a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA'
}).addTo(main_map);

//style of map point symbols
var pointMarkerOptions = {
    radius: 5,
    fillColor: "#FF2D00",
    color: "#FF2D00",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
};

//get json from file
var points = $.getJSON("https://raw.githubusercontent.com/hamishgibbs/Interactive_Dashboard_Public_Data/master/Centre_Points.geojson")

$.when(points).done(function(){
	var points_json = points.responseJSON

	all_markers = [];

	//load json point data into the map
	var mapped_points = L.geoJson(points_json, {
		//style point data using pointMarkerOptions
		pointToLayer: function(feature, latlng) {
			var marker = L.circleMarker(latlng, pointMarkerOptions);
			
			marker.on('mouseover', function(e){
				this.openPopup();
			});

			marker.on('mouseout', function(e){
  				marker.closePopup();
			});

			marker.on('click', onMarkerClick)

			all_markers.push(marker)
			return marker;
		}
	}).addTo(main_map);

	// make this happen on hover
	for (var i in mapped_points._layers){
		mapped_points._layers[i].bindPopup(mapped_points._layers[i].feature.properties.SHORT_N);
	}

	/*
	for (marker in all_markers){
		marker.on('mouseover', function(e){
				this.openPopup();
		});
	}
	*/
	//click and show/hide info panel

});


function onMarkerClick(e){

	try { $( "#info_text" ).remove() }
	catch(err) { }
	//create panel with all info here

	//get project data from event data
	var project_title = e.target.feature.properties.SHORT_N
	var project_overall_pi = e.target.feature.properties.OVERALL
	var project_author = e.target.feature.properties.TEG_INV
	var project_blurb = e.target.feature.properties.PROJECT_N
	var project_start_date = e.target.feature.properties.START_D
	var project_end_date = e.target.feature.properties.END_DAT
	var project_funder = e.target.feature.properties.PROJECT_F

	var info_elements = [project_title, project_overall_pi, project_author, project_blurb, project_start_date, project_end_date, project_funder]

	//format data into html (omit missing items)
	var project_title_HTML = "<div><h2>" + project_title + "</h2></div>"
	var project_overall_pi_HTML = "<div><h4>" + project_overall_pi + "</h4></div>"
	var project_author_HTML = "<div><h4>" + project_author + "</h4></div>"
	var project_blurb_HTML = "<div><p>" + project_blurb + "</p></div>"
	
	//handle this datetime format to make more natural
	var project_start_date_HTML = "<div><p>" + project_start_date + "</p></div>"
	var project_end_date_HTML = "<div><p>" + project_end_date + "</p></div>"
	var project_funder_HTML = "<div><p>" + project_funder + "</p></div>"

	var html_elements = [project_title_HTML, project_overall_pi_HTML, project_author_HTML, project_blurb_HTML, project_start_date_HTML, project_end_date_HTML, project_funder_HTML]

	var null_elements = [];

	for (var i in info_elements){
		if (info_elements[i] == null){
			null_elements.push(parseInt(i))
		}
	}

	for (var i = null_elements.length -1; i >= 0; i--) {
                html_elements.splice(null_elements[i], 1); 
	}

	info_panel_text = html_elements.join("")

	//create a new control with project data
	L.Control.textbox = L.Control.extend({
		onAdd: function(map) {
			var text = L.DomUtil.create('div', 'textbox-interior');
			text.style.backgroundColor='white';
			text.style.padding= '10px';
			text.style.height = '500px';
			text.style.width = '100px';
			text.id = "info_text";
			//add text to textbox
			text.innerHTML = info_panel_text;
			return text; 
		},

		onRemove: function(map) {

		}
	});

	L.control.textbox = function(opts) {return new L.Control.textbox(opts);}

	var info_pane = L.control.textbox({ position: 'topright' }).addTo(main_map)

	function MapClick(e) {
		info_pane.remove()
	}

	main_map.on('click', MapClick);
	
}

//change popup styling, map marker styling, panel styling & width

//add everything to a single HTML document
