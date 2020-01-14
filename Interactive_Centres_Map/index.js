var main_map = L.map('main_map').setView([-19.196521, 29.925063], 7);

//load a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiaGdpYmJzIiwiYSI6ImNrNTNvOHViNzA1YWgzbnFrOTU0NTF5aHcifQ.EOtqyLac7FOrZ-Ae2f4_EA'
}).addTo(main_map);


//wrap in reactive context on marker click
//get these values from the geojson file
var project_title = "Big Project"
var project_blurb = "blurb"
var project_funder = "UN"

L.Control.textbox = L.Control.extend({
	onAdd: function(map) {
		var text = L.DomUtil.create('div', 'textbox-interior');
		text.style.backgroundColor='white';
		text.style.padding= '10px';
		text.style.height = '500px';
		text.style.width = '100px';
		text.id = "info_text";
		//add text to textbox
		text.innerHTML = "<strong>More Info</strong><div>" + project_title + "</div><div>" + project_blurb + "</div>";
		return text; 
	},

	onRemove: function(map) {

	}
});



L.control.textbox = function(opts) {return new L.Control.textbox(opts);}
var info_pane = L.control.textbox({ position: 'topright' }).addTo(main_map)

//remove panel after one second - remove when click is not on a point
console.log(info_pane)
setTimeout(function(){ info_pane.remove() }, 1000);

//make geojson point file R, QGIS, host on github - call here - update textbox on marker click if click not on point, close textbox 

//Update text in the textbox: Using jquery, $("#info_text")[0].innerHTML = 'new text' 

/*
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature, //you need to change this
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
*/