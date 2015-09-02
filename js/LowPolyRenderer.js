'use strict'
var Delaunay = require('./libs/delaunay.js');
var Sobel = require('./libs/sobel.js');
function LowPolyRenderer(canvas) {
  this.canvas = canvas;
  this.canvas.width = document.body.clientWidth;
  this.emphasisEdge = 1; //how important is the edge 0.5 - 1.5
  this.ctx = canvas.getContext("2d");
  this.img = null;
}
LowPolyRenderer.prototype.drawImg = function() {
  if(this.img == null) {
  	throw new Error("img is null");
  }
  this.ctx.drawImage(this.img,0,0,this.canvas.width,this.canvas.height);

}
LowPolyRenderer.prototype.setEmphasisEdge = function(value) {
  this.emphasisEdge = value;
}
LowPolyRenderer.prototype.setImg = function(newImg) {
	var scale = newImg.height / newImg.width;
	this.canvas.height = this.canvas.width * scale;
	this.img = newImg;
}
LowPolyRenderer.prototype.render = function(doneCallback) {
  var w = this.canvas.width,
      h = this.canvas.height,
      ctx = this.ctx,
      factor = (w + h) / 32; //how many times should be the kept edge point smaller than total edge points
  this.drawImg();
  var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  function drawTriangles(selected,triangles) {
  	for(var i=0;i < triangles.length; i+=3) {
  	    x1 = selected[triangles[i]][0];
  	    x2 = selected[triangles[i+1]][0];
  	    x3 = selected[triangles[i+2]][0];
  	    y1 = selected[triangles[i]][1];
  	    y2 = selected[triangles[i+1]][1];
  	    y3 = selected[triangles[i+2]][1];

  	    //获取三角形中心点坐标
  	    cx = ~~((x1 + x2 + x3) / 3);
  	    cy = ~~((y1 + y2 + y3) / 3);

  	    //获取中心点坐标的颜色值
  	    var index = (cy*imgData.width + cx)*4;
  	    var color_r = imgData.data[index];
  	    var color_g = imgData.data[index+1];
  	    var color_b = imgData.data[index+2];

  	    //绘制三角形
  	    ctx.save();
  	    ctx.beginPath();
  	    ctx.moveTo(x1, y1);
  	    ctx.lineTo(x2, y2);
  	    ctx.lineTo(x3, y3);
  	    ctx.closePath();
  	    ctx.fillStyle = "rgba("+color_r+","+color_g+","+color_b+",1)";
  	    ctx.fill();
  	    ctx.restore();
  	}	
  }
  if(typeof(Worker)!=="undefined") {
  	var worker = new Worker("/js/workerbundle.js"); 
  	worker.onmessage = function(event){
  		var triangles = event.data.triangles,
  			selected = event.data.selected;
  		drawTriangles(selected,triangles);
  		if(typeof doneCallback == 'function') {
  			doneCallback();
  		}
  	};
  	worker.postMessage({
  		'imgData': imgData,
  		'w': w,
  		'h': h,
      'factor': factor,
      'emphasisEdge': this.emphasisEdge
  	});
  }
  else
  {
  	var edgePoints = [];
  	var newImgData = Sobel(imgData,function(value,x,y){
  	  if(value > 40) {
  	    edgePoints.push([x,y]);
  	  }
  	});
  	var need = Math.round(edgePoints.length * this.emphasisEdge / factor),
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
  	var x1,x2,x3,y1,y2,y3,cx,cy;
  	drawTriangles(selected,triangles);
  	if(typeof doneCallback == 'function') {
  		doneCallback();
  	}
  }

}
module.exports = LowPolyRenderer;