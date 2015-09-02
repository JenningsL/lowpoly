var Delaunay = require('./libs/delaunay.js');
var Sobel = require('./libs/sobel.js');

onmessage = function(event) {
	var imgData = event.data.imgData,
		w = event.data.w,
		h = event.data.h,
		factor = event.data.factor,
		emphasisEdge = event.data.emphasisEdge;
	var edgePoints = [];
	var newImgData = Sobel(imgData,function(value,x,y){
	  if(value > 40) {
	    edgePoints.push([x,y]);
	  }
	});
	var need = Math.round(edgePoints.length * emphasisEdge / factor),
	    selected = [];
	for (var i = need; i >= 1; i--) {
	  var randomIndex = Math.round(Math.random() * edgePoints.length);
	  selected.push(edgePoints.splice(randomIndex,1)[0]);
	};
	var randomPoint = Math.round(need / 2);
	for (var i = randomPoint; i >= 0; i--) {
	  selected.push([Math.random()*w,Math.random()*h]);
	};
	selected.push([0,0],[w,0],[w,h],[0,h]); //four corner


	//使用delaunay三角化获取三角坐标
	var triangles = Delaunay.triangulate(selected);

	postMessage({
		'triangles':triangles,
		'selected':selected
	});
}
