var House = /** @class */ (function () {
    function House(x, y) {
        this.x = x;
        this.y = y;
        this.health = 100;
    }
    House.prototype.update = function (game) {
    };
    House.prototype.render = function (game) {
        game.ctx.drawImage(game.assets.house, game.rpx(this.x) - 100, game.rpy(this.y) - 150);
    };
    return House;
}());
