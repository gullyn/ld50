class House {
	public x: number;
	public y: number;

	public health: number;
	public healthIncreaseTimer: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;

		this.health = 100;
		this.healthIncreaseTimer = 0;
	}

	update(game: Game) {
		if (this.healthIncreaseTimer-- < 0) {
			this.health = Math.min(100, this.health + 1);
			this.healthIncreaseTimer = 60;
		}
	}

	render(game: Game) {
		game.ctx.drawImage(game.assets.house, game.rpx(this.x) - 100, game.rpy(this.y) - 150);

		if (this.health < 100) {
			game.ctx.fillStyle = "black";
			game.ctx.fillRect(game.rpx(this.x) - 100, game.rpy(this.y) - 170, 200, 20);
			game.ctx.fillStyle = "red";
			game.ctx.fillRect(game.rpx(this.x) - 97, game.rpy(this.y) - 167, 194, 14);
			game.ctx.fillStyle = "green";
			game.ctx.fillRect(game.rpx(this.x) - 97, game.rpy(this.y) - 167, 194 * (this.health / 100), 14);
		}
	}
}