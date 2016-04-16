function randomLevel(x, y) {
	var tilenum = x * y;
	var squares = [];
	var biggest = Math.floor(Math.sqrt(tilenum) * 0.5);
	var iters = 0;
	grid = new Grid(x, y, []);
	/*var*/ boxes = [];
	console.log("init");
	// define how many squares of which sizes will we have
	while(iters < 10000) {
		var add;
		if (Math.random() < 0.6 && Math.pow(biggest, 2) < tilenum) {
			squares.push(biggest);
			boxes.push(new Box(biggest));
			tilenum -= Math.pow(biggest, 2);
			add = -5;
		}
		else {
			--biggest;
		}
		if (tilenum + add < Math.pow(biggest, 2)) {
			--biggest;
		}
		if (biggest < 2) {
			break;
		}
		++iters;
	}
	
	// try again on extreme cases
	if (squares.length > Math.max(x, y) * 0.9 || squares.length < tilenum * 0.04) {
		console.log("there are " + squares.length + " sqares. Resetting.")
		return randomLevel(x, y);
	}
	
	console.log(squares);
	
	// place squares randomly on the grid
	for (var i = 0; i < boxes.length; ++i) {
		var box = boxes[i];
		var where = Math.floor(Math.random() * (x - box.size) * (y - box.size));
		var iters = 0;
		while (!boxes[i].drop(where % (x - box.size), Math.floor(where / (x - box.size)))) {
			++iters;
			++where;
			where = Math.min(where, (x - box.size) * (y - box.size));
			if (iters < (x - box.size) * (y - box.size)) {
				console.log("Nowhere to put square, resetting.");
				return randomLevel(x, y);
			}
		}
	}
	console.log("finished putting squares");
	// add crazy shapes to free spaces
	for (var i = 0; i < 30; ++i) {
		var areas = freeAreas();
		for (var a in areas) {
			var ar = areas[a];
			var k = 3;//Math.floor(Math.sqrt(tilenum) * 0.7);
			for (var size = Math.floor(Math.pow(Math.min(x, y), 0.65)); size > 2; --size) {
				if (Math.pow(size, 2) < ar.length) {
					size -= 1;
					console.log(size, ar.length);
					tile = ar[Math.floor(Math.random() * ar.length)];
					var cbox = new Box(createCrazyBox(size, tile[0], tile[1]));
					
					
					if (cbox.drop(minx, miny)) { // those variables are global. Fuck me for this hack.
						boxes.push(cbox);
					}
					break;
				}
			}
		}
	}
	
	// if we end up with too few boxes
	if (boxes.length < 3) {
		console.log("There are less than 3 squares. Resetting.");
		return randomLevel(x, y);
	}
	// fill remaining space with walls
	areas = freeAreas();
	allFrees = [];
	var freeSpots = 0;
	for (var i in areas) {
		freeSpots += areas[i].length;
		allFrees = allFrees.concat(areas[i]);
	}
	var walls = [];
	for (var i in allFrees) {
		walls.push(allFrees[i]);
	}
	grid.walls = walls;
	grid.assignColors();
	
	// finishing touches
	for (var box in boxes) {
		var b = boxes[box];
		b.jumpBack();
		if (!b.crazy) {
			b.shift();
		}
		
	}
	grid.assignColors();
	return strCurrLvl();
}

function freeAreas() {
	var x = grid.m;
	var y = grid.n;
	var freeAreas = [];
	for (var i = 0; i < x; ++i) {
		for (var j = 0; j < y; ++j) {
			var arr = []; // here it creates an array of all already known free areas
			for (var a in freeAreas) {
				arr = arr.concat(freeAreas[a]);
			}
			if (grid.spotFree(i, j, arr)) {
				var freeArea = [];
				var stack = [[i, j]];
				var iters = 0;
				while (iters < 1000 && stack.length > 0) {
					var arr = freeArea; // here it creates an array of all already known free areas
					for (var a in freeAreas) {
						arr = arr.concat(freeAreas[a]);
					}
					var curr = stack.pop();
					if (grid.spotFree(curr[0], curr[1], arr))
						freeArea.push(curr);
					if (grid.spotFree(curr[0] + 1, curr[1], arr)) {  
						stack.push([curr[0] + 1, curr[1]]);
					}
					if (grid.spotFree(curr[0] - 1, curr[1], arr)) {  
						stack.push([curr[0] - 1, curr[1]]);
					}
					if (grid.spotFree(curr[0], curr[1] + 1, arr)) {  
						stack.push([curr[0], curr[1] + 1]);
					}
					if (grid.spotFree(curr[0], curr[1] - 1, arr)) {  
						stack.push([curr[0], curr[1] - 1]);
					}
					++iters;
				}
				freeAreas.push(freeArea);
			}
		}
	}
	return freeAreas;
}

function createCrazyBox(size, x, y) {
	var tiles;
	if (typeof(x) !== 'undefined') {
		tiles = [[x, y]];
		onmap = true;
	}
	else {
		tiles = [[Math.floor(Math.random() * grid.m), Math.floor(Math.random() * grid.n)]];
		onmap = false;
	}
	while (tiles.length < Math.pow(size, 2)) {
		var curr = tiles[Math.floor(Math.random() * tiles.length)];
		var start = Math.floor(Math.random() * 4);
		var direct = (start + 1) % 4;
		
		while (direct !== start) {
			var nextTile = [curr[0] + dir(direct)[0], curr[1] + dir(direct)[1]];
			//if (onmap) {
				if (grid.spotFree(nextTile[0], nextTile[1], tiles, onmap)) {
					tiles.push(nextTile);
					break;
				}
				else {
					direct = (direct + 1) % 4;
				}
			//}
			/*else {
				var free = true;
				for (var t in tiles) {
					var tile = tiles[t];
					if (tile[0] === nextTile[0] && tile[1] === nextTile[1]) {
						free = false;
					}
				}
				if (free) {
					tiles.push(nextTile);
					break;
				}
				else {
					direct = (direct + 1) % 4;
				}
			}*/
		}
	}
	var minx = 100;
	var miny = 100;
	for (var i in tiles) {
		if (tiles[i][0] < minx)
			minx = tiles[i][0]
		if (tiles[i][1] < miny) 
			miny = tiles[i][1];
	}
	// I am very ashamed for this horrible hack. It works.
	window.minx = minx;  
	window.miny = miny;
	for (var i in tiles) {
		tiles[i][0] -= minx;
		tiles[i][1] -= miny;
	}
	return tiles;
}

function dir(num) {
	switch(num) {
		case 0: return [0, 1]; break;
		case 1: return [1, 0]; break;
		case 2: return [0, -1]; break;
		case 3: return [-1, 0]; break;
	}
}



function strCurrLvl() {
	var newboxes = [];
	for (var b in boxes) {
		newboxes.push(boxes[b].crazyShape);
	}
	return JSON.stringify({x: grid.m, y: grid.n, boxes: newboxes, walls: grid.walls})
}