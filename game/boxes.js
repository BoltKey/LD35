function Box(shape) {
	this.crazyShape = JSON.parse(JSON.stringify(shape));
	this.shape = shape;
	this.crazy = true;
	this.locked = false;
	this.selected = false;
	this.x = 30;
	this.y = 420;
	this.color = 'red';
	this.gridx = 0;
	this.gridy = 0;
	this.shift = function() {
		this.shape = [];
		if (this.crazy) {
			var max = Math.sqrt(this.crazyShape.length);
			for (var i = 0; i < max; ++i) {
				for (var j = 0; j < max; ++j) {
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
		for (var i in this.shape) {
			var s = this.shape[i];
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x + s[0] * grid.tilew, this.y + s[1] * grid.tilew, grid.tilew - 2, grid.tilew - 2);
		}
	}
	
	this.jumpBack = function() {
		console.log("jump");
		this.x = Math.floor(Math.random() * 500);
		this.y = 420;
	}
	
	this.drop = function() {
		this.locked = false;
		var gridx = Math.round((this.x - grid.x) / grid.tilew);
		var gridy = Math.round((this.y - grid.y) / grid.tilew);
		for (var t in this.shape) {
			var tile = this.shape[t];
			if (!grid.spotFree(tile[0] + gridx, tile[1] + gridy)) {
				this.jumpBack();
				return false;
			}
		}
		console.log("drop");
		
		this.gridx = gridx;
		this.gridy = gridy;
		this.x = grid.x + gridx * grid.tilew;
		this.y = grid.y + gridy * grid.tilew;
		this.locked = true;
		return true;
	}
}