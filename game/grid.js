function Grid(m, n, walls, b) {
	if (b) {
		for (var box in b) {
			var bo = b[box];
			var newBox = new Box(bo);
			newBox.color = boxColors[box];
			boxes.push(newBox);
		}
	}
	this.m = n;  // don't ask...
	this.n = m;
	this.walls = walls;
	this.x = gridOffset[0] + startOffset;
	this.y = gridOffset[1];
	this.tilew = Math.floor(Math.min(250 / m, 250 / n));
	this.assignColors = function() {
		for (var b = 0; b < boxes.length; ++b) {
			var box = boxes[b];
			box.color = boxColors[b % boxColors.length];
		}
	}
	this.spotFree = function(x, y, extra, checkBoxes) {
		if (typeof(checkBoxes) === 'undefined' || checkBoxes) {
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
		
		
		//start of dispenser
		var dispCover = "#666666";
		ctx.fillStyle = dispCover;
		ctx.beginPath();
		var x = gridOffset[0] + startOffset - 80;
		var y = gridOffset[1] + 20;
		ctx.moveTo(x, y);
		ctx.lineTo(x, y - 25);
		ctx.lineTo(x + 20, y - 65);
		ctx.lineTo(x + 20, y - 40);
		ctx.fill();
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + 20, y - 40);
		ctx.lineTo(x + 20, y + 250);
		ctx.lineTo(x, y + 290);
		ctx.fill();
		
		//draw chocolate box here
		
		var boxRgb = [0, 100, 200];
		ctx.fillStyle = "rgb(" + boxRgb[0] + ", " + boxRgb[1] + ", " + boxRgb[2] + ")";
		ctx.fillRect(this.x - 20, this.y - 20, this.m * this.tilew + 40, this.n * this.tilew + 40);
		ctx.fillStyle = "rgb(" + boxRgb[0] * 0.8 + ", " + boxRgb[1] * 0.8 + ", " + boxRgb[2] * 0.8 + ")";
		ctx.beginPath();
		ctx.lineTo(this.x - 20, this.y + this.n * this.tilew + 20);
		
		ctx.lineTo(this.x - 20, this.y - 20);
		ctx.lineTo(this.x - 40, this.y + 20);
		ctx.lineTo(this.x - 40, this.y + this.n * this.tilew + 60);
		
		
		ctx.lineTo(this.x + this.m * this.tilew, this.y + this.n * this.tilew + 60);
		
		ctx.lineTo(this.x + this.m * this.tilew + 20, this.y + this.n * this.tilew + 20);
		ctx.lineTo(this.x - 20, this.y + this.n * this.tilew + 20);
		ctx.fill();
		
		
		ctx.fillStyle = "#dddddd";
		for (var col = 0; col < m; ++col) {
			for (var row = 0; row < n; ++row) {
				ctx.fillRect(Math.floor(this.x + this.tilew * row), Math.floor(this.y + this.tilew * col), this.tilew - 2, this.tilew - 2);
			}
		}
		ctx.fillStyle = "rgb(" + boxRgb[0] + ", " + boxRgb[1] + ", " + boxRgb[2] + ")";
		for (var w in this.walls) {
			var wall = this.walls[w];
			ctx.fillRect(this.x + wall[0] * this.tilew, this.y + wall[1] * this.tilew, this.tilew - 2, this.tilew - 2);
		}
		
		
		// cover of dispenser
		ctx.fillStyle = dispCover;
		x += 20;
		y -= 65;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + 10, y - 20);
		ctx.lineTo(x + 340, y - 20);
		ctx.lineTo(x + 340, y + 310);
		ctx.lineTo(x + 310, y + 375);
		ctx.lineTo(x - 20, y + 375);
		ctx.lineTo(x - 20, y + 355);
		ctx.lineTo(x, y + 315);
		ctx.fill();
		
	}
}