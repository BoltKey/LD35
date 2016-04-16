var boxColors = ["#FBFF8A", "#FFC338", "#FFA578", "#DBAE97", "#E6F27C", "#BFFF59", "#EEFF8F"]

function Box(shape) {
	if (typeof(shape) === 'number') {
		this.shape = [];
		this.size = shape;
		for (var i = 0; i < shape; ++i) {
			for (var j = 0; j < shape; ++j) {
				this.shape.push([i, j]);
			}
		}
		/*this.crazyShape = createCrazyBox(shape);*/
		this.crazy = false;
	}
	else {
		this.crazyShape = JSON.parse(JSON.stringify(shape));
		this.shape = shape;
		this.size = Math.floor(Math.sqrt(this.shape.length));
		this.crazy = true;
	}
	
	
	this.crazyChocs = [];
	for (var i = 0; i < this.shape.length; ++i) {
		this.crazyChocs.push(Math.floor(Math.random() * graphics.choc.length));
	}
	this.locked = false;
	this.selected = false;
	this.chocType = Math.floor(Math.random() * graphics.choc.length);
	
	this.gridx = 0;
	this.gridy = 0;
	
	
	this.shift = function() {
		this.shape = [];
		if (!this.crazyShape) {
			this.crazyShape = createCrazyBox(this.size);
		}
		if (this.crazy) {
			for (var i = 0; i < this.size; ++i) {
				for (var j = 0; j < this.size; ++j) {
					this.shape.push([i, j]);
				}
			}
			this.crazy = false;
		}
		else {
			this.shape = JSON.parse(JSON.stringify(this.crazyShape));
			this.crazy = true;
		}
		if (this.locked) {
			this.drop();
		}
	}
	this.draw = function(last) {
		var offset = [0, 0];
		if (typeof(last) === 'undefined')
			last = false;
		var g;
		if (last && lastGrid)
			g = lastGrid;
		else
			g = grid;
		if (!last) {	
			var ratio = (10000 - Math.pow(Math.max(0, 100 + victoryTime - timer), 2)) / 10000 - 1;
			offset = [-(this.x - (gridOffset[0] + 600)) * ratio * 3, -(this.y - (gridOffset[1] + 100)) * ratio * 3]
		}
		for (var i in this.shape) {
			var s = this.shape[i];
			
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x + offset[0] + s[0] * g.tilew, this.y + offset[1] + s[1] * g.tilew, g.tilew - 2, g.tilew - 2);
			ctx.fillStyle = "black";
			ctx.globalAlpha = 0.5;
			
			ctx.fillRect(this.x + offset[0] + s[0] * g.tilew, this.y + offset[1] + s[1] * g.tilew, g.tilew - 2, g.tilew - 2);
			ctx.fillStyle = this.color;
			ctx.globalAlpha = 1;
			var border = Math.floor(g.tilew / 10);
			ctx.fillRect(this.x + offset[0] + s[0] * g.tilew + border, this.y + offset[1] + s[1] * g.tilew + border, g.tilew - 2 - 2*border, g.tilew - 2 - 2*border);
			var w = g.tilew * (3 / 4);
			var chocT;
			if (this.crazy)
				chocT = this.crazyChocs[i];
			else
				chocT = this.chocType;
			ctx.drawImage(graphics.choc[chocT], this.x + offset[0] + s[0] * g.tilew + g.tilew / 8, this.y + offset[1] + s[1] * g.tilew + g.tilew / 8, w, w);
		}
	}
	
	this.jumpBack = function() {
		if (Math.random() < 0.66) {
			this.x = gridOffset[0] + Math.floor(Math.random() * grid.m * grid.tilew);
			this.y = Math.random() < 0.5 ? gridOffset[1] + grid.n * grid.tilew + Math.floor(Math.random() * 50) : gridOffset[1] - 100 - Math.random() * 50;
		}
		else {
			this.y = gridOffset[1] + Math.floor(Math.random() * grid.n * grid.tilew);
			this.x = gridOffset[0] + grid.m * grid.tilew + Math.floor(Math.random() * 50);
		}
		this.locked = false;
	}
	
	this.drop = function(x, y) {
		this.locked = false;
		var gridx;
		var gridy;
		if (typeof(x) == 'undefined') 
			gridx = Math.round((this.x - grid.x) / grid.tilew);
		else 
			gridx = x;
		if (typeof(y) == 'undefined') 
			gridy = Math.round((this.y - grid.y) / grid.tilew);
		else
			gridy = y;
		for (var t in this.shape) {
			var tile = this.shape[t];
			if (gridx >= grid.m || gridy >= grid.n || gridx < 0 || gridy < 0) {
				return false;
			}
			if (!grid.spotFree(tile[0] + gridx, tile[1] + gridy)) {
				this.jumpBack();
				return false;
			}
		}
		
		this.gridx = gridx;
		this.gridy = gridy;
		this.x = grid.x + gridx * grid.tilew;
		this.y = grid.y + gridy * grid.tilew;
		this.locked = true;
		if (grid.solved()) {
			victory();
		}
		return true;
		
	}
	
	this.jumpBack();
}