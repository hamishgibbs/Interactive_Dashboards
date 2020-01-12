function addTwo(number){
	return number + 2
}

function getClosestValueInArray(goal, array) {
	var closest = array.reduce(function(prev, curr) {
  	return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
	});
	return closest;
}