const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx = canvas.getContext("2d");

document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game = new Game(ctx);
game.update();

window.addEventListener("mousemove", (event) => {
	game.onmousemove(event);
});

window.addEventListener("mousedown", (event) => {
	game.onmousedown(event);
});

window.addEventListener("mouseup", (event) => {
	game.onmouseup(event);
});

window.addEventListener("keydown", (event) => {
	game.onkeydown(event);
});

window.addEventListener("keyup", (event) => {
	game.onkeyup(event);
});

window.onresize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}