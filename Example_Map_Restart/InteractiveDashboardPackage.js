/*function addTwo(number){
	return number + 2
}

function getClosestValueInArray(goal, array) {
	var closest = array.reduce(function(prev, curr) {
  	return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
	});
	return closest;
}
*/


function highlightPointOnHover(e){
	var chartHoverData = scatter_plot.getElementsAtEvent(e)

	//return x value of the hovered feature
	var hoverFeatureIds = chartHoverData.map(function (datum) {
  		return scatter_plot.data.datasets[0].data[datum._index].id;
	});
	console.log(hoverFeatureIds)
	//console.log(points_json)

	//continue here to highlight any point hovered over in the plot
}

//function addChartData