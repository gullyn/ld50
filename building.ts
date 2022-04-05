class Building {
	public x: number;
	public y: number;
	public type: string;

	constructor(x: number, y: number, type: string) {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	update(game: Game) {}
	render(game: Game) {}
}

class Turret extends Building {
	public reloadTime: number;
	public maxReloadTime: number;
	public storage: number;
	public maxStorage: number;
	public range: number;

	constructor(x: number, y: number, type: string, reloadTime: number, storage: number, range: number) {
		super(x, y, type);
		this.reloadTime = reloadTime;
		this.maxReloadTime = reloadTime;
		this.storage = storage;
		this.maxStorage = storage;
		this.range = range;
	}

	update(game: Game) {
		this.reloadTime--;
		let min = null, minDist = Infinity;
		for (let enemy of game.enemies) {
			const d = dist(this.x, this.y, enemy.x, enemy.y);
			if (d < minDist && enemy.damageAimed < enemy.health) {
				minDist = d;
				min = enemy;
			}
		}

		if (!min || this.reloadTime > 0 || minDist > this.range || this.storage < 1) {
			return;
		}

		const angle = Math.atan2(min.y - this.y, min.x - this.x);
		game.playNextShoot();

		if (this.type === "potatolauncher") {
			game.bullets.push(new PotatoBullet(this.x, this.y, angle, game, min));
		} else if (this.type === "carrotcannon") {
			game.bullets.push(new CarrotBullet(this.x, this.y, angle, game, min));
		} else if (this.type === "homingonions") {
			game.bullets.push(new OnionBullet(this.x, this.y, angle, game, min));
		}

		this.reloadTime = this.maxReloadTime;
		this.storage--;
	}
}

class PotatoLauncher extends Turret {
	constructor(x: number, y: number) {
		super(x, y, "potatolauncher", 60, 10, 700);
	}

	render(game: Game) {
		game.ctx.drawImage(game.assets.potatolauncher, game.rpx(this.x), game.rpy(this.y));

		game.ctx.drawImage(game.assets.potato, game.rpx(this.x) - 15, game.rpy(this.y) + 40);
		game.ctx.fillStyle = "black";
		game.ctx.font = "15px Arial";
		game.ctx.textAlign = "left";
		game.ctx.fillText(this.storage.toString(), game.rpx(this.x) + 30, game.rpy(this.y) + 70);
	}
}

class CarrotCannon extends Turret {
	constructor(x: number, y: number) {
		super(x, y, "carrotcannon", 100, 10, 1000);
	}

	render(game: Game) {
		game.ctx.drawImage(game.assets.carrotcannon, game.rpx(this.x), game.rpy(this.y));

		game.ctx.drawImage(game.assets.carrot, game.rpx(this.x) - 15, game.rpy(this.y) + 40);
		game.ctx.fillStyle = "black";
		game.ctx.font = "15px Arial";
		game.ctx.textAlign = "left";
		game.ctx.fillText(this.storage.toString(), game.rpx(this.x) + 30, game.rpy(this.y) + 70);
	}
}

class HomingOnions extends Turret {
	constructor(x: number, y: number) {
		super(x, y, "homingonions", 120, 5, 700);
	}

	render(game: Game) {
		game.ctx.drawImage(game.assets.homingonions, game.rpx(this.x), game.rpy(this.y));

		game.ctx.drawImage(game.assets.onion, game.rpx(this.x) - 15, game.rpy(this.y) + 40);
		game.ctx.fillStyle = "black";
		game.ctx.font = "15px Arial";
		game.ctx.textAlign = "left";
		game.ctx.fillText(this.storage.toString(), game.rpx(this.x) + 30, game.rpy(this.y) + 70);
	}
}