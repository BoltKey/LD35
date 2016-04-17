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
var startOffset = 400;
var frameOff = startOffset / slideTime;
var gridOffset = [200, 200];
var wonLevels = [];
var sounds = {};
var music;
var randSel = 6;
var muted = false;
var mutedS = false;

function main() {	
	$(document).ondragstart = function() {};
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
	// keyboard
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
	
	// sounds
	music = new Audio("audio/ld35music.wav");
	music.play();
	music.loop = true;
	var strs = ["drop", "pick", "rotate", "win"];
	for (var i in strs) {
		sounds[strs[i]] = (new Audio("audio/" + strs[i] + ".wav"));
	}
	
	grid = new Grid(10, 10, []);
	lastGrid = grid;
	lastGrid.x = -10000;
	lastboxes = [];
	makeMenu();
	goToLev(0);
	mainloop();
}

function muteSounds() {
	
	for (var s in sounds) {
		sounds[s].volume = muted;
	}
	muted = !muted;
}
function muteMusic() {
	music.volume = mutedS;
	mutedS = !mutedS;
}

function goToLev(num) {
	sounds.win.play();
	
	if (typeof(num) !== 'undefined') {
		boxes = [];
		var l = levels[num];
		grid = new Grid(l.x, l.y, l.walls, l.boxes);
		currlvl = num;
	}
	else {
		currlvl = -1;
	}
	victoryTime = timer;
}
function buttonLev(num) {
	lastGrid = grid;
	lastboxes = boxes;
	goToLen(num);
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
	// conveyor belt
	
	var num = 8;
	var w = Math.floor(startOffset / num - 10);
	var y = 200;
	var h = 320;
	var off = (grid.x - gridOffset[0]) % (w + 10);
	for (var x = off - w; x < gridOffset[0] + startOffset; x += w + 10) {
		ctx.fillStyle = "#444444";
		ctx.fillRect(gridOffset[0] + startOffset - x - 50, y + 10, w, h);
	}
	for (var x = off - w; x < gridOffset[0] + startOffset; x += w + 10) {
		
		ctx.fillStyle = "#888888";
		ctx.fillRect(x, y, w, h);
		
	}
	
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
	ctx.font = "32px Arial";
	ctx.fillStyle = "black";
	if (currlvl === 0) {
		ctx.fillText("Try and fit all the chocolate into the box", 20, 40);
	}
	if (currlvl === 1) {
		ctx.fillText("Press any key when dragging a block to change its shape.", 20, 40);
		ctx.fillText("Each block has two configuratoins: square and the original one.", 20, 70);
	}
	if (currlvl === 2) {
		ctx.fillText("All the blocks always fill the box perfectly.", 20, 40);
	}
	if (currlvl === 3) {
		ctx.fillText("You can skip levels if you want. Just click the buttons.", 20, 40);
	}
	
}

function makeMenu() {
	var i;
	for (i = 0; i < levels.length; ++i) {
		var a = $("<button id='levelButton" + i + "' type='button' class='level-button button button-primary button-medium button-box' onclick='goToLev(" + i + ")'>" + i + "</button>")
		a.css("position", "fixed");
		a.css("left", 580 + 40 * (i % 7));
		a.css("top", 180 + 50 * Math.floor(i / 7));
		a.css("width", 30);
		a.css("padding", 2);
		$("body").append(a);
	}
	a = $("<input type='range' min=6 max=15 value=8 id='randomRange' oninput='changeRand(this.value)'></input>")
	a.css("position", "fixed");
	a.css("left", 600);
	a.css("top", 400);
	a.css("width", 200);
	$("body").append(a);
	a = $("<span>Random level generator<span>")
	a.css("position", "fixed");
	a.css("left", 600);
	a.css("top", 378);
	a.css("width", 200);
	$("body").append(a);
	a = $("<div id='randStatus'></div>")
	a.css("position", "fixed");
	a.css("left", 570);
	a.css("top", 430);
	a.css("width", 200);
	$("body").append(a);
	a = $("<button id='randGo' class='button button-primary button-medium button-box' onclick='goRand()'>Go!</button>");
	a.css("position", "fixed");
	a.css("left", 640);
	a.css("top", 430);
	a.css("width", 40);
	$("body").append(a);
	a = $("<button id='muteS' class='button button-primary button-medium button-box' onclick='muteSounds()'>Mute sounds</button>");
	a.css("position", "fixed");
	a.css("left", 580);
	a.css("top", 480);
	a.css("width", 120);
	$("body").append(a);
	a = $("<button id='muteM' class='button button-primary button-medium button-box' onclick='muteMusic()'>Mute music</button>");
	a.css("position", "fixed");
	a.css("left", 720);
	a.css("top", 480);
	a.css("width", 120);
	$("body").append(a);
}

function changeRand(val) {
	randSel = val;
	$("#randStatus").html(val + "x" + val);
}
function goRand() {
	$("#randStatus").html("Loading... ");
	window.setTimeout(function() {randomLevel(randSel, randSel)}, 0);
}
function victory() {
	$("#levelButton" + currlvl).removeClass("button-primary button-highlight");
	$("#levelButton" + currlvl).addClass("button-action");
	if (currlvl > -1) {
		if (wonLevels.indexOf(currlvl) === -1)
			wonLevels.push(currlvl);
		localStorage.setItem("wonLevels", JSON.stringify(wonLevels));
		if (typeof(kongregate) !== 'undefined')
			kongregate.stats.submit("levels", wonLevels.length);
	}
	console.log("win");
	if (currlvl === 23) {
		music.volume = 0;
	}
	
	
	lastGrid = grid;
	lastboxes = boxes;
	if (currlvl === -1) {
		goRand();
	}
	goToLev(currlvl + 1);
}