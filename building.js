var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Building = /** @class */ (function () {
    function Building(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    Building.prototype.update = function (game) { };
    Building.prototype.render = function (game) { };
    return Building;
}());
var Turret = /** @class */ (function (_super) {
    __extends(Turret, _super);
    function Turret(x, y, type, reloadTime, storage, range) {
        var _this = _super.call(this, x, y, type) || this;
        _this.reloadTime = reloadTime;
        _this.maxReloadTime = reloadTime;
        _this.storage = storage;
        _this.maxStorage = storage;
        _this.range = range;
        return _this;
    }
    Turret.prototype.update = function (game) {
        this.reloadTime--;
        var min = null, minDist = Infinity;
        for (var _i = 0, _a = game.enemies; _i < _a.length; _i++) {
            var enemy = _a[_i];
            var d = dist(this.x, this.y, enemy.x, enemy.y);
            if (d < minDist && enemy.damageAimed < enemy.health) {
                minDist = d;
                min = enemy;
            }
        }
        if (!min || this.reloadTime > 0 || minDist > this.range || this.storage < 1) {
            return;
        }
        var angle = Math.atan2(min.y - this.y, min.x - this.x);
        if (this.type === "potatolauncher") {
            game.bullets.push(new PotatoBullet(this.x, this.y, angle, game, min));
        }
        else if (this.type === "carrotcannon") {
            game.bullets.push(new CarrotBullet(this.x, this.y, angle, game, min));
        }
        else if (this.type === "homingonions") {
            game.bullets.push(new OnionBullet(this.x, this.y, angle, game, min));
        }
        this.reloadTime = this.maxReloadTime;
        this.storage--;
    };
    return Turret;
}(Building));
var PotatoLauncher = /** @class */ (function (_super) {
    __extends(PotatoLauncher, _super);
    function PotatoLauncher(x, y) {
        return _super.call(this, x, y, "potatolauncher", 60, 10, 700) || this;
    }
    PotatoLauncher.prototype.render = function (game) {
        game.ctx.fillStyle = "beige";
        game.ctx.fillRect(game.rpx(this.x), game.rpy(this.y), 50, 50);
        game.ctx.drawImage(game.assets.potato, game.rpx(this.x) - 15, game.rpy(this.y) + 40);
        game.ctx.fillStyle = "black";
        game.ctx.font = "15px Arial";
        game.ctx.textAlign = "left";
        game.ctx.fillText(this.storage.toString(), game.rpx(this.x) + 30, game.rpy(this.y) + 70);
    };
    return PotatoLauncher;
}(Turret));
var CarrotCannon = /** @class */ (function (_super) {
    __extends(CarrotCannon, _super);
    function CarrotCannon(x, y) {
        return _super.call(this, x, y, "carrotcannon", 100, 10, 1000) || this;
    }
    CarrotCannon.prototype.render = function (game) {
        game.ctx.fillStyle = "beige";
        game.ctx.fillRect(game.rpx(this.x), game.rpy(this.y), 50, 50);
        game.ctx.drawImage(game.assets.carrot, game.rpx(this.x) - 15, game.rpy(this.y) + 40);
        game.ctx.fillStyle = "black";
        game.ctx.font = "15px Arial";
        game.ctx.textAlign = "left";
        game.ctx.fillText(this.storage.toString(), game.rpx(this.x) + 30, game.rpy(this.y) + 70);
    };
    return CarrotCannon;
}(Turret));
var HomingOnions = /** @class */ (function (_super) {
    __extends(HomingOnions, _super);
    function HomingOnions(x, y) {
        return _super.call(this, x, y, "homingonions", 120, 5, 700) || this;
    }
    HomingOnions.prototype.render = function (game) {
        game.ctx.fillStyle = "beige";
        game.ctx.fillRect(game.rpx(this.x), game.rpy(this.y), 50, 50);
        game.ctx.drawImage(game.assets.onion, game.rpx(this.x) - 15, game.rpy(this.y) + 40);
        game.ctx.fillStyle = "black";
        game.ctx.font = "15px Arial";
        game.ctx.textAlign = "left";
        game.ctx.fillText(this.storage.toString(), game.rpx(this.x) + 30, game.rpy(this.y) + 70);
    };
    return HomingOnions;
}(Turret));
