var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var game = new Game(ctx);
game.update();
window.addEventListener("mousemove", function (event) {
    game.onmousemove(event);
});
window.addEventListener("mousedown", function (event) {
    game.onmousedown(event);
});
window.addEventListener("mouseup", function (event) {
    game.onmouseup(event);
});
window.addEventListener("keydown", function (event) {
    game.onkeydown(event);
});
window.addEventListener("keyup", function (event) {
    game.onkeyup(event);
});
window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
