function BKLogo(callback) {
	//canvas
	canvas = $("#game")[0];
	ctx = canvas.getContext("2d");
	ctx.fillText("Loading... If you can read this, something went wrong probably", 10, 10);
	this.timer = 0;
	this.tick = function() {
		/*++this.timer;
		if (this.timer <= 120) {
			requestAnimationFrame(this.tick);
			this.drawLog(this.timer);
		}
		else */
			callback();
	}
	this.logoimg = new Image();
	this.logoimg.src = "http://boltkey.cz/boltkeylogo.png";
	this.drawLog = function(a) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this.logoimg, Math.floor(canvas.width / 2 - 125), Math.floor(canvas.height / 2 - 120), 250, 240);
		ctx.fillStyle = "rgb(100, 100, 100)";
		ctx.font = "50px arial";
		ctx.textAlign = "center";
		ctx.fillText("BoltKey", canvas.width / 2, canvas.height / 2 + 170);
		t = Math.abs(a - 60) - 40;
		t = t < 0 ? 0 : (t / 20);
		ctx.fillStyle = "rgba(255, 255, 255, " + t + ")";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	this.tick();
}