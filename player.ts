class Player {
	public x: number;
	public y: number;
	public speed: number;
	public inventory: { [key: string]: number };
	public image: HTMLImageElement;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.speed = 7;
		this.image = null;
		this.inventory = {
			"potato": 0,
			"carrot": 0,
			"onion": 0,
			"wood": 0,
			"stone": 0
		};
	}

	update(game: Game) {
		let rotation = -1;
		if (game.keys["a"]) {
			rotation = Math.PI;
			this.image = game.assets.player7;
		}
		if (game.keys["s"]) {
			rotation = Math.PI / 2;
			this.image = game.assets.player5;
		}
		if (game.keys["d"]) {
			rotation = 0;
			this.image = game.assets.player3;
		}
		if (game.keys["w"]) {
			rotation = Math.PI * 1.5;
			this.image = game.assets.player1;
		}
		if (game.keys["a"] && game.keys["s"]) {
			rotation = Math.PI * 0.75;
			this.image = game.assets.player6;
		}
		if (game.keys["s"] && game.keys["d"]) {
			rotation = Math.PI * 0.25;
			this.image = game.assets.player4;
		}
		if (game.keys["d"] && game.keys["w"]) {
			rotation = Math.PI * 1.75;
			this.image = game.assets.player2;
		}
		if (game.keys["w"] && game.keys["a"]) {
			rotation = Math.PI * 1.25;
			this.image = game.assets.player8;
		}

		if (rotation !== -1) {
			let adjustedSpeed = 1;
			const gridX = Math.floor(this.x / 50) + game.world.width / 2;
			const gridY = Math.floor(this.y / 50) + game.world.height / 2;
			if (game.world.grid[gridX] && game.world.grid[gridX][gridY] && game.world.grid[gridX][gridY].type === "water") {
				adjustedSpeed = 0.5;
			}
			const newX = Math.max(Math.min(Math.cos(rotation) * this.speed * adjustedSpeed + this.x, game.world.width * 25), -game.world.width * 25);
			const newY = Math.max(Math.min(Math.sin(rotation) * this.speed * adjustedSpeed + this.y, game.world.height * 25), -game.world.height * 25);

			let willMoveX = true;
			let willMoveY = true;

			if ((newX + 25 >= game.house.x - 75 && newX - 25 <= game.house.x + 75)
				&& this.y + 25 >= game.house.y - 75 && this.y - 25 <= game.house.y + 100) {
				willMoveX = false;
			}

			if ((this.x + 25 >= game.house.x - 75 && this.x - 25 <= game.house.x + 75)
				&& newY + 25 >= game.house.y - 75 && newY - 25 <= game.house.y + 100) {
				willMoveY = false;
			}

			for (let entity of game.world.entities) {
				if ((entity.type === "stone" || entity.type === "wood") && Math.abs(this.y - (entity.y + 25)) < 50 && Math.abs(newX - (entity.x + 25)) < 35) {
					willMoveX = false;
				}

				if ((entity.type === "stone" || entity.type === "wood") && Math.abs(newY - (entity.y + 25)) < 50 && Math.abs(this.x - (entity.x + 25)) < 25) {
					willMoveY = false;
				}
			}

			if (willMoveX) {
				this.x = newX;
			}

			if (willMoveY) {
				this.y = newY;
			}
		}
	}

	render(game: Game) {
		game.ctx.drawImage(this.image, game.ctx.canvas.width / 2 - 25, game.ctx.canvas.height / 2 - 37);
	}
}