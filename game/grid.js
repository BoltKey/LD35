function Grid(m, n, walls, b) {
	if (b) {
		for (var box in b) {
			var bo = b[box];
			var newBox = new Box(bo);
			newBox.color = boxColors[box];
			boxes.push(newBox);
		}
	}
	this.m = m;
	this.n = n;
	this.walls = walls;
	this.x = 20;
	this.y = 20;
	this.tilew = Math.min(300 / m, 300 / n);
	
	this.spotFree = function(x, y, extra) {
		
		for (var b in boxes) {
			var box = boxes[b];
			if (box.locked) {
				for (var t in box.shape) {
					var tile = box.shape[t];
					if (tile[0] + box.gridx === x && tile[1] + box.gridy === y) {
						return false;
					}
				}
			}
		}
		var checks = []
		if (extra) 
			checks = this.walls.concat(extra);
		else
			checks = this.walls;
		for (var w in checks) {
			var wall = checks[w];
			if (wall[0] === x && wall[1] === y)
				return false;
		}
		return (x >= 0 && x < this.m && y >= 0 && y < this.n);
	}
	this.solved = function() {
		for (var b in boxes) {
			if (!boxes[b].locked) {
				return false;
			}
		}
		return true;
	}
	this.draw = function() {
		ctx.fillStyle = "#dddddd";
		for (var col = 0; col < m; ++col) {
			for (var row = 0; row < n; ++row) {
				ctx.fillRect(this.x + this.tilew * row, this.y + this.tilew * col, this.tilew - 2, this.tilew - 2);
			}
		}
		ctx.fillStyle = "black";
		for (var w in this.walls) {
			var wall = this.walls[w];
			ctx.fillRect(this.x + wall[0] * grid.tilew, this.y + wall[1] * grid.tilew, grid.tilew - 2, grid.tilew - 2);
		}
	}
}