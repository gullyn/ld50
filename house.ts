class House {
	public x: number;
	public y: number;

	public health: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;

		this.health = 100;
	}

	update(game: Game) {

	}

	render(game: Game) {
		game.ctx.drawImage(game.assets.house, game.rpx(this.x) - 100, game.rpy(this.y) - 150);
	}
}