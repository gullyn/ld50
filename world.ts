class World {
	public width: number;
	public height: number;
	public grid: Tile[][];
	public entities: Entity[];
	public buildings: Building[];

	constructor(width: number, height: number, game: Game) {
		this.width = width;
		this.height = height;
		this.grid = [];
		this.entities = [];
		this.buildings = [];

		this.generateWorld();
		this.findHousePos(game);
		this.deleteOverlappingEntities();
	}

	update(game: Game) {
		for (let entity of this.entities) {
			if (entity instanceof PotatoPlant) {
				if (Math.random() < 0.0003) {
					entity.stage = Math.min(entity.stage + 1, 2);
				}
			} else if (entity instanceof CarrotPlant) {
				if (Math.random() < 0.0003) {
					entity.stage = Math.min(entity.stage + 1, 2);
				}
			}
		}

		for (let building of this.buildings) {
			building.update(game);
		}
	}

	render(game: Game) {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				const rpx = game.rpx(x * 50 - this.width * 25), rpy = game.rpy(y * 50 - this.width * 25);

				if (rpx < -50 || rpx > game.ctx.canvas.width ||
					rpy < -50 || rpy > game.ctx.canvas.height) {
					continue;
				}

				let color = "#000";

				if (this.grid[x][y].type === "water") {
					color = "rgb(35,137,218)";
				} else if (this.grid[x][y].type === "sand") {
					color = "#ff0";
				} else if (this.grid[x][y].type === "grass") {
					color = "#348c31";
				}

				game.ctx.fillStyle = color;
				game.ctx.fillRect(rpx, rpy, 51, 51);
			}
		}

		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].render(game);
		}

		for (let i = 0; i < this.buildings.length; i++) {
			this.buildings[i].render(game);
		}
	}

	generateWorld() {
		(noise as any).seed(Math.random());
		for (let x = 0; x < this.width; x++) {
			this.grid.push([]);
			for (let y = 0; y < this.height; y++) {
				const val = Math.abs((noise as any).perlin2(x / 25, y / 25));

				let type = "water";

				if (val > 0.12) {
					type = "sand";
				}

				if (val > 0.15) {
					type = "grass";
				}

				this.grid[this.grid.length - 1].push(new Tile(x, y, type, (x - this.width / 2) * 50, (y - this.height / 2) * 50));
			}
		}

		for (let i = 0; i < 1200; i++) {
			do {
				var x = Math.floor(Math.random() * this.width);
				var y = Math.floor(Math.random() * this.height);
			} while (this.grid[x][y].type !== "grass" && this.grid[x][y].type !== "sand");

			this.entities.push(new Rock((x - this.width / 2) * 50, (y - this.height / 2) * 50));
		}

		for (let i = 0; i < 50; i++) {
			do {
				var x = Math.floor(Math.random() * this.width);
				var y = Math.floor(Math.random() * this.height);
			} while (this.grid[x][y].type !== "grass");

			this.entities.push(new PotatoPlant((x - this.width / 2) * 50, (y - this.height / 2) * 50, Math.floor(Math.random() * 3), false));
		}

		for (let i = 0; i < 50; i++) {
			do {
				var x = Math.floor(Math.random() * this.width);
				var y = Math.floor(Math.random() * this.height);
			} while (this.grid[x][y].type !== "grass");

			this.entities.push(new CarrotPlant((x - this.width / 2) * 50, (y - this.height / 2) * 50, Math.floor(Math.random() * 3), false));
		}

		for (let i = 0; i < 1200; i++) {
			do {
				var x = Math.floor(Math.random() * this.width);
				var y = Math.floor(Math.random() * this.height);
			} while (this.grid[x][y].type !== "grass");

			this.entities.push(new Tree((x - this.width / 2) * 50, (y - this.height / 2) * 50));
		}
	}

	findEntityAtPos(x: number, y: number): Entity {
		for (let entity of this.entities) {
			if (entity.x === x && entity.y === y && !(entity instanceof Enemy)) {
				return entity;
			}
		}
		return null;
	}

	findBuildingAtPos(x: number, y: number): Building {
		for (let building of this.buildings) {
			if (building.x === x && building.y === y) {
				return building;
			}
		}
		return null;
	}

	removeEntity(entity: Entity) {
		for (let i = 0; i < this.entities.length; i++) {
			if (this.entities[i] === entity) {
				this.entities.splice(i, 1);
				break;
			}
		}
	}

	removeBuilding(building: Building) {
		for (let i = 0; i < this.buildings.length; i++) {
			if (this.buildings[i] === building) {
				this.buildings.splice(i, 1);
				break;
			}
		}
	}

	findHousePos(game: Game) {
		do {
			var good = true;

			var x = Math.floor(Math.random() * this.width);
			var y = Math.floor(Math.random() * this.height);

			if (x < 30 || y < 30 || x >= this.width - 30 || y >= this.height - 30) {
				good = false;
				continue;
			}

			for (let x1 = -5; x1 < 5; x1++) {
				for (let y1 = -5; y1 < 5; y1++) {
					if (this.grid[x1 + x][y1 + y].type === "water") {
						good = false;
						continue;
					}
				}
			}
		} while (!good);

		game.house.x = (x - this.width / 2) * 50;
		game.house.y = (y - this.height / 2) * 50;

		game.player.x = game.house.x;
		game.player.y = game.house.y + 200;

		for (let i = this.entities.length - 1; i > -1; i--) {
			if (dist(this.entities[i].x, this.entities[i].y, game.house.x, game.house.y) < 200) {
				this.entities.splice(i, 1);
			}
		}

		for (let i = 0; i < 4; i++) {
			this.entities.push(new PotatoPlant(game.house.x + 150, game.house.y - 100 + i * 50, Math.floor(Math.random() * 3), true));
		}
	}

	deleteOverlappingEntities() {
		for (let i = this.entities.length - 1; i > -1; i--) {
			for (let e of this.entities) {
				if (this.entities[i] === e) {
					continue;
				}

				if ((this.entities[i].x === e.x && this.entities[i].y === e.y) ||
					(this.entities[i].x === e.x && this.entities[i].y - 50 === e.y && this.entities[i].type === "wood")) {
					this.entities.splice(i, 1);
					break;
				}
			}
		}
	}
}