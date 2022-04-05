var World = /** @class */ (function () {
    function World(width, height, game) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.entities = [];
        this.buildings = [];
        this.generateWorld();
        this.findHousePos(game);
        this.deleteOverlappingEntities();
        this.createRock(game);
    }
    World.prototype.update = function (game) {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            if (entity instanceof PotatoPlant) {
                if (Math.random() < 0.0003) {
                    entity.stage = Math.min(entity.stage + 1, 2);
                }
            }
            else if (entity instanceof CarrotPlant) {
                if (Math.random() < 0.0003) {
                    entity.stage = Math.min(entity.stage + 1, 2);
                }
            }
        }
        for (var _b = 0, _c = this.buildings; _b < _c.length; _b++) {
            var building = _c[_b];
            building.update(game);
        }
    };
    World.prototype.render = function (game) {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var rpx = game.rpx(x * 50 - this.width * 25), rpy = game.rpy(y * 50 - this.width * 25);
                if (rpx < -50 || rpx > game.ctx.canvas.width ||
                    rpy < -50 || rpy > game.ctx.canvas.height) {
                    continue;
                }
                var color = "#000";
                if (this.grid[x][y].type === "water") {
                    color = "rgb(35,137,218)";
                }
                else if (this.grid[x][y].type === "sand") {
                    color = "#ff0";
                }
                else if (this.grid[x][y].type === "grass") {
                    color = "#348c31";
                }
                else if (this.grid[x][y].type === "rock") {
                    color = "#888";
                }
                game.ctx.fillStyle = color;
                game.ctx.fillRect(rpx, rpy, 51, 51);
            }
        }
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].type !== "stone" && this.entities[i].type !== "wood") {
                this.entities[i].render(game);
            }
        }
        for (var i = 0; i < this.buildings.length; i++) {
            this.buildings[i].render(game);
        }
    };
    World.prototype.renderEntities = function (game) {
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].type === "stone" || this.entities[i].type === "wood") {
                this.entities[i].render(game);
            }
        }
    };
    World.prototype.generateWorld = function () {
        noise.seed(Math.random());
        for (var x_1 = 0; x_1 < this.width; x_1++) {
            this.grid.push([]);
            for (var y_1 = 0; y_1 < this.height; y_1++) {
                var val = Math.abs(noise.perlin2(x_1 / 25, y_1 / 25));
                var type = "water";
                if (val > 0.12) {
                    type = "sand";
                }
                if (val > 0.15) {
                    type = "grass";
                }
                this.grid[this.grid.length - 1].push(new Tile(x_1, y_1, type, (x_1 - this.width / 2) * 50, (y_1 - this.height / 2) * 50));
            }
        }
        for (var i = 0; i < 1200; i++) {
            do {
                var x = Math.floor(Math.random() * this.width);
                var y = Math.floor(Math.random() * this.height);
            } while (this.grid[x][y].type !== "grass" && this.grid[x][y].type !== "sand" && this.grid[x][y].type !== "rock");
            this.entities.push(new Rock((x - this.width / 2) * 50, (y - this.height / 2) * 50));
        }
        for (var i = 0; i < 50; i++) {
            do {
                var x = Math.floor(Math.random() * this.width);
                var y = Math.floor(Math.random() * this.height);
            } while (this.grid[x][y].type !== "grass");
            this.entities.push(new PotatoPlant((x - this.width / 2) * 50, (y - this.height / 2) * 50, Math.floor(Math.random() * 3), false));
        }
        for (var i = 0; i < 50; i++) {
            do {
                var x = Math.floor(Math.random() * this.width);
                var y = Math.floor(Math.random() * this.height);
            } while (this.grid[x][y].type !== "grass");
            this.entities.push(new CarrotPlant((x - this.width / 2) * 50, (y - this.height / 2) * 50, Math.floor(Math.random() * 3), false));
        }
        for (var i = 0; i < 1200; i++) {
            do {
                var x = Math.floor(Math.random() * this.width);
                var y = Math.floor(Math.random() * this.height);
            } while (this.grid[x][y].type !== "grass");
            this.entities.push(new Tree((x - this.width / 2) * 50, (y - this.height / 2) * 50));
        }
    };
    World.prototype.findEntityAtPos = function (x, y) {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            if (entity.x === x && entity.y === y && !(entity instanceof Enemy)) {
                return entity;
            }
        }
        return null;
    };
    World.prototype.findBuildingAtPos = function (x, y) {
        for (var _i = 0, _a = this.buildings; _i < _a.length; _i++) {
            var building = _a[_i];
            if (building.x === x && building.y === y) {
                return building;
            }
        }
        return null;
    };
    World.prototype.removeEntity = function (entity) {
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i] === entity) {
                this.entities.splice(i, 1);
                break;
            }
        }
    };
    World.prototype.removeBuilding = function (building) {
        for (var i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i] === building) {
                this.buildings.splice(i, 1);
                break;
            }
        }
    };
    World.prototype.findHousePos = function (game) {
        do {
            var good = true;
            var x = Math.floor(Math.random() * this.width);
            var y = Math.floor(Math.random() * this.height);
            if (x < 30 || y < 30 || x >= this.width - 30 || y >= this.height - 30) {
                good = false;
                continue;
            }
            for (var x1 = -5; x1 < 5; x1++) {
                for (var y1 = -5; y1 < 5; y1++) {
                    if (this.grid[x1 + x][y1 + y].type === "water") {
                        good = false;
                        continue;
                    }
                }
            }
        } while (!good);
        game.house.x = (x - this.width / 2) * 50;
        game.house.y = (y - this.height / 2) * 50;
        game.player.x = game.house.x;
        game.player.y = game.house.y + 200;
        for (var i = this.entities.length - 1; i > -1; i--) {
            if (dist(this.entities[i].x, this.entities[i].y, game.house.x, game.house.y) < 200) {
                this.entities.splice(i, 1);
            }
        }
        for (var i = 0; i < 4; i++) {
            this.entities.push(new PotatoPlant(game.house.x + 150, game.house.y - 100 + i * 50, 2, true));
        }
    };
    World.prototype.deleteOverlappingEntities = function () {
        for (var i = this.entities.length - 1; i > -1; i--) {
            for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
                var e = _a[_i];
                if (this.entities[i] === e) {
                    continue;
                }
                if ((this.entities[i].x === e.x && this.entities[i].y === e.y) ||
                    (this.entities[i].x === e.x && this.entities[i].y - 50 === e.y && this.entities[i].type === "wood")) {
                    this.entities.splice(i, 1);
                    break;
                }
            }
        }
    };
    World.prototype.createRock = function (game) {
        for (var x_2 = 0; x_2 < this.width; x_2++) {
            for (var y_2 = 0; y_2 < this.height; y_2++) {
                var tile = this.grid[x_2][y_2];
                if (tile.type !== "sand" && tile.type !== "grass") {
                    continue;
                }
                var val = Math.abs(noise.perlin2((x_2 + 1e6) / 50, (y_2 + 1e6) / 50));
                if (dist(tile.displayX, tile.displayY, game.house.x, game.house.y) < 2500) {
                    continue;
                }
                if (val > 0.5) {
                    tile.type = "rock";
                }
            }
        }
        for (var i = this.entities.length - 1; i > -1; i--) {
            var e = this.entities[i];
            if (this.grid[Math.floor(e.x / 50) + this.width / 2][Math.floor(e.y / 50) + this.height / 2].type === "rock" &&
                e.type !== "rock") {
                this.entities.splice(i, 1);
            }
        }
        for (var i = 0; i < 20; i++) {
            do {
                var x = Math.floor(Math.random() * this.width);
                var y = Math.floor(Math.random() * this.height);
            } while (this.grid[x][y].type !== "rock");
            this.entities.push(new OnionPlant((x - this.width / 2) * 50, (y - this.height / 2) * 50, Math.floor(Math.random() * 3), false));
        }
    };
    return World;
}());
