var grid;
var boxes = [];
var mouseDown = 0;
var lastmd = 0;
var divPos;
var lasDivPos;
var selected;
function main() {
	//mouse
	var offset = $("#game").offset();
	$(document).mousemove(function(e){
    divPos = {
        x: e.pageX - offset.top,
        y: e.pageY - offset.left
		}
	})
	lastDivPos = {x: 0, y: 0};
	lastmd = 0;
	mouseDown = 0;
	document.body.onmousedown = function() { 
		++mouseDown; 
		if (mouseDown === -1 || mouseDown === 2) mouseDown = 1; 
	}
	document.body.onmouseup = function() { 
		--mouseDown;
	}
	
	grid = new Grid(20, 20, [[0, 2],[2, 2],[2, 3]]);
	
	mainloop();
}

function mainloop() {
	if (mouseDown) {
		if (!lastmd)
			click();
		else 
			drag();
	}
	if (lastmd && !mouseDown) 
		drop();
	requestAnimationFrame(mainloop);
	
	lastmd = mouseDown;
	draw();
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	grid.draw();
	for (var i in boxes) {
		boxes[i].draw();
	}
}