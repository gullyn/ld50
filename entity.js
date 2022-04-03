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
var Entity = /** @class */ (function () {
    function Entity(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    Entity.prototype.render = function (game) { };
    Entity.prototype.update = function (game) { };
    return Entity;
}());
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree(x, y) {
        return _super.call(this, x, y, "wood") || this;
    }
    Tree.prototype.render = function (game) {
        if (game.rpx(this.x) < -100 || game.rpx(this.x) > game.ctx.canvas.width + 100 ||
            game.rpy(this.y) < -100 || game.rpy(this.y) > game.ctx.canvas.height + 100) {
            return;
        }
        game.ctx.drawImage(game.assets.tree, game.rpx(this.x) - 25, game.rpy(this.y) - 60);
    };
    return Tree;
}(Entity));
var Rock = /** @class */ (function (_super) {
    __extends(Rock, _super);
    function Rock(x, y) {
        return _super.call(this, x, y, "stone") || this;
    }
    Rock.prototype.render = function (game) {
        if (game.rpx(this.x) < -50 || game.rpx(this.x) > game.ctx.canvas.width ||
            game.rpy(this.y) < -50 || game.rpy(this.y) > game.ctx.canvas.height) {
            return;
        }
        game.ctx.drawImage(game.assets.rock, game.rpx(this.x) - 25, game.rpy(this.y) - 25);
    };
    return Rock;
}(Entity));
var PotatoPlant = /** @class */ (function (_super) {
    __extends(PotatoPlant, _super);
    function PotatoPlant(x, y, stage, planted) {
        var _this = _super.call(this, x, y, "potato") || this;
        _this.stage = stage;
        _this.planted = planted;
        return _this;
    }
    PotatoPlant.prototype.render = function (game) {
        if (game.rpx(this.x) < -50 || game.rpx(this.x) > game.ctx.canvas.width ||
            game.rpy(this.y) < -50 || game.rpy(this.y) > game.ctx.canvas.height) {
            return;
        }
        if (this.planted) {
            game.ctx.fillStyle = "#698c31";
            game.ctx.fillRect(game.rpx(this.x), game.rpy(this.y), 50, 50);
        }
        switch (this.stage) {
            case 0:
                game.ctx.drawImage(game.assets.potatostage1, game.rpx(this.x), game.rpy(this.y));
                break;
            case 1:
                game.ctx.drawImage(game.assets.potatostage2, game.rpx(this.x), game.rpy(this.y));
                break;
            case 2:
                game.ctx.drawImage(game.assets.potatostage3, game.rpx(this.x), game.rpy(this.y));
                break;
        }
    };
    return PotatoPlant;
}(Entity));
var CarrotPlant = /** @class */ (function (_super) {
    __extends(CarrotPlant, _super);
    function CarrotPlant(x, y, stage, planted) {
        var _this = _super.call(this, x, y, "carrot") || this;
        _this.stage = stage;
        _this.planted = planted;
        return _this;
    }
    CarrotPlant.prototype.render = function (game) {
        if (game.rpx(this.x) < -50 || game.rpx(this.x) > game.ctx.canvas.width ||
            game.rpy(this.y) < -50 || game.rpy(this.y) > game.ctx.canvas.height) {
            return;
        }
        game.ctx.fillStyle = "orange";
        game.ctx.fillRect(game.rpx(this.x) + 10, game.rpy(this.y) + 10, 10, 10);
    };
    return CarrotPlant;
}(Entity));
var OnionPlant = /** @class */ (function (_super) {
    __extends(OnionPlant, _super);
    function OnionPlant(x, y, stage, planted) {
        var _this = _super.call(this, x, y, "onion") || this;
        _this.stage = stage;
        _this.planted = planted;
        return _this;
    }
    OnionPlant.prototype.render = function (game) {
        if (game.rpx(this.x) < -50 || game.rpx(this.x) > game.ctx.canvas.width ||
            game.rpy(this.y) < -50 || game.rpy(this.y) > game.ctx.canvas.height) {
            return;
        }
        game.ctx.fillStyle = "white";
        game.ctx.fillRect(game.rpx(this.x) + 10, game.rpy(this.y) + 10, 10, 10);
    };
    return OnionPlant;
}(Entity));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(x, y, type, health) {
        var _this = _super.call(this, x, y, type) || this;
        _this.health = health;
        _this.angle = 0;
        _this.damageAimed = 0;
        _this.damageTimer = 5;
        return _this;
    }
    Enemy.prototype.update = function (game) {
        if (this.health <= 0) {
            return true;
        }
        this.angle = Math.atan2(game.house.y - this.y, game.house.x - this.x);
        this.x += Math.cos(this.angle);
        this.y += Math.sin(this.angle);
        this.damageTimer--;
        return false;
    };
    Enemy.prototype.takeDamage = function (damage) {
        this.health -= damage;
        this.damageTimer = 5;
    };
    return Enemy;
}(Entity));
var Zombie = /** @class */ (function (_super) {
    __extends(Zombie, _super);
    function Zombie(x, y) {
        return _super.call(this, x, y, "zombie", 10) || this;
    }
    Zombie.prototype.render = function (game) {
        game.ctx.fillStyle = "black";
        game.ctx.save();
        game.ctx.translate(game.rpx(this.x), game.rpy(this.y));
        game.ctx.rotate(this.angle);
        game.ctx.fillRect(-15, -10, 30, 20);
        game.ctx.restore();
    };
    return Zombie;
}(Enemy));
