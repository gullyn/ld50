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
var Bullet = /** @class */ (function () {
    function Bullet(x, y, type, angle, speed, lifetime, damage, image, target, homing) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.angle = angle;
        this.speed = speed;
        this.lifetime = lifetime;
        this.damage = damage;
        this.image = image;
        this.target = target;
        this.homing = homing;
        this.target.damageAimed += this.damage;
    }
    Bullet.prototype.update = function (game) {
        if (this.lifetime-- < 0) {
            this.target.damageAimed -= this.damage;
            return true;
        }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        for (var _i = 0, _a = game.enemies; _i < _a.length; _i++) {
            var enemy = _a[_i];
            if (dist(enemy.x, enemy.y, this.x, this.y) < 25) {
                this.target.damageAimed -= this.damage;
                if (enemy.damageTimer <= 0) {
                    enemy.takeDamage(this.damage);
                }
                if (!this.homing) {
                    return true;
                }
                var min = null, minDist = Infinity;
                for (var _b = 0, _c = game.enemies; _b < _c.length; _b++) {
                    var e = _c[_b];
                    if (e === enemy) {
                        continue;
                    }
                    if (dist(e.x, e.y, this.x, this.y) < minDist) {
                        minDist = dist(e.x, e.y, this.x, this.y);
                        min = e;
                    }
                }
                if (min === null) {
                    break;
                }
                this.angle = Math.atan2(min.y - this.y, min.x - this.x);
                break;
            }
        }
        return false;
    };
    Bullet.prototype.render = function (game) {
        game.ctx.drawImage(this.image, game.rpx(this.x) - 25, game.rpy(this.y) - 25);
    };
    return Bullet;
}());
var PotatoBullet = /** @class */ (function (_super) {
    __extends(PotatoBullet, _super);
    function PotatoBullet(x, y, angle, game, target) {
        return _super.call(this, x, y, "potatobullet", angle, 10, 120, 4, game.assets.potato, target, false) || this;
    }
    return PotatoBullet;
}(Bullet));
var CarrotBullet = /** @class */ (function (_super) {
    __extends(CarrotBullet, _super);
    function CarrotBullet(x, y, angle, game, target) {
        return _super.call(this, x, y, "carrotbullet", angle, 15, 200, 6, game.assets.carrot, target, false) || this;
    }
    return CarrotBullet;
}(Bullet));
var OnionBullet = /** @class */ (function (_super) {
    __extends(OnionBullet, _super);
    function OnionBullet(x, y, angle, game, target) {
        return _super.call(this, x, y, "onionbullet", angle, 8, 200, 5, game.assets.onion, target, true) || this;
    }
    return OnionBullet;
}(Bullet));
