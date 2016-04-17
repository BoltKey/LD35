var boxOffset = [0, 0];

function click() {
	console.log(divPos);
	for (var b in boxes) {
		var box = boxes[b];
		for (var t in box.shape) {
			var tile = box.shape[t];
			if (isMouseIn({x: box.x + tile[0] * grid.tilew, y: box.y + tile[1] * grid.tilew, w: grid.tilew})) {
				selected = box;
				box.selected = true;
				boxOffset = [divPos.x - box.x, divPos.y - box.y];
				sounds.pick.play();
			}
		}
	}
}

function drag() {
	if (selected) {
		selected.x = divPos.x - boxOffset[0];
		selected.y = divPos.y - boxOffset[1];
	}
}

function drop() {
	if (selected) {
		selected.drop();
		selected = undefined;
	}

}

function isMouseIn(obj) {
	//return (c1 && c2 && c3 && c4);
	return (divPos.y > obj.y && 
	divPos.y < obj.y + ((typeof(obj.h) !== "undefined") ? obj.h : obj.w) &&
	divPos.x > obj.x &&
	divPos.x < obj.x + obj.w);
}