var grid;
var boxes = [];
var mouseDown = 0;
var lastmd = 0;
var divPos;
var lasDivPos;
var selected;
var timer = 0;
var graphics = {choc: []};
var currlvl = 0;
var victoryTime = 0;
var slideTime = 100;
var startOffset = 500;
var frameOff = startOffset / slideTime;
var gridOffset = [200, 200];


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
	
	document.body.onkeydown = function() {
		if (selected) {
			selected.shift();
		}
	}
	// graphics
	for (var i = 0; i < 7; ++i) {
		graphics["choc"][i] = new Image();
		graphics["choc"][i].src = "graphics/choc" + i + ".png";
	}
	
	grid = new Grid(10, 10, []);
	lastGrid = grid;
	lastGrid.x = -10000;
	lastboxes = [];
	goToLev(0);
	mainloop();
}

function goToLev(num) {
	boxes = [];
	var l = levels[num];
	grid = new Grid(l.x, l.y, l.walls, l.boxes);
	victoryTime = timer;
	currlvl = num;
}
function mainloop() {
	++timer;
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
	
	lastGrid.draw();
	lastGrid.x -= frameOff;
	
	grid.draw();
	if (timer - victoryTime < slideTime) 
		grid.x -= frameOff;

	for (var i in lastboxes) {
		lastboxes[i].draw(true);
		lastboxes[i].x -= frameOff;
	}
	for (var i in boxes) {
		boxes[i].draw();
	}
	
	if (currlvl === 0) {
		ctx.font = "32px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("Try and fit all the chocolate into the box", 20, 40);
	}
	if (currlvl === 1) {
		ctx.font = "32px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("Press any key when dragging a block to change its shape.", 20, 40);
		ctx.fillText("Each block has two configuratoins. Square and the other one.", 20, 70);
	}
	
}

function victory() {
	console.log("win");
	
	lastGrid = grid;
	lastboxes = boxes;
	goToLev(currlvl + 1);
}