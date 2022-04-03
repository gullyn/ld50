class Entity {
	public x: number;
	public y: number;
	public type: string;

	constructor(x: number, y: number, type: string) {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	render(game: Game) {}

	update(game: Game) {}
}

class Tree extends Entity {
	constructor(x: number, y: number) {
		super(x, y, "wood");
	}

	render(game: Game) {
		if (game.rpx(this.x) < -100 || game.rpx(this.x) > game.ctx.canvas.width + 100 ||
			game.rpy(this.y) < -100 || game.rpy(this.y) > game.ctx.canvas.height + 100) {
			return;
		}

		game.ctx.drawImage(game.assets.tree, game.rpx(this.x) - 25, game.rpy(this.y) - 60);
	}
}

class Rock extends Entity {
	constructor(x: number, y: number) {
		super(x, y, "stone");
	}

	render(game: Game) {
		if (game.rpx(this.x) < -50 || game.rpx(this.x) > game.ctx.canvas.width ||
			game.rpy(this.y) < -50 || game.rpy(this.y) > game.ctx.canvas.height) {
			return;
		}

		game.ctx.drawImage(game.assets.rock, game.rpx(this.x) - 25, game.rpy(this.y) - 25);
	}
}

class PotatoPlant extends Entity {
	public stage: number;
	public planted: boolean;

	constructor(x: number, y: number, stage: number, planted: boolean) {
		super(x, y, "potato");
		this.stage = stage;
		this.planted = planted;
	}

	render(game: Game) {
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
	}
}

class CarrotPlant extends Entity {
	public stage: number;
	public planted: boolean;

	constructor(x: number, y: number, stage: number, planted: boolean) {
		super(x, y, "carrot");
		this.stage = stage;
		this.planted = planted;
	}

	render(game: Game) {
		if (game.rpx(this.x) < -50 || game.rpx(this.x) > game.ctx.canvas.width ||
			game.rpy(this.y) < -50 || game.rpy(this.y) > game.ctx.canvas.height) {
			return;
		}
		game.ctx.fillStyle = "orange";
		game.ctx.fillRect(game.rpx(this.x) + 10, game.rpy(this.y) + 10, 10, 10);
	}
}

class OnionPlant extends Entity {
	public stage: number;
	public planted: boolean;

	constructor(x: number, y: number, stage: number, planted: boolean) {
		super(x, y, "onion");
		this.stage = stage;
		this.planted = planted;
	}

	render(game: Game) {
		if (game.rpx(this.x) < -50 || game.rpx(this.x) > game.ctx.canvas.width ||
			game.rpy(this.y) < -50 || game.rpy(this.y) > game.ctx.canvas.height) {
			return;
		}
		game.ctx.fillStyle = "white";
		game.ctx.fillRect(game.rpx(this.x) + 10, game.rpy(this.y) + 10, 10, 10);
	}
}

class Enemy extends Entity {
	public health: number;
	public angle: number;
	public damageAimed: number;
	public damageTimer: number;

	constructor(x: number, y: number, type: string, health: number) {
		super(x, y, type);
		this.health = health;
		this.angle = 0;
		this.damageAimed = 0;
		this.damageTimer = 5;
	}

	update(game: Game): boolean {
		if (this.health <= 0) {
			return true;
		}
		this.angle = Math.atan2(game.house.y - this.y, game.house.x - this.x);

		this.x += Math.cos(this.angle);
		this.y += Math.sin(this.angle);
		this.damageTimer--;

		return false;
	}

	takeDamage(damage: number) {
		this.health -= damage;
		this.damageTimer = 5;
	}
}

class Zombie extends Enemy {
	constructor(x: number, y: number) {
		super(x, y, "zombie", 10);
	}

	render(game: Game) {
		game.ctx.fillStyle = "black";
		game.ctx.save();
		game.ctx.translate(game.rpx(this.x), game.rpy(this.y));
		game.ctx.rotate(this.angle);
		game.ctx.fillRect(-15, -10, 30, 20);
		game.ctx.restore();
	}
}