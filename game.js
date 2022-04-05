var buildingCosts = {
    "potatolauncher": {
        "stone": 20,
        "wood": 20,
        "potato": 10
    },
    "carrotcannon": {
        "stone": 20,
        "wood": 20,
        "carrot": 10
    },
    "homingonions": {
        "stone": 50,
        "wood": 50,
        "onion": 5
    },
    "potato": {
        "potato": 1
    },
    "carrot": {
        "carrot": 1
    },
    "onion": {
        "onion": 1
    }
};
var Game = /** @class */ (function () {
    function Game(ctx) {
        this.player = new Player(0, 0);
        this.house = new House(0, 0);
        this.world = new World(200, 200, this);
        this.ctx = ctx;
        this.keys = {};
        this.selectedTile = null;
        this.tileOptions = [];
        this.messages = [];
        this.enemies = [];
        this.bullets = [];
        this.time = 3000;
        this.day = 1;
        this.harvestingEntity = null;
        this.harvestingTime = 0;
        this.newItemUnlocked = false;
        this.newItemName = "";
        this.newItemText = [""];
        this.newItemImage = null;
        this.woodDiscovered = false;
        this.stoneDiscovered = false;
        this.potatoDiscovered = false;
        this.carrotDiscovered = false;
        this.onionDiscovered = false;
        this.inIntro = true;
        this.introStage = 0;
        this.gameOver = false;
        this.gameOverOpacity = 0;
        this.score = 0;
        this.currentShoot = 0;
        this.currentInstruction = 0;
        this.instructionText = ["", ""];
        this.instructionX = 0;
        this.instructionY = 0;
        this.showArrow = true;
        this.assets = {
            rock: getImage("assets/rock.png"),
            rocklarge: getImage("assets/rocklarge.png"),
            tree: getImage("assets/tree.png"),
            loglarge: getImage("assets/loglarge.png"),
            house: getImage("assets/house.png"),
            potatostage1: getImage("assets/potatostage1.png"),
            potatostage2: getImage("assets/potatostage2.png"),
            potatostage3: getImage("assets/potatostage3.png"),
            potato: getImage("assets/potato.png"),
            potatolarge: getImage("assets/potatolarge.png"),
            carrot: getImage("assets/carrot.png"),
            carrotlarge: getImage("assets/carrotlarge.png"),
            onion: getImage("assets/onion.png"),
            onionlarge: getImage("assets/onionlarge.png"),
            carrotstage1: getImage("assets/carrotstage1.png"),
            carrotstage2: getImage("assets/carrotstage2.png"),
            carrotstage3: getImage("assets/carrotstage3.png"),
            onionstage1: getImage("assets/onionstage1.png"),
            onionstage2: getImage("assets/onionstage2.png"),
            onionstage3: getImage("assets/onionstage3.png"),
            player1: getImage("assets/player1.png"),
            player2: getImage("assets/player2.png"),
            player3: getImage("assets/player3.png"),
            player4: getImage("assets/player4.png"),
            player5: getImage("assets/player5.png"),
            player6: getImage("assets/player6.png"),
            player7: getImage("assets/player7.png"),
            player8: getImage("assets/player8.png"),
            debtcollector: getImage("assets/debtcollector.png"),
            potatolauncher: getImage("assets/potatolauncher.png"),
            carrotcannon: getImage("assets/carrotcannon.png"),
            homingonions: getImage("assets/homingonions.png")
        };
        this.player.image = this.assets.player1;
        this.audio = {
            music1: getAudio("audio/music1.mp3"),
            shoot1: getAudio("audio/shoot.wav"),
            shoot2: getAudio("audio/shoot.wav"),
            shoot3: getAudio("audio/shoot.wav")
        };
    }
    Game.prototype.update = function () {
        if (this.newItemUnlocked || this.inIntro || this.gameOver) {
            this.render();
            window.requestAnimationFrame(this.update.bind(this));
            return;
        }
        this.player.update(this);
        this.house.update(this);
        this.world.update(this);
        this.time += 1.5;
        if (this.time > 18000) {
            this.time = 0;
            this.day++;
            this.generateEnemies();
        }
        for (var i = this.bullets.length - 1; i > -1; i--) {
            if (this.bullets[i].update(this)) {
                this.bullets.splice(i, 1);
            }
        }
        for (var i = this.enemies.length - 1; i > -1; i--) {
            if (this.enemies[i].update(this)) {
                this.enemies.splice(i, 1);
                this.score++;
            }
        }
        if (this.harvestingEntity !== null && this.harvestingTime >= 100) {
            var toAdd = Math.floor(Math.random() * 4) + 2;
            this.player.inventory[this.harvestingEntity.type] += toAdd;
            this.messages.push({
                x: this.harvestingEntity.x,
                y: this.harvestingEntity.y,
                text: "+ " + toAdd + " " + this.harvestingEntity.type,
                time: 60
            });
            if (this.harvestingEntity.type === "wood" && !this.woodDiscovered) {
                this.woodDiscovered = true;
                this.newItemUnlocked = true;
                this.newItemName = "Wood";
                this.newItemText = ["Used for construction", ""];
                this.newItemImage = this.assets.loglarge;
            }
            else if (this.harvestingEntity.type === "stone" && !this.stoneDiscovered) {
                this.stoneDiscovered = true;
                this.newItemUnlocked = true;
                this.newItemName = "Stone";
                this.newItemText = ["Used for construction", ""];
                this.newItemImage = this.assets.rocklarge;
                if (this.currentInstruction === 2) {
                    this.instructionText = ["Click on a tile, press 'plant'", "and select 'potato'."];
                    this.instructionX = this.house.x + 150;
                    this.instructionY = this.house.y - 50;
                    this.currentInstruction++;
                }
            }
            else if (this.harvestingEntity.type === "potato" && !this.potatoDiscovered) {
                this.potatoDiscovered = true;
                this.newItemUnlocked = true;
                this.newItemName = "Potato";
                this.newItemText = ["Basic ammunition. Easy to farm, though not", "as effective against tougher debt collectors."];
                this.newItemImage = this.assets.potatolarge;
                if (this.currentInstruction === 1) {
                    this.currentInstruction++;
                    if (!this.stoneDiscovered) {
                        var min = null, minDist = Infinity;
                        for (var _i = 0, _a = this.world.entities; _i < _a.length; _i++) {
                            var entity = _a[_i];
                            if (dist(entity.x, entity.y, this.player.x, this.player.y) < minDist && entity.type === "stone") {
                                min = entity;
                                minDist = dist(entity.x, entity.y, this.player.x, this.player.y);
                            }
                        }
                        this.instructionX = min.x;
                        this.instructionY = min.y;
                        this.instructionText = ["Click on a rock", "and press 'harvest'."];
                    }
                    else {
                        this.currentInstruction = 3;
                    }
                }
            }
            else if (this.harvestingEntity.type === "carrot" && !this.carrotDiscovered) {
                this.carrotDiscovered = true;
                this.newItemUnlocked = true;
                this.newItemName = "Carrot";
                this.newItemText = ["Its aerodynamic shape allows it to slice", "through debt collectors and travel faster than potatoes."];
                this.newItemImage = this.assets.carrotlarge;
            }
            else if (this.harvestingEntity.type === "onion" && !this.onionDiscovered) {
                this.onionDiscovered = true;
                this.newItemUnlocked = true;
                this.newItemName = "Onion";
                this.newItemText = ["The most feared of all weapons,", "onions can destroy all but the most powerful debt collectors."];
                this.newItemImage = this.assets.onionlarge;
            }
            this.world.removeEntity(this.harvestingEntity);
            this.harvestingEntity = null;
        }
        else if (this.harvestingEntity !== null) {
            this.harvestingTime += 2;
        }
        if (this.house.health <= 0) {
            this.gameOver = true;
        }
        this.render();
        window.requestAnimationFrame(this.update.bind(this));
    };
    Game.prototype.render = function () {
        this.ctx.fillStyle = "rgb(50, 50, 50)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.world.render(this);
        var mouseX = Math.floor((this.mousePosX - this.ctx.canvas.width / 2 + this.player.x) / 50) * 50;
        var mouseY = Math.floor((this.mousePosY - this.ctx.canvas.height / 2 + this.player.y) / 50) * 50;
        if (!this.inIntro) {
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            this.ctx.fillRect(this.rpx(mouseX), this.rpy(mouseY), 50, 50);
        }
        this.player.render(this);
        this.house.render(this);
        this.world.renderEntities(this);
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.render(this);
        }
        for (var _b = 0, _c = this.enemies; _b < _c.length; _b++) {
            var enemy = _c[_b];
            enemy.render(this);
        }
        if (this.harvestingEntity !== null) {
            var x_1 = this.rpx(this.harvestingEntity.x);
            var y_1 = this.rpy(this.harvestingEntity.y) + 55;
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(x_1, y_1, 50, 15);
            this.ctx.fillStyle = "blue";
            this.ctx.fillRect(x_1 + 2, y_1 + 2, 46 * (this.harvestingTime / 100), 11);
        }
        if (this.selectedTile !== null) {
            var tileX = this.rpx((this.selectedTile.x - this.world.width / 2) * 50);
            var tileY = this.rpy((this.selectedTile.y - this.world.height / 2) * 50);
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            this.ctx.fillRect(tileX, tileY, 50, 50);
            var buildTypes = ["potatolauncher", "carrotcannon", "homingonions", "carrot", "potato", "onion"];
            for (var _d = 0, _e = this.tileOptions; _d < _e.length; _d++) {
                var option = _e[_d];
                this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                if (dist(this.mousePosX, this.mousePosY, tileX + option.x, tileY + option.y) <= 30) {
                    if (buildTypes.includes(option.id)) {
                        this.ctx.textAlign = "center";
                        this.ctx.font = "15px Arial";
                        var textY = tileY + 80;
                        for (var cost in buildingCosts[option.id]) {
                            var item = buildingCosts[option.id][cost];
                            this.ctx.fillStyle = this.player.inventory[cost] >= item ? "black" : "red";
                            this.ctx.fillText(this.player.inventory[cost] + "/" + item + " " + cost, tileX + 25, textY);
                            textY += 15;
                        }
                    }
                    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                }
                this.ctx.beginPath();
                this.ctx.arc(tileX + option.x, tileY + option.y, 30, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = "white";
                this.ctx.textAlign = "center";
                this.ctx.font = "15px Arial";
                if (option.text.length === 1) {
                    this.ctx.fillText(option.text[0], tileX + option.x, tileY + option.y + 5);
                }
                else {
                    this.ctx.font = "12px Arial";
                    this.ctx.fillText(option.text[0], tileX + option.x, tileY + option.y - 5);
                    this.ctx.fillText(option.text[1], tileX + option.x, tileY + option.y + 15);
                }
            }
        }
        for (var i = this.messages.length - 1; i > -1; i--) {
            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "center";
            this.ctx.font = "15px Arial";
            this.ctx.fillText(this.messages[i].text, this.rpx(this.messages[i].x), this.rpy(this.messages[i].y));
            this.messages[i].time--;
            this.messages[i].y--;
            if (this.messages[i].time <= 0) {
                this.messages.splice(i, 1);
            }
        }
        var opacity = Math.max(Math.abs(this.time - 9000) / 9000 - 0.5, 0);
        this.ctx.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.textAlign = "right";
        this.ctx.font = "bold 30px Courier New";
        this.ctx.fillStyle = "black";
        var hours = Math.floor(this.time / 18000 * 24);
        var minutes = Math.floor(this.time / 18000 * 1440) % 60;
        var text = hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " (Day " + this.day + ")";
        this.ctx.fillText(text, this.ctx.canvas.width - 20, this.ctx.canvas.height - 40);
        var angle = Math.atan2(this.house.y - this.player.y, this.house.x - this.player.x);
        var x = this.ctx.canvas.width / 2;
        var y = this.ctx.canvas.height / 2;
        while (Math.min(x, Math.abs(this.ctx.canvas.width - x)) > 70 && Math.min(y, Math.abs(this.ctx.canvas.height - y)) > 70) {
            x += Math.cos(angle);
            y += Math.sin(angle);
        }
        if (Math.abs(x - this.ctx.canvas.width / 2) + Math.abs(y - this.ctx.canvas.height / 2) < dist(this.house.x, this.house.y, this.player.x, this.player.y)) {
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle);
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(-40, -10, 80, 20);
            this.ctx.restore();
        }
        this.ctx.textAlign = "left";
        this.ctx.font = "20px Arial";
        this.ctx.drawImage(this.assets.onion, 10, this.ctx.canvas.height - 220, 50, 50);
        this.ctx.fillText(this.player.inventory.onion.toString(), 65, this.ctx.canvas.height - 190);
        this.ctx.drawImage(this.assets.carrot, 10, this.ctx.canvas.height - 180, 50, 50);
        this.ctx.fillText(this.player.inventory.carrot.toString(), 65, this.ctx.canvas.height - 150);
        this.ctx.drawImage(this.assets.potato, 10, this.ctx.canvas.height - 140, 50, 50);
        this.ctx.fillText(this.player.inventory.potato.toString(), 65, this.ctx.canvas.height - 110);
        this.ctx.drawImage(this.assets.rock, 10, this.ctx.canvas.height - 100, 50, 50);
        this.ctx.fillText(this.player.inventory.stone.toString(), 65, this.ctx.canvas.height - 70);
        this.ctx.drawImage(this.assets.loglarge, 10, this.ctx.canvas.height - 60, 50, 50);
        this.ctx.fillText(this.player.inventory.wood.toString(), 65, this.ctx.canvas.height - 30);
        if (this.enemies.length > 0) {
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "white";
            this.ctx.font = "20px Arial";
            this.ctx.fillText(this.enemies.length + " debt collectors remaining", this.ctx.canvas.width / 2, this.ctx.canvas.height - 30);
        }
        if (this.currentInstruction < 6) {
            this.ctx.textAlign = "center";
            this.ctx.font = "bold 15px Arial";
            this.ctx.fillStyle = "black";
            for (var i = 0; i < this.instructionText.length; i++) {
                this.ctx.fillText(this.instructionText[i], this.rpx(this.instructionX) + 150, this.rpy(this.instructionY) - (80 - 20 * i));
            }
            if (this.showArrow) {
                this.ctx.lineWidth = 8;
                this.ctx.beginPath();
                this.ctx.lineTo(this.rpx(this.instructionX) + 25, this.rpy(this.instructionY) + 25);
                this.ctx.lineTo(this.rpx(this.instructionX) + 90, this.rpy(this.instructionY) - 40);
                this.ctx.stroke();
            }
        }
        if (this.newItemUnlocked) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "white";
            this.ctx.font = "30px Courier New";
            this.ctx.fillText("New item unlocked!", this.ctx.canvas.width / 2, 100);
            this.ctx.font = "50px Courier New";
            this.ctx.fillText(this.newItemName, this.ctx.canvas.width / 2, 160);
            this.ctx.drawImage(this.newItemImage, this.ctx.canvas.width / 2 - 200, this.ctx.canvas.height / 2 - 200, 400, 400);
            this.ctx.font = "30px Courier New";
            this.ctx.fillText(this.newItemText[0], this.ctx.canvas.width / 2, this.ctx.canvas.height - 200);
            this.ctx.fillText(this.newItemText[1], this.ctx.canvas.width / 2, this.ctx.canvas.height - 160);
            this.ctx.fillText("Press space to continue", this.ctx.canvas.width / 2, this.ctx.canvas.height - 100);
        }
        if (this.inIntro) {
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.fillStyle = "white";
            switch (this.introStage) {
                case 0:
                    this.ctx.font = "70px Arial";
                    this.ctx.fillText("The Gardener", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
                    break;
                case 1:
                    this.ctx.font = "30px Arial";
                    this.ctx.fillText("Oh no! Interest rates are rising, and you can't pay your mortgage!", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
                    break;
                case 2:
                    this.ctx.font = "30px Arial";
                    this.ctx.fillText("Those pesky debt collectors are going to take your house!", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
                    break;
                case 3:
                    this.ctx.font = "30px Arial";
                    this.ctx.fillText("You do have gardening skills - maybe those will help?", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
                    break;
            }
            this.ctx.font = "30px Courier New";
            this.ctx.fillText("Press space to continue", this.ctx.canvas.width / 2, this.ctx.canvas.height - 100);
        }
        if (this.gameOver) {
            this.gameOverOpacity = Math.min(1, this.gameOverOpacity + 0.005);
            this.ctx.fillStyle = "rgba(0, 0, 0, " + this.gameOverOpacity + ")";
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.font = "60px Courier New";
            this.ctx.fillStyle = "white";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Game over", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
            if (this.gameOverOpacity === 1) {
                this.ctx.font = "30px Courier New";
                this.ctx.fillText("The debt collectors have foreclosed your house...", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 100);
                this.ctx.fillText("Total debt collectors killed: " + this.score, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2 + 150);
            }
        }
    };
    Game.prototype.playNextShoot = function () {
        if (this.currentShoot >= 3) {
            this.currentShoot = 0;
        }
        switch (this.currentShoot) {
            case 0:
                this.audio.shoot1.play();
                break;
            case 1:
                this.audio.shoot2.play();
                break;
            case 2:
                this.audio.shoot3.play();
                break;
        }
        this.currentShoot++;
    };
    Game.prototype.generateEnemies = function () {
        var total = Math.round(Math.pow(this.day, 1.35));
        if (this.day === 2) {
            total = 2;
        }
        while (total-- > 0) {
            do {
                var angle = Math.random() * Math.PI * 2;
                var x = Math.cos(angle) * (Math.floor(Math.random() * 300) + 1700) + this.house.x;
                var y = Math.sin(angle) * (Math.floor(Math.random() * 300) + 1700) + this.house.y;
            } while (x < -this.world.width * 25 || y < -this.world.height * 25 || x > this.world.width * 25 || y > this.world.height * 25);
            if (this.day >= 3 && total > 3 && Math.random() < 0.5) {
                this.enemies.push(new LargeZombie(x, y));
                total -= 3;
            }
            else {
                this.enemies.push(new Zombie(x, y));
            }
        }
    };
    Game.prototype.rpx = function (x) {
        return x - this.player.x + this.ctx.canvas.width / 2;
    };
    Game.prototype.rpy = function (y) {
        return y - this.player.y + this.ctx.canvas.height / 2;
    };
    Game.prototype.onmousemove = function (event) {
        this.mousePosX = event.clientX;
        this.mousePosY = event.clientY;
    };
    Game.prototype.onmousedown = function (event) {
        if (this.newItemUnlocked || this.inIntro) {
            return;
        }
        this.mouseDown = true;
        var mouseX = Math.floor((this.mousePosX - this.ctx.canvas.width / 2 + this.player.x) / 50);
        var mouseY = Math.floor((this.mousePosY - this.ctx.canvas.height / 2 + this.player.y) / 50);
        if (this.selectedTile !== null) {
            for (var _i = 0, _a = this.tileOptions; _i < _a.length; _i++) {
                var option = _a[_i];
                var x = this.rpx((this.selectedTile.x - this.world.width / 2) * 50) + option.x;
                var y = this.rpy((this.selectedTile.y - this.world.height / 2) * 50) + option.y;
                if (dist(this.mousePosX, this.mousePosY, x, y) <= 30) {
                    if (option.id === "plant") {
                        this.tileOptions = [
                            { x: -40, y: 25, text: ["Potato"], id: "potato" },
                            { x: 90, y: 25, text: ["Carrot"], id: "carrot" }
                        ];
                    }
                    if (option.id === "build") {
                        this.tileOptions = [
                            { x: -40, y: 25, text: ["Potato", "launcher"], id: "potatolauncher" },
                            { x: 90, y: 25, text: ["Carrot", "cannon"], id: "carrotcannon" },
                            { x: 25, y: -40, text: ["Homing", "onions"], id: "homingonions" }
                        ];
                    }
                    if (option.id === "harvest") {
                        var entity = this.world.findEntityAtPos(this.selectedTile.displayX, this.selectedTile.displayY);
                        if (!entity) {
                            this.tileOptions = [];
                            return;
                        }
                        this.harvestingEntity = entity;
                        this.harvestingTime = 0;
                        this.tileOptions = [];
                        this.selectedTile = null;
                    }
                    if (option.id === "destroy") {
                        var building = this.world.findBuildingAtPos(this.selectedTile.displayX, this.selectedTile.displayY);
                        this.world.removeBuilding(building);
                        this.tileOptions = [];
                        this.selectedTile = null;
                    }
                    if (option.id === "restock") {
                        var building = this.world.findBuildingAtPos(this.selectedTile.displayX, this.selectedTile.displayY);
                        var needed = building.maxStorage - building.storage;
                        var item = "";
                        if (building instanceof PotatoLauncher) {
                            item = "potato";
                        }
                        else if (building instanceof CarrotCannon) {
                            item = "carrot";
                        }
                        else {
                            item = "onion";
                        }
                        var toGive = Math.min(this.player.inventory[item], needed);
                        this.player.inventory[item] -= toGive;
                        building.storage += toGive;
                        this.messages.push({ x: building.x, y: building.y, text: "- " + toGive + " " + item, time: 120 });
                        this.selectedTile = null;
                        this.tileOptions = [];
                    }
                    if (option.id === "potatolauncher" || option.id === "carrotcannon" || option.id === "homingonions" ||
                        option.id === "potato" || option.id === "carrot" || option.id === "onion") {
                        for (var cost in buildingCosts[option.id]) {
                            if (this.player.inventory[cost] < buildingCosts[option.id][cost]) {
                                return;
                            }
                        }
                        for (var cost in buildingCosts[option.id]) {
                            this.player.inventory[cost] -= buildingCosts[option.id][cost];
                        }
                        switch (option.id) {
                            case "potatolauncher":
                                this.world.buildings.push(new PotatoLauncher(this.selectedTile.displayX, this.selectedTile.displayY));
                                if (this.currentInstruction === 4) {
                                    this.currentInstruction++;
                                    this.instructionText = ["Now that your base is defended, make sure to", "explore and find new resources."];
                                    this.instructionX = this.house.x + 150;
                                    this.instructionY = this.house.y - 50;
                                }
                                break;
                            case "carrotcannon":
                                this.world.buildings.push(new CarrotCannon(this.selectedTile.displayX, this.selectedTile.displayY));
                                break;
                            case "homingonions":
                                this.world.buildings.push(new HomingOnions(this.selectedTile.displayX, this.selectedTile.displayY));
                                break;
                            case "potato":
                                this.world.entities.push(new PotatoPlant(this.selectedTile.displayX, this.selectedTile.displayY, 0, true));
                                if (this.currentInstruction === 3) {
                                    this.currentInstruction++;
                                    this.instructionText = ["When you have collected enough resources, click on a tile,", "press 'build' and select 'potato launcher'", "in a spot close to your base.", "", "Press space to skip to next message."];
                                    this.instructionX = this.house.x + 150;
                                    this.instructionY = this.house.y - 50;
                                    this.showArrow = false;
                                }
                                break;
                            case "carrot":
                                this.world.entities.push(new CarrotPlant(this.selectedTile.displayX, this.selectedTile.displayY, 0, true));
                                break;
                        }
                        this.tileOptions = [];
                        this.selectedTile = null;
                    }
                    return;
                }
            }
        }
        if (mouseX >= -this.world.width / 2 && mouseX <= this.world.width / 2 &&
            mouseY >= -this.world.height / 2 && mouseY <= this.world.height / 2) {
            if (dist(mouseX * 50, mouseY * 50, this.player.x, this.player.y) > 600) {
                this.messages.push({ x: mouseX * 50, y: mouseY * 50, text: "Too far away", time: 120 });
                return;
            }
            if (Math.abs(mouseX * 50 - this.house.x) <= 100 && Math.abs(mouseY * 50 - this.house.y) <= 150) {
                return;
            }
            this.selectedTile = this.world.grid[mouseX + this.world.width / 2][mouseY + this.world.width / 2];
            this.tileOptions = [];
            var entity = this.world.findEntityAtPos(this.selectedTile.displayX, this.selectedTile.displayY);
            if (this.selectedTile.type === "grass") {
                this.tileOptions = [
                    { x: -40, y: 25, text: ["Build"], id: "build" }
                ];
                if (entity === null) {
                    this.tileOptions.push({ x: 90, y: 25, text: ["Plant"], id: "plant" });
                }
            }
            if (entity !== null) {
                if (entity instanceof PotatoPlant || entity instanceof CarrotPlant || entity instanceof OnionPlant) {
                    if (entity.stage === 2) {
                        this.tileOptions.push({ x: 25, y: -40, text: ["Harvest"], id: "harvest" });
                    }
                }
                else {
                    this.tileOptions.push({ x: 25, y: -40, text: ["Harvest"], id: "harvest" });
                }
            }
            var building = this.world.findBuildingAtPos(this.selectedTile.displayX, this.selectedTile.displayY);
            if (building !== null) {
                this.tileOptions = [{ x: -40, y: 25, text: ["Destroy"], id: "destroy" }];
                if ((building instanceof PotatoLauncher || building instanceof CarrotCannon || building instanceof HomingOnions)
                    && building.storage < building.maxStorage) {
                    this.tileOptions.push({ x: 90, y: 25, text: ["Restock"], id: "restock" });
                }
            }
        }
    };
    Game.prototype.onmouseup = function (event) {
        this.mouseDown = false;
    };
    Game.prototype.onkeydown = function (event) {
        this.keys[event.key.toLowerCase()] = true;
        if (event.key === " ") {
            this.newItemUnlocked = false;
            this.introStage++;
            if (this.introStage === 4) {
                this.inIntro = false;
                this.audio.music1.play();
                this.audio.music1.volume = 0.2;
                this.instructionText = ["Click on a potato plant,", "and press 'harvest'."];
                this.instructionX = this.house.x + 150;
                this.instructionY = this.house.y - 50;
                this.currentInstruction = 1;
            }
            if (this.currentInstruction === 4) {
                this.currentInstruction++;
                this.instructionText = ["Now that your base is defended, make sure to", "explore and find new resources.", "", "Press space to dismiss."];
                this.instructionX = this.house.x + 150;
                this.instructionY = this.house.y - 50;
            }
            else if (this.currentInstruction === 5) {
                this.instructionText = [];
            }
        }
    };
    Game.prototype.onkeyup = function (event) {
        this.keys[event.key.toLowerCase()] = false;
    };
    return Game;
}());
function getImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}
function getAudio(src) {
    var audio = new Audio();
    audio.src = src;
    return audio;
}
