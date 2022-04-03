var Player = /** @class */ (function () {
    function Player(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 7;
        this.inventory = {
            "potato": 0,
            "carrot": 0,
            "onion": 0,
            "wood": 0,
            "stone": 0
        };
    }
    Player.prototype.update = function (game) {
        var rotation = -1;
        if (game.keys["a"]) {
            rotation = Math.PI;
        }
        if (game.keys["s"]) {
            rotation = Math.PI / 2;
        }
        if (game.keys["d"]) {
            rotation = 0;
        }
        if (game.keys["w"]) {
            rotation = Math.PI * 1.5;
        }
        if (game.keys["a"] && game.keys["s"]) {
            rotation = Math.PI * 0.75;
        }
        if (game.keys["s"] && game.keys["d"]) {
            rotation = Math.PI * 0.25;
        }
        if (game.keys["d"] && game.keys["w"]) {
            rotation = Math.PI * 1.75;
        }
        if (game.keys["w"] && game.keys["a"]) {
            rotation = Math.PI * 1.25;
        }
        if (rotation !== -1) {
            var adjustedSpeed = 1;
            var gridX = Math.floor(this.x / 50) + game.world.width / 2;
            var gridY = Math.floor(this.y / 50) + game.world.height / 2;
            if (game.world.grid[gridX] && game.world.grid[gridX][gridY] && game.world.grid[gridX][gridY].type === "water") {
                adjustedSpeed = 0.5;
            }
            var newX = Math.max(Math.min(Math.cos(rotation) * this.speed * adjustedSpeed + this.x, game.world.width * 25), -game.world.width * 25);
            var newY = Math.max(Math.min(Math.sin(rotation) * this.speed * adjustedSpeed + this.y, game.world.height * 25), -game.world.height * 25);
            var willMove = true;
            if ((newX + 25 >= game.house.x - 75 && newX - 25 <= game.house.x + 75)
                && newY + 25 >= game.house.y - 75 && newY - 25 <= game.house.y + 100) {
                willMove = false;
            }
            if (willMove) {
                this.x = newX;
                this.y = newY;
            }
        }
    };
    Player.prototype.render = function (game) {
        game.ctx.fillStyle = "black";
        game.ctx.fillRect(game.ctx.canvas.width / 2 - 25, game.ctx.canvas.height / 2 - 25, 50, 50);
    };
    return Player;
}());
