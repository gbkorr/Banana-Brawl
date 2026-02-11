function setup() {
	createCanvas(1000, 600);
	halfWidth = 500;
	halfHeight = 300;
	background(100);
	frameRate(60);

	let context = canvas.getContext('2d');
	context.imageSmoothingEnabled = false;
}
let halfWidth;
let halfHeight;

//helper functions
function trilength(a, b) {
	return sqrt(a * a + b * b);
}

function positiveAngle(angle) {
	return ((angle % (2 * PI) + 2 * PI) % (2 * PI));
}

function angleTo(x1, y1, x2, y2) {
	return (positiveAngle(acos((x2 - x1) / trilength(x1 - x2, y1 - y2)) * Math.sign(y2 - y1)));
}

function angleDifference(a1, a2) {
	let baseDiff = a2 - a1;
	return ((baseDiff + Math.sign(baseDiff) * PI) % (2 * PI) - Math.sign(baseDiff) * PI);
}

function boxCollide(object1, object2) {
	if (object1.x + object1.width > object2.x - object2.width &&
		object1.x - object1.width < object2.x + object2.width &&
		object1.y + object1.height > object2.y - object2.height &&
		object1.y - object1.height < object2.y + object2.height
	) {
		return (true);
	}
} //widths and heights should always be HALF
function snapCollide(object, collision) {
	//horizontal collision
	if (object.y + object.height > collision.y - collision.height && object.y - object.height < collision.y + collision.height) {
		//left wall
		if (object.x + object.width <= collision.x - collision.width && object.x + object.width + object.vx > collision.x - collision.width) {
			if (object.hitstun) {
				object.vx = -object.vx / 2;
				object.hitlag = 3 + floor(abs(object.vy / 10));
			} else object.vx = 0;
			object.x = collision.x - collision.width - object.width;
		}
		//right wall
		else if (object.x - object.width >= collision.x + collision.width && object.x - object.width + object.vx < collision.x + collision.width) {
			if (object.hitstun) {
				object.vx = -object.vx / 2;
				object.hitlag = 3 + floor(abs(object.vy / 10));
			} else object.vx = 0;
			object.x = collision.x + collision.width + object.width;
		}
	}
	//vertical collision
	else if (object.x + object.width > collision.x - collision.width && object.x - object.width < collision.x + collision.width) {
		//floor
		if (object.y - object.height >= collision.y + collision.height && object.y - object.height + object.vy < collision.y + collision.height) {
			if (object.hitstun && object.vy < -10) {
				object.vy = -object.vy / 2;
				object.hitlag = 3 + floor(abs(object.vy / 5));
			} else object.vy = 0;
			object.y = collision.y + collision.height + object.height;
			object.grounded = true;
			if (object.currentAnimation) object.changeAnimation("idle");
		}
		//ceiling
		else if (object.y + object.height <= collision.y - collision.height && object.y + object.height + object.vy > collision.y - collision.height) {
			if (object.hitstun) {
				object.vy = -object.vy / 2;
				object.hitlag = 3 + floor(abs(object.vy / 10));
			} else object.vy = 0;
			object.y = collision.y - collision.height - object.height;
		}
	}
	//prevent corner-clipping
	else if (object.x + object.width + object.vx > collision.x - collision.width && object.x - object.width + object.vx < collision.x + collision.width && object.y + object.height + object.vy > collision.y - collision.height && object.y - object.height + object.vy < collision.y + collision.height) {
		object.vy = 0;
	}
}

let spriteSize = 32;

function animatedSprite(data) { //size, customSize, spriteSheet, frame, frameRate, animation) { //animation is a number
	image(data.spriteSheet, 0, 0, data.size * 2, data.size * 2, (data.customSize || spriteSize) * floor(data.frame * (data.frameRate / 60)), (data.customSize || spriteSize) * data.animation, (data.customSize || spriteSize), (data.customSize || spriteSize));
}

//keybind stuff
let keyActions = ["left", "right", "up", "down", "jump", "attack"];
let keyCodes = {
	0: { //player1
		left: 65,
		right: 68,
		up: 87,
		down: 83,

		jump: 16,
		attack: 70,
	},
	1: { //player2
		left: 74,
		right: 76,
		up: 73,
		down: 75,

		jump: 66,
		attack: 222,
	}
};
let keyValues = {
	0: {},
	1: {}
};
let keyBuffer = {
	0: {},
	1: {},
};
let buffer = 3;

function buttonsPressed() {
	for (let index = 0; index < keyActions.length; index++) {
		//player1
		if (keyIsDown(keyCodes[0][keyActions[index]])) {
			if (keyValues[0][keyActions[index]] <= 1) {
				keyValues[0][keyActions[index]]++;
			}
			if (keyBuffer[0][keyActions[index]] >= 0 || keyBuffer[0][keyActions[index]] == undefined) keyBuffer[0][keyActions[index]] = buffer;
		} else {
			keyValues[0][keyActions[index]] = 0;
			if (keyBuffer[0][keyActions[index]] > 0) keyBuffer[0][keyActions[index]]--;
			else if (keyBuffer[0][keyActions[index]] == -1) keyBuffer[0][keyActions[index]] = 0;
		}

		//player2
		if (keyIsDown(keyCodes[1][keyActions[index]])) {
			if (keyValues[1][keyActions[index]] <= 1) {
				keyValues[1][keyActions[index]]++;
			}
			if (keyBuffer[1][keyActions[index]] >= 0 || keyBuffer[1][keyActions[index]] == undefined) keyBuffer[1][keyActions[index]] = buffer;
		} else {
			keyValues[1][keyActions[index]] = 0;
			if (keyBuffer[1][keyActions[index]] > 0) keyBuffer[1][keyActions[index]]--;
			else if (keyBuffer[1][keyActions[index]] == -1) keyBuffer[1][keyActions[index]] = 0;
		}
	}
}

function camera_() {
	this.x = 0;
	this.y = 1000;
	this.zoom = 0.5;
	this.vx = 0;
	this.vy = 0;
	this.maxSpeed = 10;

	this.trackPlayer = function(player) {
		this.x = -player.x;
		this.y = player.y;
	}
	this.followPlayer = function(player) {
		this.vx = (player.x - this.x) / 100;
		this.vy = player.y - this.y;
	} //doesn't currently work

	this.trackPlayers = function() {
		if (player1.respawning < 80 && player2.respawning < 80) {
			this.vx += Math.sign((player1.x + player2.x) / 2 - this.x - this.vx * 10);
			this.vy += Math.sign((player1.y + player2.y) / 2 - this.y - this.vy * 10);
		}
	};

	this.process = function() {
		if (abs(this.vx) > this.maxSpeed) this.vx = Math.sign(this.vx) * this.maxSpeed;
		if (abs(this.vy) > this.maxSpeed) this.vy = Math.sign(this.vy) * this.maxSpeed;
		this.x += this.vx;
		this.y += this.vy;

		if (this.x + halfWidth / this.zoom + 50 > blastX) this.x = blastX - halfWidth / this.zoom - 50;
		if (this.x - halfWidth / this.zoom - 50 < -blastX) this.x = -blastX + halfWidth / this.zoom + 50;
		if (this.y - halfHeight / this.zoom - 50 < 0) this.y = halfHeight / this.zoom + 50;
		if (this.y + halfHeight / this.zoom + 50 > blastY) this.y = blastY - halfHeight / this.zoom - 50;
	}
}
let currentCamera = new camera_();

function hitbox(data) { //owner, start, end, relativeX, relativeY, width, height, hitlag, hitstun, damage, angle, strength, scaling, effect) {
	this.owner = data.owner;
	this.x = this.owner.x + data.x * this.owner.facing;
	this.y = this.owner.y + data.y;
	this.width = data.width;
	this.height = data.height;

	if (this.owner.attackTimer >= data.start && this.owner.attackTimer < data.end) {
		fill(255, 100, 100);
		stroke(100, 0, 0);
		if (showHitboxes) rect(this.x - this.width, this.y - this.height, this.width * 2, this.height * 2);

		if (boxCollide(this, this.owner.opponent) && !this.owner.hitOpponent && !this.owner.opponent.intangible) {
			this.owner.hitOpponent = true;
			this.owner.hitlag = data.hitlag;
			this.owner.opponent.getHit({
				hitlag: data.hitlag,
				hitstun: data.hitstun,
				damage: data.damage,
				direction: this.owner.facing,
				angle: data.angle,
				strength: data.strength,
				scaling: data.scaling
			});
			if (data.effect) data.effect(this.owner);
		}
	}
}

let animationHierarchy = ["hitstun", "doubleJump", "jump", "crouchGetup", "crouchStart", "crouch", "stop", "run", "hitlag", "idle", "freefall"];

let driftFactor = 0.4; //acceleration while in hitstun
let hitstunGravity = 0.5; //gravity while in hitstun

let matchStartTimer = 0;
function player(type) {
	{
		this.opponent; //define this at the start of the match when x and y are set
		this.playerNum; //which player? binary
		this.type = type;

		this.x;
		this.y;
		this.vx = 0;
		this.vy = 0;

		this.width = characterData[this.type]["width"];
		this.height = characterData[this.type]["height"];
		this.spriteSize = characterData[this.type]["spriteSize"];
		this.facing = 1; //1 or -1

		this.fallSpeed = characterData[this.type]["fallSpeed"];
		this.gravity = characterData[this.type]["gravity"];
		this.jumpStrength = characterData[this.type]["jumpStrength"];
		this.doubleJumpStrength = characterData[this.type]["doubleJumpStrength"];
		this.acceleration = characterData[this.type]["acceleration"];
		this.maxSpeed = characterData[this.type]["maxSpeed"];
		this.friction = characterData[this.type]["friction"];
		this.airAcceleration = characterData[this.type]["airAcceleration"];
		this.airMaxSpeed = characterData[this.type]["airMaxSpeed"];
		this.jumpNumber = characterData[this.type]["jumpNumber"];
		this.weight = characterData[this.type]["weight"];

		this.grounded = true; //set to false when jumping, to true upon collision with floor
		this.invincible = false;
		this.intangible = false;
		this.projectileIntangible = false;
		this.respawning = 0;
		this.armor = 0;
		this.usedSpecial = false;
		this.hitlag = 0;
		this.hitstun = 0;
		this.jumps = this.jumpNumber;
		this.crouching = false;
		this.stun = false;
		this.speedModifier = 1; //speed modifier
		this.speedTimer = 0; //when the speed mod wears off

		this.damage = 0;
		this.meter = 0;
		this.meterMax = characterData[this.type]["meterMax"]; //don't draw if undefined

		this.attackTimer = 0;
		this.currentAttack = undefined;
		this.hitOpponent = false; //manipulated to prevent the player from hitting the opponent with the same attack every frame

		this.currentAnimation = "idle";
		this.lastAnimation = "idle";
		this.animationTimer = 0;

		this.passive = characterData[this.type]["passive"];
		this.doubleJump = characterData[this.type]["doubleJump"];
	}

	this.move = function() {
		if (this.vy > this.fallSpeed) this.vy -= this.hitstun ? hitstunGravity : this.gravity;

		//check collision
		this.grounded = false;
		for (let index = 0; index < collisionList.length; index++) {
			snapCollide(this, collisionList[index]);
		}

		this.x += this.vx;
		this.y += this.vy;
	}

	this.process = function() {

		if (!this.hitlag && !this.respawning) {
			this.move();

			if (this.currentAttack) {
				this.currentAttack(this);
				this.attackTimer++;
			}

			if (this.speedTimer) this.speedTimer--;
			else this.speedModifier = 1;
			this.maxSpeed = characterData[this.type]["maxSpeed"] * this.speedModifier; //this doesn't need to call all the time
			this.airMaxSpeed = characterData[this.type]["airMaxSpeed"] * this.speedModifier;

			if (this.hitstun) {
				this.hitstun--;
				if (trilength(this.vx,this.vy) > 20 && this.hitstun % floor(random(4,7)) == 0) singleParticle({
					x: this.x,
					y: this.y,
					size: random(100,180),
					sprite: "bananaparticle_small",
					vx: 0,
					vy: 0,
					age: 20,
					back: 0,
					spin: random(-0.02,0.02),
					direction: 1,
				}); //dust trail; make new sprite?
			}
			else if (this.stun) this.stun--;
			if (this.invincible) this.invincible--;
			if (this.intangible) this.intangible--;
			if (this.projectileIntangible) this.projectileIntangible--;


			if (characterSprites[this.type]) this.processAnimations();
		}

		this.passive(this);

		if (this.hitlag) this.hitlag--;
		if (this.respawning) this.respawning--;
		if (this.respawning == 1) this.intangible = this.intangible = 120; //2 seconds of intangibility after respawning
		else if (this.respawning == 80) this.y = 1400;

		if (this.grounded) {
			this.jumps = this.jumpNumber;
			this.usedSpecial = false;
		}

		this.draw();
	}

	this.getHit = function(data) { //hitlag, hitstun, damage, direction, angle, strength, scaling) {
		let scaledStrength = (data.strength + this.damage * data.scaling) * (100 / this.weight);
		if (this.crouching) scaledStrength /= 2;

		this.hitlag = data.hitlag + floor(scaledStrength / 10);

		if (!this.invincible) {
			this.damage += data.damage;
			totalDamage[this.playerNum] += data.damage;
			if (this.armor != -1 && this.armor <= data.damage) {
				this.hitstun = data.hitstun + floor(this.damage * data.scaling);
				this.endAttack();
				this.currentAnimation = ("hitlag");

				this.vx = data.direction * scaledStrength * cos(data.angle);
				this.vy = scaledStrength * sin(data.angle);

				if (data.damage < 6) particleBurst({
					x: this.x,
					y: this.y,
					size: 150,
					sprite: "bananaparticle_small",
					quantity: floor(random(2, 6)),
					angle: data.direction == 1 ? data.angle : PI - data.angle,
					angleVariation: 0.4,
					speed: 6,
					speedVariation: 2,
					age: 30,
					ageVariation: 5,
					yDiff: 1,
					frontChance: 1,
					spin: 0.03
				});
				else if (data.damage < 14) particleBurst({
					x: this.x,
					y: this.y,
					size: 200,
					sprite: "bananaparticle_small",
					quantity: floor(random(4, 7)),
					angle: data.direction == 1 ? data.angle : PI - data.angle,
					angleVariation: 0.4,
					speed: 6,
					speedVariation: 4,
					age: 30,
					ageVariation: 5,
					yDiff: 1,
					frontChance: 1,
					spin: 0.02
				});
				else {
					particleBurst({
						x: this.x,
						y: this.y,
						size: 200,
						sprite: "bananaparticle_small",
						quantity: floor(random(4, 6)),
						angle: data.direction == 1 ? data.angle : PI - data.angle,
						angleVariation: 0.4,
						speed: 8,
						speedVariation: 6,
						age: 30,
						ageVariation: 5,
						yDiff: 1,
						frontChance: 1,
						spin: 0.03
					});
					particleBurst({
						x: this.x,
						y: this.y,
						size: 200,
						sprite: "bananaparticle_large",
						quantity: floor(random(2, 4)),
						angle: data.direction == 1 ? data.angle : PI - data.angle,
						angleVariation: 0.4,
						speed: 8,
						speedVariation: 4,
						age: 30,
						ageVariation: 5,
						yDiff: 1,
						frontChance: 1,
						spin: 0.02
					});
				}

				this.usedSpecial = false;
				this.crouching = false;
				this.armor = 0;
				this.grounded = false;
			}
		}
	}

	this.die = function() {
		stocks[this.playerNum] --;
		let blastAngle = 0;
		if (this.x > blastX) blastAngle = PI;
		else if (this.x < -blastX) blastAngle = 0;
		else if (this.y < 0) blastAngle = PI / 2;
		else blastAngle = 3 * PI / 2;
		particleBurst({
			x: this.x,
			y: this.y,
			size: 200,
			sprite: "bananaparticle_small",
			quantity: floor(random(8, 12)),
			angle: blastAngle,
			angleVariation: 0.2,
			speed: 18,
			speedVariation: 8,
			age: 30,
			ageVariation: 5,
			yDiff: 1,
			frontChance: 1,
			spin: 0.02
		});
		particleBurst({
			x: this.x,
			y: this.y,
			size: 400,
			sprite: "bananaparticle_large",
			quantity: floor(random(2, 6)),
			angle: blastAngle,
			angleVariation: 0.2,
			speed: 18,
			speedVariation: 8,
			age: 30,
			ageVariation: 5,
			yDiff: 1,
			frontChance: 1,
			spin: 0.02
		});
		particleBurst({
			x: this.x,
			y: this.y,
			size: 200,
			sprite: "peel",
			quantity: floor(random(2, 4)),
			angle: blastAngle,
			angleVariation: 0.2,
			speed: 10,
			speedVariation: 8,
			age: 60,
			ageVariation: 5,
			yDiff: 1,
			frontChance: 1,
			spin: random(0.05, 0.2)
		});

		this.x = 0;
		this.y = 10000;
		this.vx = 0;
		this.vy = 0;
		this.hitstun = 0;
		this.respawning = 120;
		this.intangible = true;
		this.damage = 0;
		this.currentAttack = undefined;
		this.attackTimer = 0;
		this.jumps = this.jumpNumber;
		this.currentAnimation = "freefall";
		this.animationTimer = 0;
		this.usedSpecial = true;
	}

	this.control = function() {
		if (!this.respawning && !matchStartTimer) {
			if (!this.hitstun) {
				if (!this.currentAttack) {
					//ground movement
					if (this.grounded) {
						if (keyValues[this.playerNum]["left"] && !keyValues[this.playerNum]["right"]) {
							this.changeAnimation("run");
							if (this.vx - this.acceleration > -this.maxSpeed) {
								this.vx -= this.acceleration;
							} else this.vx = -this.maxSpeed;
							this.facing = -1;
							if (random(0, 1) < 0.15) singleParticle({
								x: this.x,
								y: this.y - this.height,
								size: 100,
								sprite: "run",
								vx: 0.1,
								vy: 2,
								age: 30,
								back: 1,
								spin: 0.01,
							});
						} else if (keyValues[this.playerNum]["right"] && !keyValues[this.playerNum]["left"]) {
							this.changeAnimation("run");
							if (this.vx + this.acceleration < this.maxSpeed) {
								this.vx += this.acceleration;
							} else this.vx = this.maxSpeed;
							this.facing = 1;
							if (random(0, 1) < 0.15) singleParticle({
								x: this.x,
								y: this.y - this.height,
								size: 100,
								sprite: "run",
								vx: -0.1,
								vy: 2,
								age: 30,
								back: 1,
								spin: 0.01,
							});
						} else if (abs(this.vx) >= this.friction) {
							this.changeAnimation("stop");
							this.vx -= Math.sign(this.vx) * this.friction;
						} else {
							//this.changeAnimation("idle");
							this.vx = 0;
						}
					}

					//crouch
					if (this.grounded && keyValues[this.playerNum]["down"] && !keyValues[this.playerNum]["left"] && !keyValues[this.playerNum]["right"]) {
						if (!this.crouching) this.changeAnimation("crouchStart");
						this.crouching = true;
					} else {
						if (this.crouching) this.changeAnimation("crouchGetup");
						this.crouching = false;
					}

					//jump
					if (keyBuffer[this.playerNum]["jump"] > 0) {
						keyBuffer[this.playerNum]["jump"] = -1;
						if (this.grounded) {
							this.changeAnimation("jump");
							this.grounded = false;
							this.vy = this.jumpStrength;

						} else if (this.jumps) {
							if (keyValues[this.playerNum]["left"] && !keyValues[this.playerNum]["right"]) {
								this.vx = -this.airMaxSpeed;
							} else if (keyValues[this.playerNum]["right"] && !keyValues[this.playerNum]["left"]) {
								this.vx = this.airMaxSpeed;
							}
							this.changeAnimation("doubleJump");
							if (this.doubleJump) this.doubleJump(this);
							else {
								this.vx = 0;
								this.vy = this.doubleJumpStrength;

								singleParticle({
									x: this.x,
									y: this.y - this.height / 2,
									size: 200,
									sprite: "doubleJump",
									vx: 0,
									vy: 0,
									age: 30,
									back: 1,
									spin: 0,
								});
							}
							this.jumps--;
						}
					}

					//ATTAAAAAAACK!
					if (keyBuffer[this.playerNum]["attack"] > 0) {
						keyBuffer[this.playerNum]["attack"] = -1;
						this.hitOpponent = false;
						this.attackTimer = 0;

						if (keyValues[this.playerNum]["down"] && !keyValues[this.playerNum]["up"]) {
							if (this.grounded) this.currentAttack = attackData[this.type]["special_g"];
							else this.currentAttack = attackData[this.type]["special_a"];
						} else if (keyValues[this.playerNum]["up"] && !keyValues[this.playerNum]["down"]) {
							if (this.grounded) this.currentAttack = attackData[this.type]["high_g"];
							else this.currentAttack = attackData[this.type]["high_a"];
						} else if (keyValues[this.playerNum]["left"] && !keyValues[this.playerNum]["right"]) {
							if (this.grounded) this.currentAttack = attackData[this.type]["side_g"];
							else if (this.facing == -1) this.currentAttack = attackData[this.type]["front_a"];
							else this.currentAttack = attackData[this.type]["back_a"];
						} else if (keyValues[this.playerNum]["right"] && !keyValues[this.playerNum]["left"]) {
							if (this.grounded) this.currentAttack = attackData[this.type]["side_g"];
							else if (this.facing == 1) this.currentAttack = attackData[this.type]["front_a"];
							else this.currentAttack = attackData[this.type]["back_a"];
						} else if (this.grounded) this.currentAttack = attackData[this.type]["neutral_g"];
						else this.currentAttack = attackData[this.type]["neutral_a"];
					}
				}
				//airborne movement
				if (!this.grounded) {
					if (keyValues[this.playerNum]["left"] && !keyValues[this.playerNum]["right"]) {
						if (this.vx - this.airAcceleration > -this.airMaxSpeed) {
							this.vx -= this.airAcceleration;
						} else if (abs(this.vx) < this.airMaxSpeed) {
							this.vx = -this.airMaxSpeed;
						}
					} else if (keyValues[this.playerNum]["right"] && !keyValues[this.playerNum]["left"]) {
						if (this.vx + this.airAcceleration < this.airMaxSpeed) {
							this.vx += this.airAcceleration;
						} else if (abs(this.vx) < this.airMaxSpeed) {
							this.vx = this.airMaxSpeed;
						}
					}

				}
			} else {
				if (keyValues[this.playerNum]["left"] && !keyValues[this.playerNum]["right"]) this.vx -= this.airAcceleration * driftFactor;
				else if (keyValues[this.playerNum]["right"] && !keyValues[this.playerNum]["left"]) this.vx += this.airAcceleration * driftFactor;

				if (keyValues[this.playerNum]["down"] && !keyValues[this.playerNum]["up"]) this.vy -= this.airAcceleration * driftFactor;
				else if (keyValues[this.playerNum]["up"] && !keyValues[this.playerNum]["down"]) this.vy += this.airAcceleration * driftFactor;
			} //drift, not DI
		}
	} //currently no hitbox change on crouching

	this.endAttack = function(time) {
		if (this.attackTimer >= time || time == undefined) {
			this.currentAttack = undefined;
			this.attackTimer = 0;
		}
	}

	this.changeAttack = function(newAttack) {
		this.currentAttack = newAttack;
		this.attackTimer = 0;
	} //consider making this attackTimer = -1

	this.changeAnimation = function(animation) {
		if (!this.currentAttack && (animationHierarchy.indexOf(this.currentAnimation) > animationHierarchy.indexOf(animation) || animationHierarchy.indexOf(this.currentAnimation) == -1)) {
			this.currentAnimation = animation;
			this.animationTimer = 0;
		}
	}

	this.processAnimations = function() {
		if (this.lastAnimation !== this.currentAnimation) this.animationTimer = 0;
		this.lastAnimation = this.currentAnimation;

		if (this.currentAttack && this.attackTimer == 1) {
			this.currentAnimation = this.currentAttack.name;
			this.animationTimer = 0;
		}
		if (this.hitstun > 1) this.changeAnimation("hitstun");
		else if (this.hitstun == 1) this.currentAnimation = "freefall";

		this.animationTimer++;

		if (this.animationTimer > animationData[this.type][this.currentAnimation]["frames"] * 60 / animationData[this.type][this.currentAnimation]["frameRate"] - 1) {
			this.animationTimer = 0;
			this.currentAnimation = animationData[this.type][this.currentAnimation]["nextAnimation"];
		}

	}

	this.draw = function() {
		noStroke();
		if (this.intangible) fill(240 - this.playerNum * 100, 240, 140 + this.playerNum * 100);

		if (characterSprites[this.type]) {
			push();
			translate(this.x + this.facing * this.spriteSize, this.y + this.spriteSize * 2 - this.height);
			scale(-this.facing, -1);

			animatedSprite({
				size: this.spriteSize,
				spriteSheet: characterSprites[this.type],
				frame: this.animationTimer,
				frameRate: animationData[this.type][this.currentAnimation]["frameRate"],
				animation: animationData[this.type][this.currentAnimation]["index"],
			});

			pop();

			//player indicator + status
			if (showHitboxes) {
				stroke(255);
				if (this.intangible) {
					fill(255, 255, 255, 200);
					rect(this.x - 12, this.y + 108, 24, 24);
				}
				if (this.armor) {
					noFill();
					rect(this.x - 12, this.y + 108, 24, 24);
				}
			}
			fill(this.playerNum == 0 ? [50, 50, 255] : [255, 50, 50]);
			noStroke();
			ellipse(this.x, this.y + 120, 20, 20);

			//hurtbox
			noFill();
			stroke(255);
			if (showHitboxes) rect(this.x - this.width, this.y - this.height, this.width * 2, this.height * 2);
		} else {
			fill(200 - this.playerNum * 200, 100, this.playerNum * 200, 100);
			if (this.armor || this.invincible) fill(240, 240, 255);
			rect(this.x - this.width, this.y - this.height, this.width * 2, this.height * 2);
			fill(0);
			ellipse(this.x + this.facing * this.width / 2, this.y + this.height / 3, this.width / 2, this.width / 2);
		}

		if (this.cannonAngle != undefined) {
			stroke(0);
			noFill();
			line(this.x, this.y, this.x + this.facing * 100 * cos(this.cannonAngle), this.y + 100 * sin(this.cannonAngle));
		}
	}

}

let collisionList;
function collision(x, y, width, height, sprite) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.sprite = sprite;
}

function drawMap() {
	//background
	if (!showHitboxes){
		push();
		translate(-blastX,blastY); scale(1,-1);
		image(stageBackgrounds[stage],0,0,blastX * 2,blastY);
		pop();
	}

	for (let index = 0; index < collisionList.length; index++) {
		//stroke(0);
		//fill(200);

		push();
		translate(collisionList[index].x - collisionList[index].width, collisionList[index].y + collisionList[index].height);
		scale(1,-1);

		image(collisionSprites[collisionList[index].sprite],0,0, collisionList[index].width * 2, collisionList[index].height * 2);
		pop();
	}
}

let projectileList = [];

function projectile(data) {
	this.owner = data.owner;
	this.sprite = data.sprite;

	this.x = data.x;
	this.y = data.y;
	this.vx = this.owner.facing * data.speed * cos(data.initialAngle);
	this.vy = data.speed * sin(data.initialAngle);

	this.width = data.width;
	this.height = data.height;
	this.spriteSize = data.spriteSize;

	this.gravity = data.gravity;
	this.effect1 = data.effect1; //hitting opponent
	this.effect2 = data.effect2; //hitting collision
	this.effect3 = data.effect3; //before colliding

	this.hitlag = data.hitlag;
	this.hitstun = data.hitstun;
	this.damage = data.damage;
	this.angle = data.angle;
	this.strength = data.strength;
	this.scaling = data.scaling;
	
	this.age = data.age;
	this.dead = false;
	this.drawAngle = 0;

	this.tangible = data.tangible == false ? false : true;
	this.hitOpponent = false;

	this.move = function() {
		this.vy -= this.gravity;

		if (this.vy > this.fallSpeed) this.vy -= this.gravity;

		this.x += this.vx;
		this.y += this.vy;
	}

	this.process = function() {
		if (this.effect3) this.effect3(this);

		this.move();

		if (this.tangible && boxCollide(this, this.owner.opponent) && !this.owner.opponent.intangible && !this.hitOpponent && !this.owner.opponent.projectileIntangible) {
			this.owner.opponent.getHit({
				hitlag: this.hitlag,
				hitstun: this.hitstun,
				damage: this.damage,
				direction: Math.sign(this.vx),
				angle: this.angle,
				strength: this.strength,
				scaling: this.scaling
			});
			this.hitOpponent = true;
			if (this.effect1) this.effect1(this);
		}

		if (this.effect2)
			for (let index = 0; index < collisionList.length; index++) {
				if (boxCollide(this, collisionList[index])) this.effect2(this);
			}


		this.age--;
		if (this.age <= 0) this.dead = true;
	}

	this.draw = function() {
		push();
		translate(this.x, this.y);
		rotate(this.drawAngle);
		scale(-Math.sign(this.vx) || 1, -1);

		if (showHitboxes) {
			push();
			rotate(-Math.sign(this.vx) * this.drawAngle);
			noFill();
			stroke(255);
			rect(-this.width, -this.height, this.width * 2, this.height * 2);
			pop();
		}

		translate(-this.spriteSize, -this.spriteSize);

		animatedSprite({
			size: this.spriteSize,
			spriteSheet: projectileSprites[this.sprite],
			frame: 0,
			frameRate: 0,
			animation: 0,
		});

		pop();
	}
} //owner, age, sprite, spriteSize, x, y, width, height, initialAngle, speed, gravity, hitlag, hitstun, damage, angle, strength, scaling, effect1, effect2, effect3) {
//projectile sprites have to be oriented correctly (facing left);

let frontParticleList = [];
let backParticleList = [];
let particleList = [frontParticleList, backParticleList];

function particle(x, y, vx, vy, size, sprite, direction, life, rotation, spin, playerToFollow, effect) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.size = size;
	this.sprite = sprite;
	this.direction = direction;
	this.animationTimer = 0;
	this.age = life;
	this.spin = spin;
	this.rotation = rotation || 0;
	this.playerToFollow = playerToFollow;
	this.effect = effect;
}

function drawParticles(place) { //0 for front, 1 for back
	let newList = [];
	for (let index = 0; index < particleList[place].length; index++) {
		let currentParticle = particleList[place][index];

		if (currentParticle.playerToFollow) { //in this case, use VX and VY for offset
			currentParticle.x = currentParticle.playerToFollow.x;
			currentParticle.y = currentParticle.playerToFollow.y;
		}
		currentParticle.x += currentParticle.vx;
		currentParticle.y += currentParticle.vy;
		currentParticle.rotation += currentParticle.spin;

		if (currentParticle.effect) currentParticle.effect(currentParticle);

		push();
		translate(currentParticle.x, currentParticle.y);
		rotate(currentParticle.rotation);
		scale(-Math.sign(currentParticle.vx || 1) * (currentParticle.direction || 1), -1);
		translate(-currentParticle.size / 2, -currentParticle.size / 2);
		animatedSprite({
			size: currentParticle.size / 2,
			spriteSheet: particleSprites[currentParticle.sprite],
			frame: currentParticle.animationTimer,
			frameRate: particleAnimations[currentParticle.sprite] ? particleAnimations[currentParticle.sprite]["frameRate"] : 0,
			animation: 0,
			customSize: particleAnimations[currentParticle.sprite] ? particleAnimations[currentParticle.sprite].customSize : undefined,
		});

		pop();

		currentParticle.animationTimer++;
		if (particleAnimations[currentParticle.sprite] && particleAnimations[currentParticle.sprite]["loop"] && currentParticle.animationTimer >= particleAnimations[currentParticle.sprite]["frames"] * 60 / particleAnimations[currentParticle.sprite]["frameRate"]) currentParticle.animationTimer = 0;
		currentParticle.age--;
		if (currentParticle.age > 0) newList.push(currentParticle);
	}
	particleList[place] = newList;
}

function particleBurst(data) {
	for (let count = 0; count < data.quantity; count++) {
		let realAngle = data.angle + random(-data.angleVariation, data.angleVariation);
		let realSpeed = data.speed + random(-data.speedVariation, data.speedVariation);
		particleList[random(0, 1) < data.frontChance ? 0 : 1].push(new particle(data.x, data.y, realSpeed * cos(realAngle), data.yDiff * realSpeed * sin(realAngle), data.size, data.sprite, 1, data.age + random(-data.ageVariation, data.ageVariation), data.rotation, Math.sign(random(-1, 1)) * data.spin));
	}
} //x, y, size, sprite, quantity, angle, angleVariation, speed, speedVariation, age, ageVariation, yDiff, frontChance, rotation, spin, playerToFollow) 

function singleParticle(data) { 
	particleList[data.back || 0].push(new particle(data.x || 0, data.y || 0, data.vx, data.vy, data.size, data.sprite, data.direction, data.age, data.rotation, Math.sign(data.vx) * (data.spin || 0), data.playerToFollow, data.effect));
} //x,y,size,sprite,vx,vy,age,direction,back?,spin,playerToFollow,effect

let blastX = 1500;
let blastY = 1800; //base this on the stage!

function processScene() {
	player1.process();
	player2.process();

	let newList = [];
	for (let index = 0; index < projectileList.length; index++) {
		projectileList[index].process();
		if (!projectileList[index].dead) newList.push(projectileList[index]);
	}
	projectileList = newList;

	//DIE
	if (abs(player1.x) > blastX) player1.die();
	if (abs(player2.x) > blastX) player2.die();
	if (player1.y < 0) player1.die();
	if (player2.y < 0) player2.die();
	if (player1.y > blastY && player1.hitstun) player1.die();
	if (player2.y > blastY && player2.hitstun) player2.die();
}

function drawUI(){
	if (matchStartTimer) customText(floor((matchStartTimer + 59)/60).toString(),halfWidth - 50,halfHeight - 100,50);
	else {
		customText(player1.damage.toString(), 50, 50,50);
		customText(player2.damage.toString(), halfWidth * 2 - 190, 50,50);
			
		if (!trainingmode) customText(stocks[0] + " v " + stocks[1], 350, 50,50);
	
		//meter; MAKE FANCY SPRITE METER (different for each character?)
		fill(255);
		stroke(0);
		if (player1.meterMax) {
			noStroke();
			fill(floor(player1.meter) == floor(player1.meterMax) ? [100, 200, 100] : [100, 100, 200]);
			rect(50, 20, 160 * (player1.meter / player1.meterMax), 20);
		
			image(meters[player1.type],40, 18, 180, 24);
		}
		fill(255);
		stroke(0);
		if (player2.meterMax) {
			noStroke();
			fill(floor(player2.meter) == floor(player2.meterMax) ? [100, 200, 100] : [100, 100, 200]);
			rect(halfWidth * 2 - 210, 20, 160 * (player2.meter / player2.meterMax), 20);

			image(meters[player2.type],halfWidth * 2 - 220, 18, 180, 24);
		}
	
	}
}

function drawScene() {
	drawMap();

	drawParticles(1);

	for (let index = 0; index < projectileList.length; index++) {
		projectileList[index].draw();
	}

	player1.draw();
	player2.draw();

	drawParticles(0);
}

function processGame() {
	push();
	translate(halfWidth, halfHeight);
	translate(-currentCamera.x * currentCamera.zoom, currentCamera.y * currentCamera.zoom);
	scale(currentCamera.zoom, -currentCamera.zoom);

	player1.control();
	player2.control();

	processScene();

	currentCamera.trackPlayers();
	currentCamera.process();

	drawScene();

	pop();

	drawUI(); //over everything else
	
	if (matchStartTimer) matchStartTimer --;
	if (stocks[0] <= 0 || stocks[1] <= 0) {
		menuIndex = 0;
		winner = stocks[0] <= 0 ? 2 : 1;
		winnerCharacter = stocks[0] <= 0 ? player2.type : player1.type;
		gameState = "winscreen";
	}
}

let showHitboxes = 0
let player1;
let player2;

let totalDamage = [0,0];

let stocks = [5,5];
let stockAmount = 5; //I'd suggest 5

function setUpGame(p1character,p2character,stage) {
	projectileList = [];
	frontParticleList = [];
	backParticleList = [];
	particleList = [frontParticleList, backParticleList];
	totalDamage = [0,0];

	player1 = new player(p1character);
	player2 = new player(p2character);
	
	collisionList = stages[stage];

	matchStartTimer = trainingmode ? 0 : 180;
	stocks = trainingmode ? [9999,9999] : [stockAmount,stockAmount];
	
	player1.opponent = player2;
	player2.opponent = player1;
	player1.playerNum = 0;
	player2.playerNum = 1;

	player1.x = 400;
	player2.x = -400;
	player1.y = 1000;
	player2.y = 1000;

	currentCamera.x = 0;
	currentCamera.y = 1000;
}
			       																																				    																																				    																																				    																																				
			