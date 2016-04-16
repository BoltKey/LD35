function Grid(m, n, walls) {
	this.m = m;
	this.n = n;
	this.walls = walls;
	this.x = 20;
	this.y = 20;
	this.tilew = Math.min(400 / m, 400 / n);
	
	this.spotFree = function(x, y) {
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
		for (var w in this.walls) {
			var wall = this.walls[w];
			if (wall[0] === x && wall[1] === y)
				return false;
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