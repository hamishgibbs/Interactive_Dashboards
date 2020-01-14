//initialize main map, set center and zoom
var main_map = L.map('main_map').setView([-16.970303, 32.079454], 2);

//load a tile layer from mapbox api - when map in production, make sure API calls are not maxed out, this is a personal key
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA'
}).addTo(main_map);

//style of map point symbols
var pointMarkerOptions = {
    radius: 5,
    fillColor: "#9700A4",
    color: "#9700A4",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
};

//get json from file hosted on GitHub
var points = $.getJSON("https://raw.githubusercontent.com/hamishgibbs/Interactive_Dashboard_Public_Data/master/Centre_Points.geojson")

//when point data has loaded
$.when(points).done(function(){

	//extract json data from jquery response object (for clarity)
	var points_json = points.responseJSON

	//add json point data to the map
	var mapped_points = L.geoJson(points_json, {
		
		//style point data using pointMarkerOptions
		pointToLayer: function(feature, latlng) {
			var marker = L.circleMarker(latlng, pointMarkerOptions);
			
			//open popup when hovering over marker
			marker.on('mouseover', function(e){
				this.openPopup();
			});

			//close popup when no longer hovering over marker
			marker.on('mouseout', function(e){
  				marker.closePopup();
			});

			//when marker is clicked, call onMarkerClick function
			marker.on('click', onMarkerClick)

			return marker;
		}
	}).addTo(main_map);

	//Attach popup with project short name to each marker 
	for (var i in mapped_points._layers){
		mapped_points._layers[i].bindPopup(mapped_points._layers[i].feature.properties.SHORT_N);
		mapped_points._layers[i]._popup.options.closeButton = false;
	}

});

//define a function to handle map marker clicks
function onMarkerClick(e){

	//try to close info panel (if one is already displayed)
	try { $( "#info_text" ).remove() }
	catch(err) { }

	//get project data from event target data
	//future: handle column names for legibility
	var project_title = e.target.feature.properties.SHORT_N
	var project_overall_pi = e.target.feature.properties.OVERALL
	var project_author = e.target.feature.properties.TEG_INV
	var project_blurb = e.target.feature.properties.PROJECT_N
	var project_start_date = e.target.feature.properties.START_D
	var project_end_date = e.target.feature.properties.END_DAT
	var project_funder = e.target.feature.properties.PROJECT_F
	var project_website = e.target.feature.properties.PROJECT_W

	//store all project data in an array
	var info_elements = [project_title, project_overall_pi, project_author, project_blurb, project_start_date, project_end_date, project_funder, project_website]

	//format project data as html elements
	var project_title_HTML = '<h2 style="text-align: center;">' + project_title + "</h2>"
	var project_overall_pi_HTML = "<h4>" + project_overall_pi + "</h4>"
	var project_author_HTML = "<h4>" + project_author + "</h4>"
	var project_blurb_HTML = "<p>" + project_blurb + "</p>"

	//handle this datetime format to make more natural?
	var project_start_date_HTML = "<p>Start Date: " + project_start_date + "</p>"
	var project_end_date_HTML = "<p>End Date: " + project_end_date + "</p>"
	var project_funder_HTML = "<p>Funded by: " + project_funder + "</p>"
	var project_website_HTML = '<a href="' + project_website + '" target="_blank">Project Website</a>'

	//store all html elements in an array
	var html_elements = [project_title_HTML, project_overall_pi_HTML, project_author_HTML, project_blurb_HTML, project_start_date_HTML, project_end_date_HTML, project_funder_HTML, project_website_HTML]

	//identify elements with no data
	var null_elements = [];

	for (var i in info_elements){
		if (info_elements[i] == null){
			null_elements.push(parseInt(i))
		}
	}

	//remove elements in html_elements using null_elements as index
	for (var i = null_elements.length -1; i >= 0; i--) {
        html_elements.splice(null_elements[i], 1); 
	}

	//concatenate html_elements
	info_panel_text = html_elements.join("")

	//wrap HTML formatted elements in a div container
	info_panel_text = "<div>" + info_panel_text + "</div>"

	//create a new info panel
	L.Control.textbox = L.Control.extend({
		
		onAdd: function(map) {

			var text = L.DomUtil.create('div', 'textbox-interior');

			//define info panel properties
			text.style.opacity = '1';
			text.style.borderRadius = '10px';
			text.style.backgroundColor = "rgba(255,255,255,0.75)";
			text.style.padding= '10px';
			text.style.height = 'auto';
			text.style.width = '150px';

			//define html id
			text.id = "info_text"

			//add formatted html data to info panel
			text.innerHTML = info_panel_text;

			return text; 
		},

		//do nothing on remove
		onRemove: function(map) { }
	});

	L.control.textbox = function(opts) {return new L.Control.textbox(opts);}

	//add the new info panel to the map
	var info_pane = L.control.textbox({ position: 'topright' }).addTo(main_map)

	//remove the info panel when the user clicks anywhere on the map
	function MapClick(e) {
		info_pane.remove()
	}

	main_map.on('click', MapClick);
	
}

//add everything to a single HTML document

//add notes to CSS, JS, AND HTML

//next:
//write a direct workflow from excel file to github upload
//or from ODK to csv to github upload to read - careful of header names
