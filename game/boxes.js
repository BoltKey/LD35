var boxColors = ["#FBFF8A", "#FFC338", "#FFA578", "#DBAE97", "#E6F27C"]

function Box(shape) {
	if (typeof(shape) === 'number') {
		this.shape = [];
		this.size = shape;
		for (var i = 0; i < shape; ++i) {
			for (var j = 0; j < shape; ++j) {
				this.shape.push([i, j]);
			}
		}
		this.crazyShape = createCrazyBox(shape);
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
	this.draw = function() {
		ctx.fillStyle = this.color;
		for (var i in this.shape) {
			var s = this.shape[i];
			
			ctx.fillRect(this.x + s[0] * grid.tilew, this.y + s[1] * grid.tilew, grid.tilew - 2, grid.tilew - 2);
			var w = grid.tilew * (3 / 4);
			var chocT;
			if (this.crazy)
				chocT = this.crazyChocs[i];
			else
				chocT = this.chocType;
			ctx.drawImage(graphics.choc[chocT], this.x + s[0] * grid.tilew + grid.tilew / 8, this.y + s[1] * grid.tilew + grid.tilew / 8, w, w);
		}
	}
	
	this.jumpBack = function() {
		if (Math.random() < 0.5) {
			this.x = 30 + Math.floor(Math.random() * 300);
			this.y = 320 + Math.floor(Math.random() * 50);
		}
		else {
			this.y = 30 + Math.floor(Math.random() * 300);
			this.x = 320 + Math.floor(Math.random() * 50);
		}
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
		return true;
	}
	
	this.jumpBack();
}