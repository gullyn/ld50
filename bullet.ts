class Bullet {
	public x: number;
	public y: number;
	public type: string;
	public angle: number;
	public speed: number;
	public lifetime: number;
	public damage: number;
	public image: HTMLImageElement;
	public target: Enemy;
	public homing: boolean;

	constructor(x: number, y: number, type: string, angle: number, speed: number, lifetime: number, damage: number, image: HTMLImageElement, target: Enemy, homing: boolean) {
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

	update(game: Game): boolean {
		if (this.lifetime-- < 0) {
			this.target.damageAimed -= this.damage;
			return true;
		}

		this.x += Math.cos(this.angle) * this.speed;
		this.y += Math.sin(this.angle) * this.speed;

		for (let enemy of game.enemies) {
			if (dist(enemy.x, enemy.y, this.x, this.y) < 25) {
				this.target.damageAimed -= this.damage;
				if (enemy.damageTimer <= 0) {
					enemy.takeDamage(this.damage);
				}
				if (!this.homing) {
					return true;
				}
				let min = null, minDist = Infinity;
				for (let e of game.enemies) {
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
	}

	render(game: Game) {
		game.ctx.drawImage(this.image, game.rpx(this.x) - 25, game.rpy(this.y) - 25);
	}
}

class PotatoBullet extends Bullet {
	constructor(x: number, y: number, angle: number, game: Game, target: Enemy) {
		super(x, y, "potatobullet", angle, 10, 120, 4, game.assets.potato, target, false);
	}
}

class CarrotBullet extends Bullet {
	constructor(x: number, y: number, angle: number, game: Game, target: Enemy) {
		super(x, y, "carrotbullet", angle, 15, 200, 6, game.assets.carrot, target, false);
	}
}

class OnionBullet extends Bullet {
	constructor(x: number, y: number, angle: number, game: Game, target: Enemy) {
		super(x, y, "onionbullet", angle, 8, 200, 5, game.assets.onion, target, true);
	}
}