
let attackData = {
	banannon: {
		neutral_g: function(self) {
			if (self.attackTimer == 8 && keyValues[self.playerNum]["attack"]) self.vx = self.facing * 15;
			if (self.attackTimer == 14 && self.vx) self.vx = 0;

			hitbox({
				owner: self,
				start: 12,
				end: 15,
				x: 50,
				y: 0,
				width: 40,
				height: 40,
				hitlag: 3,
				hitstun: 25,
				damage: 14,
				angle: PI / 4,
				strength: 20,
				scaling: 0.1
			});

			self.endAttack(20);
		},
		special_a: function(self) {

			hitbox({
				owner: self,
				start: 8,
				end: 25,
				x: 40,
				y: -30,
				width: 30,
				height: 30,
				hitlag: 3,
				hitstun: 30,
				damage: 6,
				angle: PI / 4,
				strength: 15,
				scaling: 0.1
			});
			hitbox({
				owner: self,
				start: 8,
				end: 25,
				x: -40,
				y: -30,
				width: 30,
				height: 30,
				hitlag: 3,
				hitstun: 30,
				damage: 6,
				angle: PI / 4,
				strength: 15,
				scaling: 0.1
			});

			if (self.grounded) {
				if (keyValues[self.playerNum]["attack"]) {
					particleBurst(self.x, self.y - self.height + 10, 150, "bananaparticle_small", floor(random(6, 10)), 0, 6, 16, 2, 10, 5, 0.2, 1, 0.03);
					self.changeAttack(attackData["banannon"]["dairLand"]);
				} else self.changeAttack(attackData["banannon"]["shortLand"]);
			}

			self.endAttack(30);
		},
		neutral_a: function(self) {
			hitbox({
				owner: self,
				start: 4,
				end: 10,
				x: 50,
				y: -20,
				width: 40,
				height: 40,
				hitlag: 3,
				hitstun: 30,
				damage: 6,
				angle: PI / 2 - 0.1,
				strength: 10,
				scaling: 0.1
			});

			if (this.grounded) self.changeAttack(attackData["banannon"]["shortLand"]);

			self.endAttack(30);
		},
		side_g: function(self) {
			if (self.attackTimer == 0) self.vx = self.facing * 8;

			hitbox({
				owner: self,
				start: 25,
				end: 35,
				x: 30,
				y: 0,
				width: 60,
				height: 60,
				hitlag: 3,
				hitstun: 20,
				damage: 16,
				angle: PI / 4,
				strength: 15,
				scaling: 0.4
			});

			if (self.attackTimer > 25) self.vx *= 0.9;
			self.endAttack(60);
		},
		front_a: function(self) {
			hitbox({
				owner: self,
				start: 7,
				end: 12,
				x: 50,
				y: -20,
				width: 40,
				height: 40,
				hitlag: 3,
				hitstun: 20,
				damage: 8,
				angle: PI / 5,
				strength: 18,
				scaling: 0.1
			});
			hitbox({
				owner: self,
				start: 12,
				end: 18,
				x: 50,
				y: 40,
				width: 30,
				height: 40,
				hitlag: 3,
				hitstun: 20,
				damage: 6,
				angle: PI / 4,
				strength: 20,
				scaling: 0.1
			});

			if (this.grounded) self.changeAttack(attackData["banannon"]["medLand"]);

			self.endAttack(30);
		},
		back_a: function(self) {
			hitbox({
				owner: self,
				start: 12,
				end: 16,
				x: -80,
				y: 0,
				width: 40,
				height: 20,
				hitlag: 3,
				hitstun: 25,
				damage: 13,
				angle: PI - PI / 5,
				strength: 2,
				scaling: 0.4
			});

			if (this.grounded) self.changeAttack(attackData["banannon"]["shortLand"]);

			self.endAttack(30);
		},
		special_g: function(self) {
			if (self.cannonTimer) {
				self.endAttack();
				return;
			}

			if (self.attackTimer < 5) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
				else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;
			}

			if (self.grounded) self.vx = 0;
			if (self.attackTimer == 0) self.cannonAngle = 0.3;

			if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) {
				if (abs(self.cannonAngle) <= PI / 2) self.cannonAngle += self.facing * 0.04;
			} else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) {
				if (abs(self.cannonAngle) <= PI / 2) self.cannonAngle -= self.facing * 0.04;
			}

			//cancel
			if (keyValues[self.playerNum]["up"]) {
				self.endAttack();
				self.cannonAngle = undefined;
			}

			if (self.attackTimer > 30 && !keyValues[self.playerNum]["attack"]) {
				singleParticle({
					x: self.x + self.facing * 50,
					y: self.y,
					size: 200,
					sprite: "banannonfire",
					vx: 0,
					vy: 0,
					age: 25,
					back: 0,
					spin: 0
				});
				projectileList.push(new projectile({
					owner: self,
					age: 600,
					sprite: "banannonball",
					x: self.x,
					y: self.y,
					width: 50,
					height: 30,
					spriteSize: 75,
					initialAngle: self.cannonAngle,
					speed: 15,
					gravity: 0.1,
					hitlag: 8,
					hitstun: 30,
					damage: 32,
					angle: PI / 4,
					strength: 10,
					scaling: 0.4,
					effect1: function(proj) {
						singleParticle({
							x: proj.x,
							y: proj.y,
							size: 500,
							sprite: "banannonfire",
							vx: 0,
							vy: 0,
							age: 25,
							back: 0,
							spin: 0
						});
						proj.dead = true;
					},
					effect2: function(proj) {
						singleParticle({
							x: proj.x,
							y: proj.y,
							size: 500,
							sprite: "banannonfire",
							vx: 0,
							vy: 0,
							age: 25,
							back: 0,
							spin: 0
						});
						//explosion
						if (trilength(self.opponent.x - proj.x, self.opponent.y - proj.y) < 200) {
							self.opponent.grounded = false;
							self.opponent.getHit({
								hitlag: 0,
								hitstun: 10,
								damage: 32,
								direction: Math.sign(self.opponent.x - proj.x),
								angle: atan(abs(self.opponent.y - proj.y) / abs(self.opponent.x - proj.x)),
								strength: 10,
								scaling: 0.4
							});
						}
						if (trilength(self.x - proj.x, self.y - proj.y) < 200) {
							self.crouching = false;
							self.grounded = false;
							self.getHit({
								hitlag: 0,
								hitstun: 0,
								damage: 16,
								direction: Math.sign(self.x - proj.x),
								angle: atan(abs(self.y - proj.y) / abs(self.x - proj.x)),
								strength: 30,
								scaling: 0.2
							});
						}
						proj.dead = true;
					},
					effect3: function(proj) {
						proj.drawAngle = atan(proj.vy / proj.vx);
					}
				}));
				self.vy = 0;
				self.vx = self.facing * -15;
				self.changeAttack(attackData["banannon"]["cannonRecovery"]);
				self.cannonAngle = undefined;
				self.cannonTimer = 600;
			}
		},
		high_a: function(self) {
			if (self.attackTimer == 0) {
				if (self.usedSpecial == false) {
					if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
					else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;

					self.usedSpecial = true;
				} else self.endAttack();
			}
			else if (self.attackTimer == 8) self.changeAttack(attackData["banannon"]["hurricaneKick"]);
		},
		high_g: function(self) {
			self.vx *= 0.8;

			hitbox({
				owner: self,
				start: 24,
				end: 30,
				x: 50,
				y: 60,
				width: 50,
				height: 70,
				hitlag: 8,
				hitstun: 50,
				damage: 16,
				angle: PI / 2 - 0.1,
				strength: 15,
				scaling: 0.05
			});

			self.endAttack(50);
		},

		shortLand: function(self) {
			self.vx = 0;
			self.endAttack(4);
		},
		medLand: function(self) {
			self.vx = 0;
			self.endAttack(8);
		},
		longLand: function(self) {
			self.vx = 0;
			self.endAttack(16);
		},
		cannonRecovery: function(self) {
			if (self.grounded) self.vx *= 0.9;
			self.endAttack(16);
		},
		dairLand: function(self) {
			self.vx = 0;

			hitbox({
				owner: self,
				start: 0,
				end: 10,
				x: 90,
				y: -20,
				width: 90,
				height: 30,
				hitlag: 3,
				hitstun: 30,
				damage: 5,
				angle: PI / 3,
				strength: 15,
				scaling: 0.1
			});
			hitbox({
				owner: self,
				start: 0,
				end: 10,
				x: -90,
				y: -20,
				width: 90,
				height: 30,
				hitlag: 3,
				hitstun: 30,
				damage: 5,
				angle: PI - PI / 3,
				strength: 15,
				scaling: 0.1
			});

			self.endAttack(20);
		},
		hurricaneKick: function(self){
			if (self.attackTimer % 10 == 0) self.hitOpponent = false;

			self.vy = 2;

			if (self.attackTimer == 1) self.vx = 10;
			if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.vx = self.facing == -1 ? -12 : 5;
			else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.vx = self.facing == 1 ? 12 : -5;
			else self.vx = self.facing * 10;

			for (let index = 0; index < collisionList.length; index++) {
				if (boxCollide({
						x: self.x + self.facing * 50,
						y: self.y,
						width: 20,
						height: 20,
					}, collisionList[index])) {
					self.changeAttack(attackData["banannon"]["longLand"]);
					self.vy = 22;
				}
			}

			hitbox({
				owner: self,
				start: 0,
				end: 60,
				x: 30,
				y: 5,
				width: 60,
				height: 50,
				hitlag: 2,
				hitstun: 20,
				damage: 2,
				angle: abs(self.vx) < 6 ? PI/4 : (self.vx < 10 ? 0.5 : 0.2),
				strength: abs(self.vx) * 2,
				scaling: 0,
			});

			if (self.attackTimer == 40) {
				self.hitOpponent = false;
				self.changeAttack(attackData["banannon"]["hurricaneFinish"]);
			}
		},
		hurricaneFinish: function(self){
			hitbox({
				owner: self,
				start: 0,
				end: 10,
				x: 30,
				y: 5,
				width: 70,
				height: 70,
				hitlag: 10,
				hitstun: 30,
				damage: 6,
				angle: 0.4,
				strength: 20,
				scaling: 0.3,
			});

			self.endAttack(20);
		}
	},
	bananagent: {
		side_g: function(self) {
			if (self.attackTimer == 0) self.vx = self.facing * 12;

			hitbox({
				owner: self,
				start: 10,
				end: 20,
				x: 30,
				y: 0,
				width: 60,
				height: 60,
				hitlag: 3,
				hitstun: 20,
				damage: 8,
				angle: PI / 2 - 0.2,
				strength: 10,
				scaling: 0.2
			});

			if (self.attackTimer > 10) self.vx *= 0.9;
			self.endAttack(25);
		},
		high_a: function(self) {
			if (self.jetpackTimer == undefined) self.jetpackTimer = 180;

			if (self.attackTimer < 5) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
				else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;
			}

			self.currentAnimation = "high_a";
			self.animationTimer = 0;
			if (self.vy < -10) self.vy = -10;
			if (self.vy <= 6) self.vy += 2;

			if (self.attackTimer % ((self.jetpackTimer < 40) ? 4 : 10) == 0) singleParticle({
				x: self.x - self.facing * 25,
				y: self.y + 20,
				size: 30,
				sprite: "banannonfire",
				quantity: 1,
				vy: -2,
				vx: random(-2, 2),
				age: 60,
				back: 0,
				spin: 0.1
			});
			self.jetpackTimer--;

			if (!keyValues[self.playerNum]["attack"] || self.jetpackTimer <= 0) {
				self.endAttack();
			}
		},
		front_a: function(self) {

			hitbox({
				owner: self,
				start: 12,
				end: 16,
				x: 50,
				y: 30,
				width: 60,
				height: 50,
				hitlag: 3,
				hitstun: 30,
				damage: 10,
				angle: PI / 4,
				strength: 10,
				scaling: 0.2
			});

			if (this.grounded) self.changeAttack(attackData["bananagent"]["medLand"]);

			self.endAttack(20);
		},
		special_a: function(self) {

			hitbox({
				owner: self,
				start: 15,
				end: 20,
				x: 0,
				y: -20,
				width: 40,
				height: 60,
				hitlag: 10,
				hitstun: 40,
				damage: 15,
				angle: 3 * PI / 2,
				strength: 10,
				scaling: 0.4
			});

			if (this.grounded) self.changeAttack(attackData["bananagent"]["longLand"]);

			self.endAttack(40);
		},
		back_a: function(self) {

			hitbox({
				owner: self,
				start: 12,
				end: 16,
				x: -80,
				y: 40,
				width: 60,
				height: 80,
				hitlag: 3,
				hitstun: 20,
				damage: 6,
				angle: PI - PI / 3,
				strength: 20,
				scaling: 0.1
			});

			if (this.grounded) self.changeAttack(attackData["banannon"]["shortLand"]);

			self.endAttack(30);
		},
		high_g: function(self) {
			if (self.attackTimer == 0) {
				self.vx = 0;
				self.armor = -1;
			}

			if (self.attackTimer == 20) {
				self.armor = 0;
			}

			hitbox({
				owner: self,
				start: 20,
				end: 25,
				x: 30,
				y: 50,
				width: 40,
				height: 60,
				hitlag: 6,
				hitstun: 40,
				damage: 10,
				angle: PI / 2 - 0.1,
				strength: 20,
				scaling: 0.06
			});

			self.endAttack(40);
		},
		special_g: function(self) {
			self.vx = 0;
			if (self.attackTimer == 60) projectileList.push(new projectile({
				owner: self,
				age: 360,
				sprite: "IBM",
				spriteSize: 150,
				x: self.opponent.x,
				y: blastY,
				width: 40,
				height: 100,
				initialAngle: 3 * PI / 2,
				speed: 10,
				gravity: 0,
				hitlag: 8,
				hitstun: 40,
				damage: 12,
				angle: PI / 4,
				strength: 10,
				scaling: 0.3,
				effect1: function(proj) {
					singleParticle({
						x: proj.x,
						y: proj.y,
						size: 400,
						sprite: "banannonfire",
						vx: 0,
						vy: 0,
						age: 25,
						back: 0,
						spin: 0
					});
					proj.dead = true;
				},
				effect2: function(proj) {
					singleParticle({
						x: proj.x,
						y: proj.y,
						size: 400,
						sprite: "banannonfire",
						vx: 0,
						vy: 0,
						age: 25,
						back: 0,
						spin: 0
					});
					//explosion
					if (trilength(self.opponent.x - proj.x, self.opponent.y - proj.y) < 200) {
						self.opponent.grounded = false;
						self.opponent.getHit({
							hitlag: 4,
							hitstun: 30,
							damage: 10,
							direction: Math.sign(self.opponent.x - proj.x),
							angle: PI / 4,
							strength: 10,
							scaling: 0.3
						});
					}
					proj.dead = true;
				},
				effect3: function(proj) {
					if (proj.age % 6 == 0) singleParticle({
						x: proj.x,
						y: proj.y + 100,
						size: 50,
						sprite: "banannonfire",
						vx: random(-2, 2),
						vy: 2,
						age: 25,
						back: 0,
						spin: 0.1
					});
				}
			}));

			self.endAttack(80);
		},
		neutral_a: function(self) {
			if (self.attackTimer == 0 && self.bazookaTimer) self.endAttack();

			if (self.attackTimer < 3) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) {
					if (self.facing == 1) self.vx *= -1;
					self.facing = -1;
				} else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) {
					if (self.facing == -1) self.vx *= -1;
					self.facing = 1;
				}
			}

			if (self.attackTimer == 20) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
				else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;

				projectileList.push(new projectile({
					owner: self,
					age: 180,
					sprite: "bazooka",
					x: self.x + self.facing * 80,
					y: self.y + 60,
					width: 25,
					height: 25,
					spriteSize: 40,
					initialAngle: 0,
					speed: 1,
					gravity: 0,
					hitlag: 8,
					hitstun: 40,
					damage: 12,
					angle: PI / 4,
					strength: 10,
					scaling: 0.3,
					effect1: function(proj) {
						singleParticle({
							x: proj.x,
							y: proj.y,
							size: 300,
							sprite: "banannonfire",
							vx: 0,
							vy: 0,
							age: 25,
							back: 0,
							spin: 0
						});
						proj.dead = true;
					},
					effect2: function(proj) {
						singleParticle({
							x: proj.x,
							y: proj.y,
							size: 300,
							sprite: "banannonfire",
							vx: 0,
							vy: 0,
							age: 25,
							back: 0,
							spin: 0
						});
						//explosion
						if (trilength(self.opponent.x - proj.x, self.opponent.y - proj.y) < 200) {
							self.opponent.grounded = false;
							self.opponent.getHit({
								hitlag: 4,
								hitstun: 30,
								damage: 10,
								direction: Math.sign(self.opponent.x - proj.x),
								angle: PI / 4,
								strength: 10,
								scaling: 0.3
							});
						}
						proj.dead = true;
					},
					effect3: function(proj) {
						if (abs(proj.vx) < 20) proj.vx += Math.sign(proj.vx) * 0.2;
						if (proj.age % 10 == 0) singleParticle({
							x: proj.x - 20 * Math.sign(proj.vx),
							y: proj.y,
							size: 40,
							sprite: "banannonfire",
							vx: -Math.sign(proj.vx) * 2,
							vy: random(-2, 2),
							age: 25,
							back: 0,
							spin: 0.1
						});
					}
				}));
				self.bazookaTimer = 120;
			}

			if (self.grounded == true) self.vx = 0;

			self.endAttack(30);
		},
		neutral_g: function(self) {
			if (self.attackTimer == 0 && self.bazookaTimer) self.endAttack();

			if (self.attackTimer == 20) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
				else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;

				projectileList.push(new projectile({
					owner: self,
					age: 180,
					sprite: "bazooka",
					x: self.x + self.facing * 80,
					y: self.y + 40,
					width: 25,
					height: 25,
					spriteSize: 40,
					initialAngle: 0,
					speed: 1,
					gravity: 0,
					hitlag: 8,
					hitstun: 40,
					damage: 12,
					angle: PI / 4,
					strength: 10,
					scaling: 0.3,
					effect1: function(proj) {
						singleParticle({
							x: proj.x,
							y: proj.y,
							size: 300,
							sprite: "banannonfire",
							vx: 0,
							vy: 0,
							age: 25,
							back: 0,
							spin: 0
						});
						proj.dead = true;
					},
					effect2: function(proj) {
						singleParticle({
							x: proj.x,
							y: proj.y,
							size: 300,
							sprite: "banannonfire",
							vx: 0,
							vy: 0,
							age: 25,
							back: 0,
							spin: 0
						});
						//explosion
						if (trilength(self.opponent.x - proj.x, self.opponent.y - proj.y) < 200) {
							self.opponent.grounded = false;
							self.opponent.getHit({
								hitlag: 4,
								hitstun: 30,
								damage: 10,
								direction: Math.sign(self.opponent.x - proj.x),
								angle: PI / 4,
								strength: 10,
								scaling: 0.3
							});
						}
						proj.dead = true;
					},
					effect3: function(proj) {
						if (abs(proj.vx) < 20) proj.vx += Math.sign(proj.vx) * 0.2;
						if (proj.age % 10 == 0) singleParticle({
							x: proj.x - 20 * Math.sign(proj.vx),
							y: proj.y,
							size: 40,
							sprite: "banannonfire",
							vx: -Math.sign(proj.vx) * 2,
							vy: random(-2, 2),
							age: 25,
							back: 0,
							spin: 0.1
						});
					}
				}));
				self.bazookaTimer = 120;
			}

			self.vx = 0;

			self.endAttack(30);
		},

		shortLand: function(self) {
			self.vx = 0;
			self.endAttack(4);
		},
		medLand: function(self) {
			self.vx = 0;
			self.endAttack(8);
		},
		longLand: function(self) {
			self.vx = 0;
			self.endAttack(16);
		},
	},
	bananinja: {
		neutral_g: function(self) {
			if (self.attackTimer == 0 && self.peeled) self.changeAttack(attackData["bananinja"]["peeled_neutral_g"]);
			else self.vx = 0;

			if (self.attackTimer == 5) projectileList.push(new projectile({
				owner: self,
				age: 80,
				sprite: "banannonball",
				x: self.x,
				y: self.y + 5,
				width: 50,
				height: 50,
				initialAngle: 0,
				speed: 12,
				gravity: 0,
				hitlag: 6,
				hitstun: 20,
				damage: 10,
				angle: PI / 3,
				strength: 20,
				scaling: 0.2,
				effect3: function(proj) {
					proj.vx *= 0.98;
					if (proj.age == 1) {
						projectileList.push(new projectile({
							owner: self,
							age: 99999,
							sprite: "banannonball",
							x: proj.x,
							y: proj.y + 5,
							width: 50,
							height: 50,
							initialAngle: 0,
							speed: 0.01,
							gravity: 0.5,
							hitlag: 60,
							hitstun: 20,
							damage: 4,
							angle: PI / 2,
							strength: 10,
							scaling: 0,
							effect3: function(proj) {
								if (proj.owner.respawning) proj.dead = true;

								for (let index = 0; index < collisionList.length; index++) {
									snapCollide(proj, collisionList[index]);
								}
								proj.y += 1;

								if (proj.age % 360 == 0) proj.hitOpponent = false;
								if (proj.y < 0) {
									proj.x = 0;
									proj.y = 1000;
								}
							}
						}));
					}
				}
			}));

			if (self.attackTimer == 30) {
				self.endAttack();
				self.peeled = true;
			}
		},
		neutral_a: function(self) {
			if (self.attackTimer == 0 && self.peeled) self.changeAttack(attackData["bananinja"]["peeled_neutral_a"]);
			else if (self.attackTimer < 3) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) {
					if (self.facing == 1) self.vx *= -1;
					self.facing = -1;
				} else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) {
					if (self.facing == -1) self.vx *= -1;
					self.facing = 1;
				}
			}

			if (self.attackTimer == 5) projectileList.push(new projectile({
				owner: self,
				age: 80,
				sprite: "banannonball",
				x: self.x,
				y: self.y + 5,
				width: 50,
				height: 50,
				initialAngle: 0,
				speed: 12,
				gravity: 0,
				hitlag: 6,
				hitstun: 20,
				damage: 10,
				angle: PI / 3,
				strength: 20,
				scaling: 0.2,
				effect3: function(proj) {
					proj.vx *= 0.98;
					if (proj.age == 1) {
						projectileList.push(new projectile({
							owner: self,
							age: 99999,
							sprite: "banannonball",
							x: proj.x,
							y: proj.y + 5,
							width: 50,
							height: 50,
							initialAngle: 0,
							speed: 0.01,
							gravity: 0.5,
							hitlag: 60,
							hitstun: 20,
							damage: 4,
							angle: PI / 2,
							strength: 10,
							scaling: 0,
							effect3: function(proj) {
								if (proj.owner.respawning) proj.dead = true;

								for (let index = 0; index < collisionList.length; index++) {
									snapCollide(proj, collisionList[index]);
								}
								proj.y += 1;

								if (proj.age % 360 == 0) proj.hitOpponent = false;
								if (proj.y < 0) {
									proj.x = 0;
									proj.y = 1000;
								}
							}
						}));
					}
				}
			}));

			if (self.attackTimer == 30) {
				self.endAttack();
				self.peeled = true;
			}
		},
		side_g: function(self) {
			if (self.peeled) self.changeAttack(attackData["bananinja"]["peeled_side_g"]);

			if (self.attackTimer == 1) self.vx = self.facing * 10;
			if (self.attackTimer > 15) self.vx *= 0.9;

			hitbox({
				owner: self,
				start: 12,
				end: 25,
				x: 50,
				y: 10,
				width: 50,
				height: 60,
				hitlag: 5,
				hitstun: 30,
				damage: 12,
				angle: PI / 2 - 0.3,
				strength: 12,
				scaling: 0.3
			});

			self.endAttack(40);
		},
		front_a: function(self) {
			if (self.peeled) self.changeAttack(attackData["bananinja"]["peeled_front_a"]);


			hitbox({
				owner: self,
				start: 8,
				end: 12,
				x: 50,
				y: -10,
				width: 40,
				height: 40,
				hitlag: 3,
				hitstun: 20,
				damage: 7,
				angle: PI / 5,
				strength: 10,
				scaling: 0.2
			});

			if (self.grounded) self.changeAttack(attackData["bananinja"]["shortLand"]);

			self.endAttack(20);
		}, //not done
		back_a: function(self) {
			if (self.peeled) self.changeAttack(attackData["bananinja"]["peeled_back_a"]);

			hitbox({
				owner: self,
				start: 10,
				end: 14,
				x: -80,
				y: 0,
				width: 60,
				height: 40,
				hitlag: 4,
				hitstun: 30,
				damage: 11,
				angle: 3 * PI / 4,
				strength: 10,
				scaling: 0.3
			});

			if (self.grounded) self.changeAttack(attackData["bananinja"]["medLand"]);

			self.endAttack(30);
		},
		special_g: function(self) {
			if (self.attackTimer == 0 && self.peeled) self.changeAttack(attackData["bananinja"]["peeled_special_g"]);
			else self.vx *= 0.9;

			if (self.attackTimer == 30) {
				self.peeled = true;
				projectileList.push(new projectile({
					owner: self,
					age: 99999,
					sprite: "banannonball",
					x: self.x,
					y: self.y + 10,
					width: 50,
					height: 50,
					initialAngle: 0,
					speed: 0.01,
					gravity: 0.5,
					hitlag: 60,
					hitstun: 20,
					damage: 4,
					angle: PI / 2,
					strength: 10,
					scaling: 0,
					effect3: function(proj) {
						if (proj.owner.respawning) proj.dead = true;

						for (let index = 0; index < collisionList.length; index++) {
							snapCollide(proj, collisionList[index]);
						}
						proj.y += 1;

						if (proj.age % 360 == 0) proj.hitOpponent = false;
						if (proj.y < 0) {
							proj.x = 0;
							proj.y = 1000;
						}
					}
				}));

				self.endAttack();
			}
		},
		high_a: function(self) {
			if (self.peeled) self.changeAttack(attackData["bananinja"]["peeled_high_a"]);
			else self.vy *= 0.5;

			if (self.attackTimer == 40) {
				self.vy = 30;
				self.peeled = true;
				self.endAttack();

				projectileList.push(new projectile({
					owner: self,
					age: 99999,
					sprite: "banannonball",
					x: self.x,
					y: self.y + 10,
					width: 50,
					height: 50,
					initialAngle: 0,
					speed: 0.01,
					gravity: 0.5,
					hitlag: 60,
					hitstun: 20,
					damage: 4,
					angle: PI / 2,
					strength: 10,
					scaling: 0,
					effect3: function(proj) {
						if (proj.owner.respawning) proj.dead = true;

						for (let index = 0; index < collisionList.length; index++) {
							snapCollide(proj, collisionList[index]);
						}
						proj.y += 1;

						if (proj.age % 360 == 0) proj.hitOpponent = false;
						if (proj.y < 0) {
							proj.x = 0;
							proj.y = 1000;
						}
					}
				}));
			}

		},
		high_g: function(self) {
			if (self.peeled) self.changeAttack(attackData["bananinja"]["peeled_high_g"]);
			else self.vx *= 0.8;

			hitbox({
				owner: self,
				start: 10,
				end: 30,
				x: 50,
				y: 50,
				width: 60,
				height: 80,
				hitlag: 3,
				hitstun: 20,
				damage: 6,
				angle: PI / 2 - 0.3,
				strength: 22,
				scaling: 0.1
			});

			self.endAttack(40);
		},
		special_a: function(self) {
			if (self.peeled) self.changeAttack(attackData["bananinja"]["peeled_special_a"]);

			hitbox({
				owner: self,
				start: 15,
				end: 20,
				x: 0,
				y: -60,
				width: 70,
				height: 60,
				hitlag: 5,
				hitstun: 30,
				damage: 10,
				angle: 3 * PI / 2,
				strength: 10,
				scaling: 0.3
			});

			if (self.grounded) self.changeAttack(attackData["bananinja"]["longLand"]);

			self.endAttack(30);
		},

		peeled_neutral_g: function(self) {
			self.vx = 0;

			hitbox({
				owner: self,
				start: 3,
				end: 5,
				x: 50,
				y: 10,
				width: 20,
				height: 20,
				hitlag: 3,
				hitstun: 30,
				damage: 4,
				angle: PI / 2 - 0.2,
				strength: 10,
				scaling: 0.01
			});

			self.endAttack(10);
		},
		peeled_neutral_a: function(self) {

			hitbox({
				owner: self,
				start: 6,
				end: 20,
				x: 40,
				y: -10,
				width: 40,
				height: 30,
				hitlag: 3,
				histun: 20,
				damage: 6,
				angle: PI / 4,
				strength: 10,
				scaling: 0.1
			});

			if (self.grounded) self.changeAttack(attackData["bananinja"]["medLand"]);

			self.endAttack(26);
		},
		peeled_side_g: function(self) {
			if (self.attackTimer == 1) self.vx = self.facing * 20;
			self.vx *= 0.95;

			hitbox({
				owner: self,
				start: 10,
				end: 15,
				x: 30,
				y: -30,
				width: 50,
				height: 20,
				hitlag: 3,
				hitstun: 20,
				damage: 6,
				angle: PI / 2 - 0.2,
				strength: 10,
				scaling: 0.15
			});

			self.endAttack(20);
		},
		peeled_front_a: function(self) {

			hitbox({
				owner: self,
				start: 8,
				end: 12,
				x: 50,
				y: -10,
				width: 40,
				height: 40,
				hitlag: 3,
				hitstun: 20,
				damage: 7,
				angle: PI / 5,
				strength: 10,
				scaling: 0.2
			});

			if (self.grounded) self.changeAttack(attackData["bananinja"]["shortLand"]);

			self.endAttack(20);
		},
		peeled_back_a: function(self) {

			hitbox({
				owner: self,
				start: 6,
				end: 18,
				x: -40,
				y: 20,
				width: 40,
				height: 30,
				hitlag: 3,
				hitstun: 20,
				damage: 7,
				angle: PI / 2 + 0.2,
				strength: 15,
				scaling: 0.1
			});

			if (self.grounded) self.changeAttack(attackData["bananinja"]["shortLand"]);

			self.endAttack(20);
		},
		peeled_special_g: function(self) {
			if (self.attackTimer == 1) {
				for (let index = 0; index < projectileList.length; index++) {
					if (boxCollide(projectileList[index], self)) {
						projectileList[index].dead = true;
						self.peeled = false;
						self.endAttack();
					}
				}
			} else {
				self.vx *= 0.9;

				hitbox({
					owner: self,
					start: 9,
					end: 14,
					x: 50,
					y: 0,
					width: 50,
					height: 40,
					hitlag: 3,
					hitstun: 30,
					damage: 8,
					angle: 3 * PI / 2 + 0.2,
					strength: 20,
					scaling: 0.3
				});
			}

			self.endAttack(25);
		},
		peeled_high_a: function(self) {

			hitbox({
				owner: self,
				start: 7,
				end: 12,
				x: 0,
				y: 60,
				width: 60,
				height: 50,
				hitlag: 3,
				hitstun: 30,
				damage: 6,
				angle: PI / 2 - 0.1,
				strength: 10,
				scaling: 0.2
			});

			if (self.grounded) self.changeAttack(attackData["bananinja"]["shortLand"]);

			self.endAttack(20);
		},
		peeled_high_g: function(self) {
			if (self.attackTimer == 0) self.vx *= 1.5;

			self.vx *= 0.9;

			hitbox({
				owner: self,
				start: 6,
				end: 14,
				x: 20,
				y: 50,
				width: 60,
				height: 60,
				hitlag: 6,
				hitstun: 40,
				damage: 12,
				angle: PI / 2 - 0.1,
				strength: 20,
				scaling: 0.25
			});

			self.endAttack(25);
		},
		peeled_special_a: function(self) {
			if (self.attackTimer == 1) {
				if (self.usedSpecial) self.endAttack();
				else {
					if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
					else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;

					self.vy = 12;
					self.vx = self.facing * 15;
					self.usedSpecial = true;
				}
			} else self.vy -= 0.4;

			hitbox({
				owner: self,
				start: 16,
				end: 25,
				x: 40,
				y: 30,
				width: 50,
				height: 60,
				hitlag: 6,
				hitstun: 20,
				damage: 10,
				angle: PI / 5,
				strength: 10,
				scaling: 0.3,
				effect: function(owner) {
					owner.changeAttack(attackData["bananinja"]["fishRecovery"]);
				}
			});
			if (self.attackTimer > 12 && self.attackTimer < 25) {
				for (let index = 0; index < collisionList.length; index++) {
					if (boxCollide({
							x: self.x + self.facing * 40,
							y: self.y + 30,
							width: 50,
							height: 60
						}, collisionList[index])) self.changeAttack(attackData["bananinja"]["fishRecovery"]);
				}
			}

			if (self.grounded) self.changeAttack(attackData["bananinja"]["longLand"]);

			self.endAttack(30);
		},

		shortLand: function(self) {
			self.vx = 0;
			if (self.attackTimer > 4) {
				self.currentAttack = undefined;
				self.attackTimer = 0;
			}
		},
		medLand: function(self) {
			self.vx = 0;
			if (self.attackTimer > 8) {
				self.currentAttack = undefined;
				self.attackTimer = 0;
			}
		},
		longLand: function(self) {
			self.vx = 0;
			if (self.attackTimer > 16) {
				self.currentAttack = undefined;
				self.attackTimer = 0;
			}
		},
		fishRecovery: function(self) {
			if (self.attackTimer == 1) {
				self.vx = -self.facing * 10;
				self.vy = 20;
			}

			if (self.attackTimer > 20) {
				self.currentAttack = undefined;
				self.attackTimer = 0;
			}
		},
	}, //peel should only trip ONCE. implement some sort of meter to prevent you from always being peeled?
	bllna: {
		front_a: function(self) {

			hitbox({
				owner: self,
				start: 22,
				end: 25,
				x: 80,
				y: 20,
				width: 80,
				height: 60,
				hitlag: 5,
				hitstun: 25,
				damage: 13,
				angle: PI / 3,
				strength: 10,
				scaling: 0.4
			});

			if (self.attackTimer == 0) singleParticle({
				x: 0,
				y: 0,
				size: 200,
				sprite: "shadowCrunch",
				vx: self.facing * 60,
				vy: 10,
				age: 120,
				back: 0,
				spin: 0,
				playerToFollow: self,
				effect: function(particle){
					if (self.hitstun) particle.age = 0;
				}
			});

			if (this.grounded) {
				self.vx = 0;
			}

			self.endAttack(40);
		},
		neutral_a: function(self) {

			hitbox({
				owner: self,
				start: 10,
				end: 12,
				x: 0,
				y: 0,
				width: 80,
				height: 80,
				hitlag: 3,
				hitstun: 30,
				damage: 7,
				angle: PI / 2 - 0.2,
				strength: 20,
				scaling: 0.1
			});

			if (this.grounded) self.changeAttack(attackData["bllna"]["shortLand"]);

			self.endAttack(40);
		},
		neutral_g: function(self) {
			self.vx = 0;

			hitbox({
				owner: self,
				start: 5,
				end: 10,
				x: 40,
				y: 30,
				width: 40,
				height: 40,
				hitlag: 3,
				hitstun: 8,
				damage: 6,
				angle: PI / 2 - 0.2,
				strength: 12,
				scaling: 0.02,
				effect: function(owner) {
					owner.opponent.hitlag = 20;
					owner.opponent.animationTimer = 0;
				}
			});

			self.endAttack(20);
		},
		high_g: function(self) {
			self.vx = 0;

			if (self.attackTimer == 0) singleParticle({
				x: self.x,
				y: self.y - self.height + 200,
				size: 400,
				sprite: "evilSpire",
				age: 120,
				vx: 0,
				vy: 0,
				back: 0,
				spin: 0,
			});

			hitbox({
				owner: self,
				start: 10,
				end: 14,
				x: 0,
				y: -self.height + 100,
				width: 50,
				height: 100,
				hitlag: 3,
				hitstun: 20,
				damage: 15,
				angle: PI / 2,
				strength: 20,
				scaling: 0.3
			});
			hitbox({
				owner: self,
				start: 14,
				end: 18,
				x: 0,
				y: -self.height + 150,
				width: 50,
				height: 150,
				hitlag: 3,
				hitstun: 20,
				damage: 15,
				angle: PI / 2,
				strength: 20,
				scaling: 0.3
			});
			hitbox({
				owner: self,
				start: 18,
				end: 30,
				x: 0,
				y: -self.height + 200,
				width: 50,
				height: 200,
				hitlag: 3,
				hitstun: 20,
				damage: 15,
				angle: PI / 2,
				strength: 20,
				scaling: 0.3
			});

			self.endAttack(60);
		},
		high_a: function(self) {
			if (self.attackTimer == 0) {
				if (self.usedSpecial) self.endAttack();
				else self.usedSpecial = true;
			}

			if (self.attackTimer == 5) singleParticle({
				x: self.x + self.facing * 50,
				y: self.y,
				size: 500,
				sprite: "darkWhip",
				angle: 0,
				vx: self.facing * 0.1,
				vy: 0,
				age: 120,
				back: 0,
				playerToFollow: self,
				effect: function(particle){
					if (self.hitstun) particle.age = 0;
				}
			});

			if (self.attackTimer < 5) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
				else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;
			}

			hitbox({
				owner: self,
				start: 8,
				end: 10,
				x: -50,
				y: -40,
				width: 40,
				height: 40,
				hitlag: 3,
				hitstun: 20,
				damage: 6,
				angle: 3 * PI / 4,
				strength: 10,
				scaling: 0.2,
			});
			hitbox({
				owner: self,
				start: 15,
				end: 18,
				x: -130,
				y: 30,
				width: 50,
				height: 70,
				hitlag: 3,
				hitstun: 20,
				damage: 6,
				angle: 3 * PI / 4,
				strength: 10,
				scaling: 0.2,
			});
			hitbox({
				owner: self,
				start: 20,
				end: 28,
				x: 40,
				y: 180,
				width: 100,
				height: 60,
				hitlag: 5,
				hitstun: 30,
				damage: 13,
				angle: PI / 2 - 0.2,
				strength: 15,
				scaling: 0.2,
			});
			hitbox({
				owner: self,
				start: 25,
				end: 30,
				x: 180,
				y: 40,
				width: 60,
				height: 100,
				hitlag: 3,
				hitstun: 20,
				damage: 7,
				angle: 0.2,
				strength: 10,
				scaling: 0.1,
			});
			hitbox({
				owner: self,
				start: 30,
				end: 35,
				x: 80,
				y: -100,
				width: 80,
				height: 40,
				hitlag: 3,
				hitstun: 20,
				damage: 4,
				angle: -PI / 8,
				strength: 10,
				scaling: 0.1,
			});

			if (self.attackTimer == 20) {
				for (let index = 0; index < collisionList.length; index++) {
					if (boxCollide({
							x: self.x + self.facing * 60,
							y: self.y + 150,
							width: 140,
							height: 100
						}, collisionList[index])) {
						self.vy = 25;
						self.currentAttack = attackData["bllna"]["longLand"];
						self.attackTimer = 0;
					}
				}
			}

			if (this.grounded) {
				this.vx = 0;
			}

			self.endAttack(40);
		},
		side_g: function(self) {
			if (self.dartCooldown) self.endAttack();

			self.vx = 0;

			if (self.attackTimer == 6) projectileList.push(new projectile({
				owner: self,
				age: 100,
				sprite: "darkDart",
				x: self.x,
				y: self.y,
				width: 20,
				height: 20,
				spriteSize: 30,
				initialAngle: 0,
				speed: 10,
				gravity: 0,
				hitlag: 6,
				hitstun: 30,
				damage: 4,
				angle: PI / 2 - 0.2,
				strength: 10,
				scaling: 0.1,
				effect1: function(proj) {
					proj.dead = true;
				}
			}));

			if (self.attackTimer == 40) self.dartCooldown = 60;
		}, //this is boring now :/
		back_a: function(self) {

			hitbox({
				owner: self,
				start: 10,
				end: 14,
				x: -10,
				y: 70,
				width: 30,
				height: 20,
				hitlag: 3,
				hitstun: 30,
				damage: 9,
				angle: 3 * PI / 4,
				strength: 15,
				scaling: 0.2,
			});
			hitbox({
				owner: self,
				start: 16,
				end: 20,
				x: -60,
				y: 50,
				width: 30,
				height: 30,
				hitlag: 3,
				hitstun: 30,
				damage: 9,
				angle: 3 * PI / 4,
				strength: 15,
				scaling: 0.2,
			});
			hitbox({
				owner: self,
				start: 20,
				end: 24,
				x: -60,
				y: -20,
				width: 30,
				height: 30,
				hitlag: 3,
				hitstun: 20,
				damage: 13,
				angle: 3 * PI / 2 - 0.2,
				strength: 20,
				scaling: 0.2,
			});

			if (self.grounded) self.changeAttack(attackData["bllna"]["shortLand"]);
			self.endAttack(30);
		}, //buff this! should be bigger and easier to spike
		special_a: function(self) {
			if (self.attackTimer == 15) singleParticle({
				x: self.x,
				y: self.y - 40,
				size: 200,
				sprite: "darkCloud",
				age: 60,
				vx: 0,
				vy: 0,
				back: 0,
				spin: 0,
			});

			if (self.grounded) self.changeAttack(attackData["bllna"]["shortLand"]);
			self.endAttack(20);
		},
		special_g: function(self) {
			if (self.attackTimer == 0) {
				self.questHand = 0;
				self.vx = 0;

				singleParticle({
					x: self.x,
					y: self.y - self.height,
					age: 600,
					size: 100,
					sprite: "questGuide",
					vx: self.facing * 8,
					vy: 0,
					back: 1,
					spin: 0,
				});
			}

			if (self.questHand < 600) self.questHand += self.facing * 8;

			if (self.attackTimer > 10 && keyValues[self.playerNum]["attack"] == 1) self.changeAttack(attackData["bllna"]["questHand"]);

			if (keyValues[self.playerNum]["up"] == 1) self.changeAttack(attackData["bllna"]["teleport"]);

			if (keyValues[self.playerNum]["jump"] == 1) self.endAttack();
		},


		shortLand: function(self) {
			self.vx = 0;
			self.endAttack(4);
		},
		longLand: function(self) {
			self.vx = 0;
			self.endAttack(16);
		},
		questHand: function(self) {

			if (self.attackTimer == 1) singleParticle({
				x: self.x + self.questHand,
				y: self.y - self.height + 40,
				age: 60,
				size: 100,
				sprite: "shadowHand",
				vx: 0.1 * self.facing,
				vy: 0,
				back: 0,
				spin: 0,
			});

			hitbox({
				owner: self,
				start: 6,
				end: 10,
				x: self.facing * self.questHand,
				y: -self.height + 40,
				width: 40,
				height: 40,
				hitlag: 6,
				hitstun: 30,
				damage: 12,
				angle: 2 * PI / 3 - 0.2,
				strength: 20,
				scaling: 0.1
			});

			self.endAttack(20);
		},
		teleport: function(self) {
			if (self.attackTimer == 30) {
				self.x += self.questHand;
				self.changeAttack(attackData["bllna"]["teleportRecovery"]);
			}
		},
		teleportRecovery: function(self) {

			hitbox({
				owner: self,
				start: 5,
				end: 10,
				x: 0,
				y: 30,
				width: 60,
				height: 60,
				hitlag: 3,
				hitstun: 20,
				damage: 4,
				angle: PI / 2,
				strength: 5,
				scaling: 0.1
			});

			self.endAttack(10);
		},
	},
	bananimal: {
		side_g: function(self) {
			if (self.attackTimer == 0) self.vx = self.facing * 8;

			hitbox({
				owner: self,
				start: 20,
				end: 30,
				x: 30,
				y: 0,
				width: 60,
				height: 60,
				hitlag: 6,
				hitstun: 30,
				damage: 16,
				angle: PI / 3,
				strength: 20,
				scaling: 0.35
			});

			if (self.attackTimer > 25) self.vx *= 0.9;
			self.endAttack(50);
		},
		neutral_g: function(self) {
			//if (abs(self.vx) > 0.4) self.vx -= self.facing * 0.4; cool tech!
			if (abs(self.vx) > 0.4) self.vx -= Math.sign(self.vx) * 0.4;
			else self.vx = 0;

			hitbox({
				owner: self,
				start: 6,
				end: 12,
				x: 40,
				y: 40,
				width: 40,
				height: 70,
				hitlag: 3,
				hitstun: 30,
				damage: 8,
				angle: PI / 2 - 0.2,
				strength: 20,
				scaling: 0.15
			});

			self.endAttack(30);
		},
		high_a: function(self) {

			if (self.attackTimer == 0) {
				if (self.usedSpecial) self.endAttack();
				else {
					self.vx = 0;
					if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
					else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;

					self.vy = 20;
					self.usedSpecial = true;
				}
			}

			if (self.attackTimer > 0 && self.attackTimer < 25 && self.attackTimer % 4 == 0) {
				singleParticle({
					x: self.x + self.facing * 60 * sin(self.attackTimer / 5),
					y: self.y,
					size: 20,
					sprite: "waterBubble",
					vx: 0,
					vy: 0,
					age: 30,
					back: 1,
					spin: 0,
				});
				singleParticle({
					x: self.x - self.facing * 60 * sin(self.attackTimer / 5),
					y: self.y,
					size: 20,
					sprite: "waterBubble",
					vx: 0,
					vy: 0,
					age: 30,
					back: 1,
					spin: 0,
				});
			}

			hitbox({
				owner: self,
				start: 30,
				end: 40,
				x: 0,
				y: 60,
				width: 70,
				height: 70,
				hitlag: 6,
				hitstun: 30,
				damage: 16,
				angle: PI / 2,
				strength: 15,
				scaling: 0.3,
				effect: function() {
					particleBurst({
						x: self.x,
						y: self.y + 100,
						size: 20,
						sprite: "waterBubble",
						quantity: random(6, 13),
						angle: 0,
						angleVariation: PI,
						speed: 6,
						speedVariation: 2,
						age: 30,
						ageVariation: 5,
						yDiff: 0.4,
						frontChance: 0.5,
						spin: 0,
					});
				}
			});

			if (self.grounded) self.changeAttack(attackData["bananimal"]["longLand"]);

			self.endAttack(80);
		},
		special_g: function(self) {
			if (self.missileCooldown) self.endAttack();

			self.vx = 0;

			if (self.attackTimer == 20 || self.attackTimer == 24 || self.attackTimer == 28 || self.attackTimer == 32 || self.attackTimer == 36 || self.attackTimer == 40) {
				projectileList.push(new projectile({
					owner: self,
					age: floor(random(255, 275)),
					sprite: "waterMissile",
					x: self.x - self.facing * 10,
					y: self.y + 20,
					width: 20,
					height: 20,
					spriteSize: 36,
					initialAngle: PI / 2,
					speed: 0,
					gravity: 0,
					hitlag: 2,
					hitstun: 10,
					damage: 2,
					angle: PI/2,
					strength: 0,
					scaling: 0,
					effect1: function(proj) {
						proj.dead = true;
						singleParticle({
							x: proj.x,
							y: proj.y,
							size: 40,
							sprite: "waterBubble",
							vx: proj.vx / 2,
							vy: proj.vy / 2,
							age: 30,
							back: 1,
							spin: 0,
						});
					},
					effect2: function(proj) {
						proj.dead = true;
						singleParticle({
							x: proj.x,
							y: proj.y,
							size: 40,
							sprite: "waterBubble",
							vx: proj.vx / 2,
							vy: proj.vy / 2,
							age: 30,
							back: 1,
							spin: 0,
						});
					},
					effect3: function(proj) {
						if (proj.currentAngle == undefined) proj.currentAngle = PI / 2 + random(-0.2, 0.2);
						if (proj.turnSpeed == undefined) proj.turnSpeed = 0;
						if (proj.speed == undefined) proj.speed = random(8, 12);

						let desiredAngle = Math.sign(angleDifference(proj.currentAngle, angleTo(proj.x, proj.y, proj.owner.opponent.x, proj.owner.opponent.y)));
						if (abs(proj.turnSpeed) < 0.1 || desiredAngle !== Math.sign(proj.turnSpeed)) proj.turnSpeed += 0.01 * desiredAngle;
						if (proj.age == 230 && random(0, 1) < 0.5) proj.turnSpeed *= -1; //fudging
						if (proj.age < 250) proj.currentAngle += proj.turnSpeed;

						proj.vx = proj.speed * cos(proj.currentAngle);
						proj.vy = proj.speed * sin(proj.currentAngle);

						proj.drawAngle = proj.currentAngle;

						if (proj.age % 4 == 0) singleParticle({
							x: proj.x,
							y: proj.y,
							size: 20,
							sprite: "waterBubble",
							vx: -2 * cos(proj.currentAngle),
							vy: -2 * cos(proj.currentAngle),
							age: 10,
							back: 1,
							spin: 0,
						});
					}
				}));
			}

			if (self.attackTimer == 60) self.missileCooldown = 480; //8 seconds
		},
		special_a: function(self) {
			if (self.attackTimer == 0) {
				if (self.jetpackCooldown) self.endAttack();
				else {
					self.jetpackCooldown = 60;
					singleParticle({
						x: 0,
						y: 0,
						size: 120,
						sprite: "waterExhaust",
						vx: -self.facing * 30,
						vy: -30,
						age: 20,
						back: 0,
						spin: 0,
						playerToFollow: self
					});
				}
			} else self.vy += 0.8;

			hitbox({
				owner: self,
				start: 6,
				end: 20,
				x: -30,
				y: -40,
				width: 40,
				height: 40,
				hitlag: 3,
				hitstun: 20,
				damage: 5,
				angle: PI / 4,
				strength: 12,
				scaling: 0.2
			});

			self.endAttack(20);
		},
		front_a: function(self) {
			hitbox({
				owner: self,
				start: 8,
				end: 12,
				x: 40,
				y: 40,
				width: 50,
				height: 70,
				hitlag: 3,
				hitstun: 30,
				damage: 7,
				angle: PI / 3,
				strength: 15,
				scaling: 0.1,
			});

			if (this.grounded) self.changeAttack(attackData["bananimal"]["shortLand"]);

			self.endAttack(30);
		},
		neutral_a: function(self) {
			hitbox({
				owner: self,
				start: 6,
				end: 10,
				x: 50,
				y: -50,
				width: 30,
				height: 30,
				hitlag: 3,
				hitstun: 10,
				damage: 4,
				angle: PI - PI / 4,
				strength: 20,
				scaling: 0
			});
			hitbox({
				owner: self,
				start: 11,
				end: 15,
				x: -50,
				y: -50,
				width: 30,
				height: 30,
				hitlag: 3,
				hitstun: 10,
				damage: 4,
				angle: PI / 2,
				strength: 25,
				scaling: 0
			});
			hitbox({
				owner: self,
				start: 16,
				end: 20,
				x: -50,
				y: 50,
				width: 30,
				height: 30,
				hitlag: 3,
				hitstun: 10,
				damage: 4,
				angle: 0.2,
				strength: 10,
				scaling: 0
			});
			hitbox({
				owner: self,
				start: 25,
				end: 30,
				x: 50,
				y: 50,
				width: 50,
				height: 50,
				hitlag: 4,
				hitstun: 30,
				damage: 7,
				angle: PI / 3,
				strength: 15,
				scaling: 0.2
			});

			if (self.attackTimer == 10 || self.attackTimer == 15 || self.attackTimer == 20) self.hitOpponent = false;

			if (this.grounded) self.changeAttack(attackData["bananimal"]["medLand"]);

			self.endAttack(40);
		},
		high_g: function(self) {
			self.vx = 0;
			if (self.attackTimer == 10) singleParticle({
				x: self.x + self.facing * 20,
				y: self.y + 100,
				size: 300,
				sprite: "waterWave",
				vx: self.facing * 0.01,
				vy: 0,
				age: 60,
				back: 0,
				spin: 0,
				effect: function(particle){
					if (self.hitstun) particle.age = 0;
				}
			});

			hitbox({
				owner: self,
				start: 12,
				end: 18,
				x: 110,
				y: 10,
				width: 60,
				height: 60,
				hitlag: 3,
				hitstun: 30,
				damage: 9,
				angle: PI / 3,
				strength: 10,
				scaling: 0.2
			});
			hitbox({
				owner: self,
				start: 18,
				end: 30,
				x: 70,
				y: 140,
				width: 100,
				height: 100,
				hitlag: 4,
				hitstun: 30,
				damage: 12,
				angle: PI / 2 - 0.1,
				strength: 15,
				scaling: 0.22
			});
			hitbox({
				owner: self,
				start: 22,
				end: 34,
				x: -50,
				y: 160,
				width: 80,
				height: 60,
				hitlag: 3,
				hitstun: 30,
				damage: 9,
				angle: PI / 2 + 0.3,
				strength: 10,
				scaling: 0.2
			});

			self.endAttack(60);
		},
		back_a: function(self) {
			if (self.attackTimer == 3) singleParticle({
				x: 0,
				y: 0,
				size: 200,
				sprite: "waterSlice",
				vx: -self.facing * 60,
				vy: 10,
				age: 60,
				back: 0,
				spin: 0,
				playerToFollow: self,
				effect: function(particle){
					if (self.hitstun || self.grounded) particle.age = 0;
				}
			});

			hitbox({
				owner: self,
				start: 12,
				end: 16,
				x: -80,
				y: 0,
				width: 60,
				height: 30,
				hitlag: 3,
				hitstun: 25,
				damage: 13,
				angle: PI - PI / 5,
				strength: 10,
				scaling: 0.3,
				effect: function() {
					particleBurst({
						x: self.x - self.facing * 60,
						y: self.y,
						size: 20,
						sprite: "waterBubble",
						quantity: random(6, 10),
						angle: PI / 2 + PI / 2 * self.facing,
						angleVariation: PI / 2,
						speed: 6,
						speedVariation: 2,
						age: 30,
						ageVariation: 5,
						yDiff: 0.3,
						frontChance: 0.5,
						spin: 0,
					});
				}
			});

			if (this.grounded) self.changeAttack(attackData["bananimal"]["shortLand"]);

			self.endAttack(20);
		},

		shortLand: function(self) {
			self.vx = 0;
			self.endAttack(4);
		},
		medLand: function(self) {
			self.vx = 0;
			self.endAttack(8);
		},
		longLand: function(self) {
			self.vx = 0;
			self.endAttack(16);
		},
	},
	demonana: {
		front_a: function(self) {

			hitbox({
				owner: self,
				start: 7,
				end: 10,
				x: 60,
				y: -10,
				width: 60,
				height: 40,
				hitlag: 2,
				hitstun: 30,
				damage: 10,
				angle: PI / 4,
				strength: 10,
				scaling: 0.2
			});

			if (self.grounded) self.changeAttack(attackData["demonana"]["medLand"]); //makes it harder to wall w/ djcs

			self.endAttack(20);
		},
		back_a: function(self) {

			hitbox({
				owner: self,
				start: 10,
				end: 16,
				x: -70,
				y: 30,
				width: 50,
				height: 50,
				hitlag: 2,
				hitstun: 10,
				damage: 8,
				angle: 4 * PI / 5,
				strength: 10,
				scaling: 0.3
			});

			if (this.grounded) self.changeAttack(attackData["demonana"]["longLand"]);

			self.endAttack(30);
		},
		neutral_a: function(self) {

			if (!self.opponent.grounded) hitbox({
				owner: self,
				start: 4,
				end: 5,
				x: 70,
				y: -30,
				width: 20,
				height: 20,
				hitlag: 2,
				hitstun: 30,
				damage: 8,
				angle: 15 * PI / 8,
				strength: 5,
				scaling: 0.02,
			}); //this can only be hit directly; you can't drift into it
			hitbox({
				owner: self,
				start: 4,
				end: 20,
				x: 50,
				y: -10,
				width: 40,
				height: 40,
				hitlag: 2,
				hitstun: 30,
				damage: 6,
				angle: PI / 2 - 0.2,
				strength: 12,
				scaling: 0.1,
			});

			if (this.grounded) self.changeAttack(attackData["demonana"]["medLand"]);

			self.endAttack(40);
		},//needs a better animation— too hard to notice
		special_g: function(self) {
			if (self.demon && self.attackTimer == 0) self.endAttack();
			else self.vx *= 0.9;

			if (self.respawning) self.endAttack();
			else if (!self.demon) {
				self.demon = 360;
				if (!(self.inputs[2] == "front" && self.inputs[1] == "down" && self.inputs[0] == "diagonal_down")) singleParticle({
					x: 0,
					y: 0,
					size: 300,
					sprite: "demonFlare",
					vx: 0,
					vy: 30,
					age: 40,
					back: 1,
					spin: 0,
					playerToFollow: self,
				}); //wings

				singleParticle({
					x: 0,
					y: 0,
					size: 150,
					sprite: "demonEnergy",
					vx: 0,
					vy: 20,
					age: 360,
					back: 0,
					spin: 0,
					playerToFollow: self,
					effect: function(particle) {
						particle.vx = abs(particle.vx) * self.facing;
					}
				}); //demon indicator effect
			}

			if (!self.grounded) self.endAttack(); //ledgecancels!
			
			self.endAttack(30);
		},
		high_a: function(self) {

			hitbox({
				owner: self,
				start: 8,
				end: 14,
				x: 0,
				y: 80,
				width: 36,
				height: 50,
				hitlag: 4,
				hitstun: 30,
				damage: 10,
				angle: PI / 2,
				strength: 10,
				scaling: 0.3
			});

			if (self.grounded) self.changeAttack(attackData["demonana"]["shortLand"]);

			self.endAttack(30);
		},
		special_a: function(self) {
			if (self.attackTimer == 1) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
				else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;
			}


			if (self.attackTimer == 20) {
				self.vx = self.facing * 30;
				self.vy = 5;
				singleParticle({
					x: self.x,
					y: self.y + 20,
					size: 300,
					sprite: "demonEnergy",
					vx: 0,
					vy: 0,
					age: 30,
					back: 0,
					spin: 0,
				});
			} else if (self.attackTimer >= 30) self.vx *= 0.95;

			if (self.attackTimer > 20 && !self.usedSpecial) {
				for (let index = 0; index < collisionList.length; index++) {
					if (boxCollide({
							x: self.x + self.facing * 30,
							y: self.y,
							width: 20,
							height: 20,
						}, collisionList[index])) {
						self.changeAttack(attackData["demonana"]["missileRecovery"]);
						self.vy = 30;
						self.vx = -self.facing * 10;
						self.usedSpecial = true;
					}
				}
			}

			hitbox({
				owner: self,
				start: 21,
				end: 40,
				x: 30,
				y: 30,
				width: 60,
				height: 30,
				hitlag: 8,
				hitstun: 30,
				damage: 16,
				angle: PI / 4,
				strength: 12,
				scaling: 0.3,
				effect: function(self) {
					self.changeAttack(attackData["demonana"]["missileRecovery"]);
					self.vy = 18;
					self.vx = -self.facing * 10;
				}
			});

			self.endAttack(60);
		}, //doesn't fit this character :/
		side_g: function(self) {
			self.vy = 0;
			if (self.attackTimer == 1) self.vx = self.facing * (self.demon ? 20 : 12);
			if (self.attackTimer > 12) self.vx *= 0.9;

			hitbox({
				owner: self,
				start: 6,
				end: 20,
				x: 30,
				y: 40,
				width: 50,
				height: 80,
				hitlag: 3,
				hitstun: 30,
				damage: 12,
				angle: PI / 3,
				strength: 30,
				scaling: 0.1
			});

			self.endAttack(30);
		},
		neutral_g: function(self) {
			self.vx = 0;

			hitbox({
				owner: self,
				start: 20,
				end: 22,
				x: 60,
				y: 20,
				width: 50,
				height: 30,
				hitlag: 0,
				hitstun: 20,
				damage: 12,
				angle: 0,
				strength: 0,
				scaling: 0,
				effect: function(owner) {
					if (!owner.opponent.stun) {
						owner.opponent.hitlag = 120;
						owner.opponent.stun = 60;
					}
				}
			});

			self.endAttack(60);
		},
		high_g: function(self) {
			if (self.attackTimer < 8);
			else if (self.attackTimer < 20) self.vy = 15;
			else if (self.attackTimer == 20) self.vy = 4;

			hitbox({
				owner: self,
				start: 8,
				end: 15,
				x: 0,
				y: 50,
				width: 50,
				height: 60,
				hitlag: 3,
				hitstun: 30,
				damage: 12,
				angle: PI / 2,
				strength: 20,
				scaling: 0.1,
			});

			self.endAttack(30);
		},

		shortLand: function(self) {
			self.vx = 0;
			self.endAttack(4);
		},
		medLand: function(self) {
			self.vx = 0;
			self.endAttack(8);
		},
		longLand: function(self) {
			self.vx = 0;
			self.endAttack(16);
		},
		missileRecovery: function(self) {
			self.endAttack(40);
		},
		demonPunch: function(self) {
			self.vx = self.facing * 4;

			if (self.attackTimer == 1) {
				self.invincible = true;
				self.damage += 20;
			} else if (self.attackTimer == 20) self.invincible = false;
			else if (self.attackTimer == 18) {
				self.vy = 15;
				singleParticle({
					x: self.x,
					y: self.y + 20,
					size: 300,
					sprite: "demonEnergy",
					vx: 0,
					vy: 0,
					age: 20,
					back: 0,
					spin: 0,
				});
			}
			if (!self.grounded) self.vx *= 0.9;

			hitbox({
				owner: self,
				start: 16,
				end: 30,
				x: 40,
				y: 50,
				width: 40,
				height: 60,
				hitlag: 8,
				hitstun: 30,
				damage: 14,
				angle: PI / 3,
				strength: 20,
				scaling: 0.4
			});

			self.endAttack(60);
		},
		confusion: function(self) {
			if (self.attackTimer == 0) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
				else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;
			}
			if (self.vy < 0) self.vy += 0.5;

			if (self.attackTimer == 16) projectileList.push(new projectile({
				owner: self,
				age: 10,
				sprite: "banannonball",
				x: self.x,
				y: self.y,
				width: 40,
				height: 10,
				initialAngle: 0,
				speed: 30,
				gravity: 0,
				hitlag: 60,
				hitstun: 0,
				damage: 6,
				angle: 0,
				strength: 0,
				scaling: 0,
				effect1: function(proj) {
					proj.dead = true;
				}
			}));

			if (self.attackTimer > 16 && self.grounded) self.changeAttack(attackData["demonana"]["longLand"]);

			self.endAttack(60);
		}, //don't like this
	},
	snow: {
		neutral_g: function(self) {
			if (self.attackTimer > 30) self.vx *= 0.95;

			if (self.attackTimer == 0) {
				if (self.weapon) self.changeAttack(attackData["snow"][self.weapon + "_neutral_g"]);
			}

			if (keyValues[self.playerNum][self.facing == -1 ? "left" : "right"] && !keyValues[self.playerNum][self.facing == 1 ? "left" : "right"]) self.displayWeapon = "iceSpear";
			else if (keyValues[self.playerNum][self.facing == 1 ? "left" : "right"] && !keyValues[self.playerNum][self.facing == -1 ? "left" : "right"]) self.displayWeapon = "iceScythe";
			else if (keyValues[self.playerNum]["down"]) self.displayWeapon = "iceHammer";
			else if (keyValues[self.playerNum]["up"]) self.displayWeapon = "iceCannon";
			else self.displayWeapon = undefined;

			//maybe cut the "melting lowers damage" thing? or just have it on a few weapons
			if (!keyValues[self.playerNum]["attack"]) {
				self.endAttack();
				//spear
				if (self.displayWeapon == "iceSpear" && self.snow >= 4) {
					self.snow -= 4;
					self.weapon = "iceSpear";
					self.meltTimer = 9 * 60 + 30; //half damage at 6	seconds, the 30 is to wait until this particle disappears
					self.changeAttack(attackData["snow"]["summonWeapon"]);
				}
				//scythe
				else if (self.displayWeapon == "iceScythe" && self.snow >= 4) {
					self.snow -= 4;
					self.weapon = "iceScythe";
					self.meltTimer = 9 * 60 + 30;
					self.changeAttack(attackData["snow"]["summonWeapon"]);
				}
				//hammer
				else if (self.displayWeapon == "iceHammer" && self.snow >= 8) {
					self.snow -= 8;
					self.weapon = "iceHammer";
					self.meltTimer = 6 * 60 + 30;
					self.changeAttack(attackData["snow"]["summonWeapon"]);
				}
				//cannon
				else if (self.displayWeapon == "iceCannon" && self.snow >= 8) {
					self.snow -= 8;
					self.weapon = "iceCannon";
					self.meltTimer = 8 * 60 + 30;
					self.changeAttack(attackData["snow"]["summonWeapon"]);
				}
				self.displayWeapon = undefined;
			}
		},
		neutral_a: function(self) {
			if (self.attackTimer == 0 && self.weapon) self.changeAttack(attackData["snow"][self.weapon + "_neutral_a"]);

			hitbox({
				owner: self,
				start: 8,
				end: 16,
				x: -30,
				y: 50,
				width: 50,
				height: 50,
				hitlag: 3,
				hitstun: 30,
				damage: 6,
				angle: PI / 2 + 0.1,
				strength: 10,
				scaling: 0.2,
			});
			hitbox({
				owner: self,
				start: 16,
				end: 24,
				x: 30,
				y: 10,
				width: 50,
				height: 50,
				hitlag: 3,
				hitstun: 30,
				damage: 6,
				angle: PI / 3,
				strength: 10,
				scaling: 0.2,
			});

			if (self.grounded) self.changeAttack(attackData["snow"]["medLand"]);
			self.endAttack(30);
		},
		side_g: function(self) {
			if (self.attackTimer == 4 && abs(self.vx) < 8) self.vx = self.facing * 8;
			if (abs(self.vx) < 16 && Math.sign(self.vx) == self.facing) self.vx += self.facing * 0.1;

			hitbox({
				owner: self,
				start: 10,
				end: 600,
				x: 50,
				y: 20,
				width: 20,
				height: 20,
				hitlag: 4,
				hitstun: 30,
				damage: 8,
				angle: PI / 3,
				strength: 15,
				scaling: 0.2,
			});

			if (self.attackTimer % 5 == 0) singleParticle({
				x: self.x - self.facing * 25,
				y: self.y - 50,
				size: 120,
				sprite: "snowflake_small",
				quantity: 1,
				vy: 2,
				vx: random(-2, 2),
				age: 60,
				back: 0,
				spin: 0.1
			});

			if (keyValues[self.playerNum]["jump"] == 1) self.endAttack();
			else if (!keyValues[self.playerNum]["attack"]) self.endAttack(60);
		}, //I don't really like this either
		front_a: function(self) {
			if (self.attackTimer == 0 && self.weapon) self.changeAttack(attackData["snow"][self.weapon + "_front_a"]);

			hitbox({
				owner: self,
				start: 6,
				end: 12,
				x: 40,
				y: 26,
				width: 40,
				height: 40,
				hitlag: 3,
				hitstun: 25,
				damage: 7,
				angle: PI / 5,
				strength: 10,
				scaling: 0.18,
			});

			if (self.grounded) self.changeAttack(attackData["snow"]["medLand"]);
			self.endAttack(20);
		},
		back_a: function(self) {
			if (self.attackTimer == 0) self.boosting = false;
			if (keyValues[self.playerNum]["attack"]) {
				if (self.attackTimer == 10) {
					self.vx += -self.facing * 15;
					self.boosting = true; //TEMP													 
				}
			}
			if (self.boosting && self.attackTimer == 16) {
				self.vx *= 0.4;
				self.boosting = false;
			}

			hitbox({
				owner: self,
				start: 14,
				end: 16,
				x: -55,
				y: 30,
				width: 40,
				height: 20,
				hitlag: 5,
				hitstun: 30,
				damage: 12,
				angle: 3 * PI / 4,
				strength: 15,
				scaling: 0.3,
			});
			hitbox({
				owner: self,
				start: 14,
				end: 25,
				x: -55,
				y: 30,
				width: 50,
				height: 30,
				hitlag: 3,
				hitstun: 30,
				damage: 8,
				angle: 3 * PI / 4 - 0.1,
				strength: 15,
				scaling: 0.1,
			});

			if (self.grounded) self.changeAttack(attackData["snow"]["slideLand"]);
			self.endAttack(40);
		},
		high_g: function(self) {
			self.vx = 0;

			if (self.attackTimer > 5 && self.attackTimer <= 20 && self.attackTimer % 3 == 0) {
				let snowCheck = 0;
				for (let index = 0; index < projectileList.length; index++) {
					if (projectileList[index].sprite == "snowPile") snowCheck++;
				}

				//limits the amount of snow possible
				if (snowCheck < 10) projectileList.push(new projectile({
					owner: self,
					age: 120,
					sprite: "snowball",
					x: self.x,
					y: self.y + 50,
					width: 40,
					height: 40,
					spriteSize: 40,
					initialAngle: PI / 2 + random(-0.2, 0.2),
					speed: 15,
					gravity: 0.5,
					hitlag: 2,
					hitstun: 10,
					damage: 3,
					angle: PI / 2,
					strength: 2,
					scaling: 0,
					effect2: function(proj) {
						proj.dead = true;
						projectileList.push(new projectile({
							owner: proj.owner,
							age: 5 * 60 + random(0, 60), //5 seconds
							sprite: "snowPile", //should be snow pile
							x: proj.x,
							y: proj.y,
							width: 40,
							height: 10,
							spriteSize: 40,
							initialAngle: 0,
							speed: 0.001,
							gravity: 0,
							hitlag: 0,
							hitstun: 0,
							damage: 0,
							angle: 0,
							strength: 0,
							scaling: 0,
							tangible: false,
						}));
					},
				}));
			}

			self.endAttack(60);
		},
		high_a: function(self) {
			/*if (self.attackTimer == 0) self.frostAngle = PI/2;
			
			if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.frostAngle += 0.05;
			else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.frostAngle -= 0.05;
			
			self.vx = 10 * cos(self.frostAngle);
			self.vy = 10 * sin(self.frostAngle);
			*/

			if (self.attackTimer == 0) {
				if (self.usedSpecial == false) self.usedSpecial = true;
				else self.endAttack();
			} else self.vy = 8;

			if (self.attackTimer % 5 == 0) singleParticle({
				x: self.x - self.facing * 25,
				y: self.y + 20,
				size: 120,
				sprite: "snowflake_small",
				quantity: 1,
				vy: -2,
				vx: random(-2, 2),
				age: 60,
				back: 0,
				spin: 0.1
			});
			else if (self.attackTimer % 6 == 0) singleParticle({
				x: self.x - self.facing * 25,
				y: self.y + 20,
				size: 120,
				sprite: "snowflake_large",
				quantity: 1,
				vy: -2,
				vx: random(-2, 2),
				age: 60,
				back: 0,
				spin: 0.1
			});

			self.endAttack(60);
		}, //I don't like this, needs work
		special_g: function(self) {
			if (!keyValues[self.playerNum]["attack"]) self.vx *= 0.8;

			if (self.attackTimer > 10 && self.attackTimer < 20)
				for (let index = 0; index < projectileList.length; index++) {
					if (projectileList[index].sprite == "snowPile" && boxCollide(projectileList[index],{x:self.x - 40, y: self.y, width: 80, height: 60})) {
						if (self.snow < 16) self.snow ++;
						projectileList[index].dead = true;
					}
				}

			hitbox({
				owner: self,
				start: 10,
				end: 20,
				x: 60,
				y: -10,
				width: 50,
				height: 40,
				hitlag: 4,
				hitstun: 40,
				damage: 9,
				angle: PI / 2 - 0.1,
				strength: 15,
				scaling: 0.05,
			});

			self.endAttack(40);
		},
		special_a: function(self) {

			if (self.attackTimer == 0) self.vy *= 0.5;
			else if (self.attackTimer < 20) self.vy += 0.5;

			hitbox({
				owner: self,
				start: 8,
				end: 30,
				x: -10,
				y: -10,
				width: 50,
				height: 40,
				hitlag: 2,
				hitstun: 20,
				damage: 2,
				angle: PI / 2,
				strength: 10,
				scaling: 0,
			});
			hitbox({
				owner: self,
				start: 30,
				end: 32,
				x: -10,
				y: -10,
				width: 60,
				height: 50,
				hitlag: 3,
				hitstun: 30,
				damage: 4,
				angle: PI / 2 - 0.2,
				strength: 10,
				scaling: 0.2,
			});

			if (self.attackTimer % 6 == 0) self.hitOpponent = false;

			self.endAttack(40);
		},

		iceSpear_neutral_g: function(self) {
			if (self.attackTimer == 20) {

				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
				else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;

				projectileList.push(new projectile({
					owner: self,
					age: 120,
					sprite: "iceSpear",
					x: self.x,
					y: self.y + 50,
					width: 60,
					height: 10,
					spriteSize: 90,
					initialAngle: PI / 5,
					speed: 15,
					gravity: 0.3,
					hitlag: 3,
					hitstun: 30,
					damage: self.meltTimer < 6 * 60 ? 6 : 14,
					angle: PI / 4,
					strength: 15,
					scaling: self.meltTimer < 6 * 60 ? 0.2 : 0.3,
					effect2: function(proj) {
						proj.dead = true;
					},
				}));

				self.weapon = undefined;
			}

			self.endAttack(50);
		},
		iceSpear_neutral_a: function(self) {

			if (self.attackTimer < 4) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) {
					if (self.facing == 1) self.vx *= -1;
					self.facing = -1;
				} else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) {
					if (self.facing == -1) self.vx *= -1;
					self.facing = 1;
				}
			}

			if (self.attackTimer == 20) {
				if (keyValues[self.playerNum]["left"] && !keyValues[self.playerNum]["right"]) self.facing = -1;
				else if (keyValues[self.playerNum]["right"] && !keyValues[self.playerNum]["left"]) self.facing = 1;

				projectileList.push(new projectile({
					owner: self,
					age: 120,
					sprite: "iceSpear",
					x: self.x,
					y: self.y + 50,
					width: 60,
					height: 10,
					spriteSize: 90,
					initialAngle: PI / 5,
					speed: 15,
					gravity: 0.3,
					hitlag: 3,
					hitstun: 30,
					damage: self.meltTimer < 6 * 60 ? 6 : 14,
					angle: PI / 4,
					strength: 15,
					scaling: self.meltTimer < 6 * 60 ? 0.2 : 0.3,
					effect2: function(proj) {
						proj.dead = true;
					},
				}));

				self.weapon = undefined;
			}

			self.endAttack(50);
		},
		iceSpear_front_a: function(self) {

			/*if (self.attackTimer == 14) self.vx = self.facing * 30;
			else if (self.attackTimer == 15) self.vx = 0;*/ //uncomment this once the camera follows instead of snapping

			hitbox({
				owner: self,
				start: 11,
				end: 16,
				x: 40,
				y: 30,
				width: 60,
				height: 30,
				hitlag: 3,
				hitstun: 30,
				damage: self.meltTimer < 6 * 60 ? 6 : 14,
				angle: PI / 4,
				strength: 15,
				scaling: self.meltTimer < 6 * 60 ? 0.2 : 0.3,
			});

			if (self.grounded) self.changeAttack(attackData["snow"]["medLand"]);
			self.endAttack(30);
		}, //give this a pin!
		iceHammer_front_a: function(self) {
			hitbox({
				owner: self,
				start: 20,
				end: 24,
				x: 50,
				y: 20,
				width: 50,
				height: 50,
				hitlag: 12,
				hitstun: 30,
				damage: 16,
				angle: PI / 4,
				strength: 20,
				scaling: 0.4,
				effect: function(self) {
					self.weapon = undefined;
					//shatter
					{
						particleBurst({
							x: self.opponent.x,
							y: self.opponent.y,
							size: 150,
							sprite: "iceShard_small",
							quantity: floor(random(4, 8)),
							angle: 0,
							angleVariation: PI,
							speed: 8,
							speedVariation: 2,
							age: 30,
							ageVariation: 5,
							yDiff: 1,
							frontChance: 1,
							spin: 0.03
						});
						particleBurst({
							x: self.opponent.x,
							y: self.opponent.y,
							size: 150,
							sprite: "iceShard_medium",
							quantity: floor(random(3, 6)),
							angle: 0,
							angleVariation: PI,
							speed: 5,
							speedVariation: 2,
							age: 40,
							ageVariation: 5,
							yDiff: 1,
							frontChance: 1,
							spin: 0.03
						});
						particleBurst({
							x: self.opponent.x,
							y: self.opponent.y,
							size: 150,
							sprite: "iceShard_large",
							quantity: floor(random(3, 5)),
							angle: 0,
							angleVariation: PI,
							speed: 5,
							speedVariation: 2,
							age: 40,
							ageVariation: 5,
							yDiff: 1,
							frontChance: 1,
							spin: 0.03
						});
					}
				},
			});

			if (self.grounded) self.changeAttack(attackData["snow"]["longLand"]);
			self.endAttack(40);
		},
		iceHammer_neutral_a: function(self) {
			hitbox({
				owner: self,
				start: 18,
				end: 20,
				x: 10,
				y: 50,
				width: 40,
				height: 30,
				hitlag: 3,
				hitstun: 30,
				damage: 12,
				angle: PI / 4,
				strength: 15,
				scaling: 0.25,
			});
			if (!self.grounded) hitbox({
				owner: self,
				start: 20,
				end: 24,
				x: 50,
				y: 0,
				width: 40,
				height: 50,
				hitlag: 8,
				hitstun: 30,
				damage: 16,
				angle: 3 * PI / 2 + 0.1,
				strength: 20,
				scaling: 0.2,
			});
			else {
				self.vx = 0;
				hitbox({
					owner: self,
					start: 20,
					end: 24,
					x: 50,
					y: 0,
					width: 40,
					height: 50,
					hitlag: 8,
					hitstun: 30,
					damage: 16,
					angle: PI / 4,
					strength: 20,
					scaling: 0.3,
				});
				hitbox({
					owner: self,
					start: 21,
					end: 32,
					x: 50,
					y: -20,
					width: 160,
					height: 30,
					hitlag: 4,
					hitstun: 20,
					damage: 8,
					angle: PI / 2,
					strength: 20,
					scaling: 0.1,
				});
			}

			self.endAttack(40);
		},
		iceHammer_neutral_g: function(self) {
			self.vx = 0;

			hitbox({
				owner: self,
				start: 18,
				end: 20,
				x: 10,
				y: 50,
				width: 40,
				height: 30,
				hitlag: 3,
				hitstun: 30,
				damage: 12,
				angle: PI / 4,
				strength: 15,
				scaling: 0.25,
			});

			hitbox({
				owner: self,
				start: 20,
				end: 24,
				x: 50,
				y: 0,
				width: 40,
				height: 50,
				hitlag: 8,
				hitstun: 30,
				damage: 16,
				angle: PI / 4,
				strength: 20,
				scaling: 0.3,
			});
			hitbox({
				owner: self,
				start: 21,
				end: 32,
				x: 50,
				y: -20,
				width: 160,
				height: 30,
				hitlag: 4,
				hitstun: 20,
				damage: 8,
				angle: PI / 2,
				strength: 20,
				scaling: 0.1,
			});

			self.endAttack(40);
		},
		iceScythe_front_a: function(self) {

			hitbox({
				owner: self,
				start: 11,
				end: 16,
				x: 40,
				y: 10,
				width: 60,
				height: 20,
				hitlag: 3,
				hitstun: 30,
				damage: 8,
				angle: 4 * PI / 5,
				strength: 15,
				scaling: 0.1,
			});

			if (self.grounded) self.changeAttack(attackData["snow"]["medLand"]);
			self.endAttack(30);
		},
		iceScythe_neutral_g: function(self) {

			hitbox({
				owner: self,
				start: 9,
				end: 12,
				x: 40,
				y: 10,
				width: 60,
				height: 30,
				hitlag: 10,
				hitstun: 50,
				damage: 8,
				angle: PI / 3 + 0.1,
				strength: 20,
				scaling: 0.05,
				effect: function(self) {
					self.weapon = undefined;
					//shatter
					{
						particleBurst({
							x: self.opponent.x,
							y: self.opponent.y,
							size: 150,
							sprite: "iceShard_small",
							quantity: floor(random(4, 8)),
							angle: 0,
							angleVariation: PI,
							speed: 8,
							speedVariation: 2,
							age: 30,
							ageVariation: 5,
							yDiff: 1,
							frontChance: 1,
							spin: 0.03
						});
						particleBurst({
							x: self.opponent.x,
							y: self.opponent.y,
							size: 150,
							sprite: "iceShard_medium",
							quantity: floor(random(3, 6)),
							angle: 0,
							angleVariation: PI,
							speed: 5,
							speedVariation: 2,
							age: 40,
							ageVariation: 5,
							yDiff: 1,
							frontChance: 1,
							spin: 0.03
						});
						particleBurst({
							x: self.opponent.x,
							y: self.opponent.y,
							size: 150,
							sprite: "iceShard_large",
							quantity: floor(random(3, 5)),
							angle: 0,
							angleVariation: PI,
							speed: 5,
							speedVariation: 2,
							age: 40,
							ageVariation: 5,
							yDiff: 1,
							frontChance: 1,
							spin: 0.03
						});
					}
				}
			});

			self.endAttack(30);
		},
		iceScythe_neutral_a: function(self) {

			hitbox({
				owner: self,
				start: 12,
				end: 18,
				x: 40,
				y: 10,
				width: 60,
				height: 30,
				hitlag: 10,
				hitstun: 50,
				damage: 8,
				angle: PI / 3,
				strength: 20,
				scaling: 0.05,
				effect: function(self) {
					self.weapon = undefined;
					//shatter
					{
						particleBurst({
							x: self.opponent.x,
							y: self.opponent.y,
							size: 150,
							sprite: "iceShard_small",
							quantity: floor(random(4, 8)),
							angle: 0,
							angleVariation: PI,
							speed: 8,
							speedVariation: 2,
							age: 30,
							ageVariation: 5,
							yDiff: 1,
							frontChance: 1,
							spin: 0.03
						});
						particleBurst({
							x: self.opponent.x,
							y: self.opponent.y,
							size: 150,
							sprite: "iceShard_medium",
							quantity: floor(random(3, 6)),
							angle: 0,
							angleVariation: PI,
							speed: 5,
							speedVariation: 2,
							age: 40,
							ageVariation: 5,
							yDiff: 1,
							frontChance: 1,
							spin: 0.03
						});
						particleBurst({
							x: self.opponent.x,
							y: self.opponent.y,
							size: 150,
							sprite: "iceShard_large",
							quantity: floor(random(3, 5)),
							angle: 0,
							angleVariation: PI,
							speed: 5,
							speedVariation: 2,
							age: 40,
							ageVariation: 5,
							yDiff: 1,
							frontChance: 1,
							spin: 0.03
						});
					}
				}
			});

			if (self.grounded) self.changeAttack(attackData["snow"]["medLand"]);
			self.endAttack(30);
		},
		iceShine_neutral_g: function(self) {
			self.vx = 0;

			if (self.attackTimer == 1) self.projectileIntangible = 30;

			hitbox({
				owner: self,
				start: 1,
				end: 5,
				x: 0,
				y: 0,
				width: 100,
				height: 100,
				hitlag: 3,
				hitstun: 20,
				damage: 6,
				angle: 0,
				strength: 10,
				scaling: 0,
			});

			for (let index = 0; index < projectileList.length; index++) {
				if (projectileList[index].owner.playerNum != self.playerNum && boxCollide(projectileList[index], {
						x: self.x,
						y: self.y,
						width: 100,
						height: 100
					})) {
					projectileList[index].owner = self;
					projectileList[index].vx *= -1.2; //it increases the speed!
					projectileList[index].vy *= -1.2;
					self.weapon = undefined;
					//and an icy particle reflect to show the reflection
				}
			}

			if (self.attackTimer == 40) self.changeAttack(attackData["snow"]["shortLand"]); //animation loop workaround
		}, //this weapon is invisible, so just use an animation that uses it for these attacks
		iceShine_neutral_a: function(self) {
			self.vx = 0;
			self.vy = 0;

			if (self.attackTimer == 1) self.projectileIntangible = 30;

			hitbox({
				owner: self,
				start: 1,
				end: 5,
				x: 0,
				y: 0,
				width: 100,
				height: 100,
				hitlag: 3,
				hitstun: 20,
				damage: 6,
				angle: 0,
				strength: 10,
				scaling: 0,
			});

			for (let index = 0; index < projectileList.length; index++) {
				if (projectileList[index].owner.playerNum != self.playerNum && boxCollide(projectileList[index], {
						x: self.x,
						y: self.y,
						width: 100,
						height: 100
					})) {
					projectileList[index].owner = self;
					projectileList[index].vx *= -1.2; //it increases the speed!
					projectileList[index].vy *= -1.2;
					self.weapon = undefined;
					//and an icy particle reflect to show the reflection
				}
			}

			if (self.attackTimer == 40) self.changeAttack(attackData["snow"]["shortLand"]); //animation loop workaround
		}, //make a function for reflectors?
		iceShine_front_a: function(self) {
			if (self.grounded) self.vx = 0;

			if (self.attackTimer == 6) {
				self.shineKick = 40;
				self.shineDistance = 0;
				singleParticle({
					x: self.x,
					y: self.y,
					size: 160,
					sprite: "iceShine",
					vx: 0,
					vy: 0,
					age: 24,
					back: 0,
					spin: 0,
					effect: function(particle) {
						particle.y = self.y;
						particle.x = self.x + self.facing * self.shineDistance;
					}
				});
			} else {
				self.shineKick -= 3;
				self.shineDistance += self.shineKick;
			}
			hitbox({
				owner: self,
				start: 6,
				end: 30,
				x: self.shineDistance,
				y: 0,
				width: 80,
				height: 80,
				hitlag: 3,
				hitstun: 20,
				damage: 6,
				angle: 0,
				strength: 10,
				scaling: 0,
			});

			for (let index = 0; index < projectileList.length; index++) {
				if (projectileList[index].owner.playerNum != self.playerNum && boxCollide(projectileList[index], {
						x: self.x + self.facing * self.shineDistance,
						y: self.y,
						width: 80,
						height: 80
					})) {
					projectileList[index].owner = self;
					projectileList[index].vx *= -1.4; //it increases the speed!
					projectileList[index].vy *= -1.4;
					self.weapon = undefined;
					//and an icy particle reflect to show the reflection
				}
			}

			self.endAttack(40);
		},
		iceCannon_neutral_g: function(self) {
			if (self.attackTimer == 1) {
				if (!self.snowballCooldown) self.snowballCooldown = 30;
				else self.endAttack();
			}

			if (self.attackTimer == 5) projectileList.push(new projectile({
				owner: self,
				age: 20,
				sprite: "snowball",
				x: self.x,
				y: self.y,
				width: 40,
				height: 40,
				spriteSize: 60,
				initialAngle: 0,
				speed: 20,
				gravity: 0,
				hitlag: 3,
				hitstun: 30,
				damage: 4,
				angle: PI / 2,
				strength: 20,
				scaling: 0,
				effect1: function(proj) {
					proj.dead = true;
				},
				effect2: function(proj) {
					proj.dead = true;
				},
			}));

			self.endAttack(20);
		}, //cannon needs a cooler sprite!
		iceCannon_neutral_a: function(self) {
			if (self.attackTimer == 1) {
				if (!self.snowballCooldown) self.snowballCooldown = 30;
				else self.endAttack();
			}

			if (self.attackTimer == 5) projectileList.push(new projectile({
				owner: self,
				age: 20,
				sprite: "snowball",
				x: self.x,
				y: self.y,
				width: 40,
				height: 40,
				spriteSize: 60,
				initialAngle: 0,
				speed: 20,
				gravity: 0,
				hitlag: 3,
				hitstun: 30,
				damage: 4,
				angle: PI / 2,
				strength: 20,
				scaling: 0,
				effect1: function(proj) {
					proj.dead = true;
				},
				effect2: function(proj) {
					proj.dead = true;
				},
			}));

			self.endAttack(20);
		},
		iceCannon_front_a: function(self) {

			if (self.attackTimer == 20) {
				self.weapon = false;
				//shatter
				{
					particleBurst({
						x: self.x,
						y: self.y,
						size: 150,
						sprite: "iceShard_small",
						quantity: floor(random(4, 8)),
						angle: 0,
						angleVariation: PI,
						speed: 8,
						speedVariation: 2,
						age: 30,
						ageVariation: 5,
						yDiff: 1,
						frontChance: 1,
						spin: 0.03
					});
					particleBurst({
						x: self.x,
						y: self.y,
						size: 150,
						sprite: "iceShard_medium",
						quantity: floor(random(3, 6)),
						angle: 0,
						angleVariation: PI,
						speed: 5,
						speedVariation: 2,
						age: 40,
						ageVariation: 5,
						yDiff: 1,
						frontChance: 1,
						spin: 0.03
					});
					particleBurst({
						x: self.x,
						y: self.y,
						size: 150,
						sprite: "iceShard_large",
						quantity: floor(random(3, 5)),
						angle: 0,
						angleVariation: PI,
						speed: 5,
						speedVariation: 2,
						age: 40,
						ageVariation: 5,
						yDiff: 1,
						frontChance: 1,
						spin: 0.03
					});
				}

				projectileList.push(new projectile({
					owner: self,
					age: 60,
					sprite: "iceImpale", //should be iceSpike
					x: self.x,
					y: self.y,
					width: 80,
					height: 20,
					spriteSize: 120,
					initialAngle: 0.3,
					speed: 30,
					gravity: 0.5,
					hitlag: 40,
					hitstun: 5,
					damage: 20,
					angle: 0,
					strength: 0,
					scaling: 0,
					effect1: function(proj) {
						proj.dead = true;
						proj.owner.opponent.speedModifier = 0.5;
						proj.owner.opponent.speedTimer = 360;
						singleParticle({
							x: 0,
							y: 0,
							size: 240,
							sprite: "iceImpale_front",
							vx: 0.01 * Math.sign(proj.vx),
							vy: 0,
							age: 360, //lasts 6 seconds
							back: 0,
							rotation: proj.drawAngle,
							spin: 0,
							playerToFollow: proj.owner.opponent,
						});
						singleParticle({
							x: 0,
							y: 0,
							size: 240,
							sprite: "iceImpale_back",
							vx: 0.01 * Math.sign(proj.vx),
							vy: 0,
							age: 360, //lasts 6 seconds
							back: 1,
							rotation: proj.drawAngle,
							spin: 0,
							playerToFollow: proj.owner.opponent,
						});
					},
					effect2: function(proj) {
						proj.dead = true;
					},
					effect3: function(proj) {
						proj.drawAngle = atan(proj.vy / proj.vx);
					},
				}));
			}

			self.endAttack(40);
		},

		shortLand: function(self) {
			self.vx = 0;
			self.endAttack(4);
		},
		medLand: function(self) {
			self.vx = 0;
			self.endAttack(8);
		},
		longLand: function(self) {
			self.vx = 0;
			self.endAttack(16);
		},
		slideLand: function(self) {
			self.endAttack(10);
		},
		summonWeapon: function(self) {
			if (self.attackTimer == 1 && particleSprites[self.weapon]) singleParticle({
				x: self.x,
				y: self.y + 100,
				size: 150,
				sprite: self.weapon,
				vx: 0,
				vy: 0,
				age: 20,
				direction: self.facing,
				back: 0,
				spin: 0,
			});

			self.endAttack(20);
		},
	},
}

let characterData = {
	banannon: {
		width: 50,
		height: 50,
		spriteSize: 75,
		fallSpeed: -15,
		gravity: 0.5,
		jumpStrength: 12,
		doubleJumpStrength: 12,
		acceleration: 1,
		maxSpeed: 10,
		friction: 1,
		airAcceleration: 0.5,
		airMaxSpeed: 6,
		jumpNumber: 1,
		meterMax: 10 * 60,
		weight: 150, //base 150
		passive: function(self) {
			if (self.cannonTimer == undefined) self.cannonTimer = 0;
			if (self.respawning) self.cannonTimer = 0;
			self.meter = 600 - self.cannonTimer;
			if (self.cannonTimer) self.cannonTimer--;
		},
	},
	bananagent: {
		width: 30,
		height: 60,
		spriteSize: 90,
		fallSpeed: -15,
		gravity: 0.5,
		jumpStrength: 10,
		doubleJumpStrength: 100,
		acceleration: 1,
		maxSpeed: 7,
		friction: 1,
		airAcceleration: 0.5,
		airMaxSpeed: 12,
		jumpNumber: 0,
		weight: 160, //base 150
		meterMax: 120, //2 seconds of jetpack
		passive: function(self) {
			if (self.jetpackTimer == undefined) self.jetpackTimer = 120;
			self.meter = self.jetpackTimer;
			if (self.respawning) self.jetpackTimer = 120;
			if (self.grounded && self.jetpackTimer < 120) self.jetpackTimer ++; //two grounded seconds to recharge
			if (self.bazookaTimer) self.bazookaTimer--;
		},
	},
	bananinja: {
		width: 45,
		height: 45,
		spriteSize: 68,
		fallSpeed: -20,
		gravity: 0.5,
		jumpStrength: 12,
		doubleJumpStrength: 12,
		acceleration: 1,
		maxSpeed: 10,
		friction: 1,
		airAcceleration: 1,
		airMaxSpeed: 6,
		jumpNumber: 1,
		weight: 150, //base 150
		passive: function(self) {
			if (self.respawning == 1) self.peeled = false;

			if (self.peeled) {
				self.maxSpeed = 14;
				self.acceleration = 2;
				self.airMaxSpeed = 8;
				self.gravity = 0.7;
				self.weight = 140;
				self.doubleJumpStrength = 15;
			} else {
				self.maxSpeed = 10;
				self.acceleration = 1;
				self.airMaxSpeed = 6;
				self.gravity = 0.5;
				self.weight = 150;
				self.doubleJumpStrength = 12;
			}
		},
	},
	bllna: {
		width: 50,
		height: 50,
		spriteSize: 75,
		fallSpeed: -15,
		gravity: 0.4,
		jumpStrength: 12,
		doubleJumpStrength: 10,
		acceleration: 0.8,
		maxSpeed: 10,
		friction: 1,
		airAcceleration: 0.8,
		airMaxSpeed: 8,
		jumpNumber: 1,
		weight: 150, //base 150
		passive: function(self) {
			if (!self.eyes) {
				self.eyes = true;
				singleParticle({
					size: 120,
					sprite: "glowEyes",
					vx: 5,
					vy: 15,
					age: 36000,
					playerToFollow: self,
					effect: function(particle){
						if (self.currentAttack || self.hitstun) particle.size = 0.1;
						else particle.size = 120;

						particle.vx = self.facing * 10 + self.vx * 2;
						particle.vy = 30 - self.vy * 2; //maybe multiply vx and vy by 2 for more drift
					}
				});
			}
			
			if (self.dartCooldown) self.dartCooldown--;
		},
	},
	bananimal: {
		width: 60,
		height: 50,
		spriteSize: 80,
		fallSpeed: -15,
		gravity: 0.5,
		jumpStrength: 12,
		doubleJumpStrength: 12,
		acceleration: 1,
		maxSpeed: 12,
		friction: 0.4,
		airAcceleration: 0.5,
		airMaxSpeed: 6,
		jumpNumber: 1,
		meterMax: 8 * 60,
		weight: 150, //base 150
		passive: function(self) {
			if (self.missileCooldown == undefined) self.missileCooldown = 0;
			self.meter = 480 - self.missileCooldown;
			if (self.missileCooldown) self.missileCooldown--;
			if (self.jetpackCooldown) self.jetpackCooldown--;
		},
	}, //bananimal should be bigger!
	banandit: {
		width: 40,
		height: 50,
		fallSpeed: -15,
		gravity: 0.7,
		jumpStrength: 15,
		doubleJumpStrength: 15,
		acceleration: 2,
		maxSpeed: 12,
		friction: 1,
		airAcceleration: 1,
		airMaxSpeed: 10,
		jumpNumber: 2,
		weight: 140, //base 150
		passive: function(self) {
			//motion inputs
			if (self.inputs == undefined) self.inputs = [];

			if ((keyValues[self.playerNum]["down"] == 1 && (keyValues[self.playerNum]["left"] || keyValues[self.playerNum]["right"])) || (keyValues[self.playerNum]["down"] && (keyValues[self.playerNum]["left"] || keyValues[self.playerNum]["right"]) == 1)) self.inputs.splice(0, 0, "diagonal_down");
			//else if ((keyValues[self.playerNum]["up"] == 1 && (self.facing == -1 ? keyValues[self.playerNum]["left"] : keyValues[self.playerNum]["right"])) || (keyValues[self.playerNum]["up"] && (self.facing == -1 ? keyValues[self.playerNum]["left"] : keyValues[self.playerNum]["right"]) == 1)) self.inputs.splice(0,0,"diagonal_up");
			else if ((keyValues[self.playerNum]["left"] || keyValues[self.playerNum]["right"]) == 1) self.inputs.splice(0, 0, "front");
			else if (keyValues[self.playerNum]["down"] == 1) self.inputs.splice(0, 0, "down");
			else if (keyValues[self.playerNum]["up"] == 1) self.inputs.splice(0, 0, "up");


			//dpunch
			if (self.grounded && keyValues[self.playerNum]["attack"] == 1 && self.inputs[2] == "front" && self.inputs[1] == "down" && self.inputs[0] == "diagonal_down") self.changeAttack(attackData["banandit"]["dragonPunch"]);

			//dunk
			if (keyValues[self.playerNum]["attack"] == 1 && self.inputs[2] == "up" && self.inputs[1] == "front" && self.inputs[0] == "diagonal_down") self.changeAttack(attackData["banandit"][self.grounded ? "dunk" : "airdunk"]);

			//lasso
			if (!self.dartCooldown && keyValues[self.playerNum]["attack"] == 1 && self.inputs[2] == "front" && self.inputs[1] == "front" && self.inputs[0] == "diagonal_down") self.changeAttack(attackData["banandit"]["lasso"]);


			if (self.dartCooldown) self.dartCooldown--;
			self.inputs = self.inputs.slice(0, 6);
		},
	},
	demonana: {
		width: 46,
		height: 70,
		spriteSize: 82,
		fallSpeed: -15,
		gravity: 0.8,
		jumpStrength: 16, //I want this to be higher; you shouldn't be able to jump fair without djc
		doubleJumpStrength: 0,
		acceleration: 2,
		maxSpeed: 8,
		friction: 1,
		airAcceleration: 0.5,
		airMaxSpeed: 10,
		jumpNumber: 2,
		meterMax: 6 * 60,
		weight: 150, //base 150
		passive: function(self) {
			//if on the ground in demon form, take damage
			//dragon punch does a bunch of self damage
			//only get double jumps while in demon form

			if (self.demon) {
				if (self.grounded && self.demon % 10 == 0) self.damage++;

				self.demon--;
			}

			self.meter = self.demon;

			if (self.boost) {
				if ((self.currentAttack && !keyValues[self.playerNum]["attack"]) || self.grounded || self.hitstun) {
					self.boost = 0;
					self.vy *= 0.5;
				} else {
					self.vy += 1.8;
					self.boost--;
				}
			}

			if (this.respawning) self.demon = 0;

			//motion inputs
			{
				if (self.inputs == undefined) self.inputs = [];

				if ((keyValues[self.playerNum]["down"] == 1 && (keyValues[self.playerNum]["left"] || keyValues[self.playerNum]["right"])) || (keyValues[self.playerNum]["down"] && (keyValues[self.playerNum]["left"] || keyValues[self.playerNum]["right"]) == 1)) self.inputs.splice(0, 0, "diagonal_down");
				else if ((keyValues[self.playerNum]["left"] || keyValues[self.playerNum]["right"]) == 1) self.inputs.splice(0, 0, "front");
				else if (keyValues[self.playerNum]["down"] == 1) self.inputs.splice(0, 0, "down");
				else if (keyValues[self.playerNum]["up"] == 1) self.inputs.splice(0, 0, "up");


				//dpunch
				if ((!self.currentAttack || self.currentAttack.name == "special_g") && self.demon && self.grounded && keyValues[self.playerNum]["attack"] == 1 && self.inputs[2] == "front" && self.inputs[1] == "down" && self.inputs[0] == "diagonal_down") self.changeAttack(attackData["demonana"]["demonPunch"]);

				self.inputs = self.inputs.slice(0, 6);
			}

		},
		doubleJump: function(self) {
			if (self.demon) {
				if (self.boost < 10 || self.boost == undefined) {
					self.vy = -8;
					self.boost = 25;

					singleParticle({
						x: 0,
						y: 0,
						size: 250,
						sprite: "demonWings",
						vx: -self.facing * 20,
						vy: 30,
						age: 25,
						back: 1,
						spin: 0,
						playerToFollow: self,
					});
				} else self.jumps = 2;
			} else {
				self.vy = -5;
				self.boost = 20;
				self.jumps = 1;

				singleParticle({
					x: 0,
					y: 0,
					size: 200,
					sprite: "demonWings",
					vx: -self.facing * 20,
					vy: 30,
					age: 20,
					back: 1,
					spin: 0,
					playerToFollow: self,
				});
			}
		},
	},
	snow: {
		width: 50,
		height: 50,
		spriteSize: 75,
		fallSpeed: -15,
		gravity: 0.6,
		jumpStrength: 12,
		doubleJumpStrength: 15,
		acceleration: 0.5,
		maxSpeed: 12,
		friction: 0.3,
		airAcceleration: 0.5,
		airMaxSpeed: 6,
		jumpNumber: 1,
		weight: 150, //base 150
		meterMax: 16,
		passive: function(self) {
			if (self.snow == undefined) self.snow = 0;

			self.meter = self.snow;

			//weapon particle
			if (!self.weaponParticle) {
				self.weaponParticle = true;
				singleParticle({
					x: 0,
					y: 0,
					size: 150,
					sprite: "iceSpear",
					vx: self.facing * 10,
					vy: 10,
					age: 36000, //1 hour?
					direction: self.facing,
					back: 0,
					spin: 0,
					playerToFollow: self,
					effect: function(particle) {
						particle.vx = self.facing * 10;

						if (self.weapon && particleSprites[self.weapon]) particle.sprite = self.weapon;

						if (self.weapon && self.weapon !== "iceShine" && ["idle", "freefall", "run", "stop", "jump", "doubleJump"].indexOf(self.currentAnimation) != -1) { //or hack
							particle.size = 150;
						} else particle.size = 0.1;
					}
				});
			}

			//copy for neutral b
			if (!self.weaponDisplay) {
				self.weaponDisplay = true;
				singleParticle({
					x: 0,
					y: 0,
					size: 150,
					sprite: "iceSpear",
					vx: 0,
					vy: 100,
					age: 36000,
					direction: self.facing,
					back: 0,
					spin: 0,
					playerToFollow: self,
					effect: function(particle) {
						particle.vx = self.facing * 10;

						if (self.displayWeapon && particleSprites[self.displayWeapon]) {
							particle.sprite = self.displayWeapon;
							particle.size = 150;
						}
						else particle.size = 0.1;
						}
				});
			}

			if (self.respawning) self.weapon = undefined;

			if (self.trap) self.trap--;
			if (self.snowballCooldown) self.snowballCooldown--;
			if (self.meltTimer) self.meltTimer--; //should I remove this?
			else self.weapon = undefined;
		},
	},
}

let animationData = {
	banannon: {
		hitlag: {
			index: 0,
			frames: 1,
			frameRate: 1,
			nextAnimation: "hitlag",
		},
		hitstun: {
			index: 1,
			frames: 4,
			frameRate: 8,
			nextAnimation: "freefall",
		},
		idle: {
			index: 2,
			frames: 2,
			frameRate: 2, //per second
			nextAnimation: "idle", //loops
		},
		run: {
			index: 3,
			frames: 4,
			frameRate: 6,
			nextAnimation: "run",
		},
		stop: {
			index: 4,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		jump: {
			index: 5,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		doubleJump: {
			index: 6,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		freefall: {
			index: 7,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		crouchStart: {
			index: 8,
			frames: 1,
			frameRate: 20,
			nextAnimation: "crouch",
		},
		crouch: {
			index: 9,
			frames: 1,
			frameRate: 1,
			nextAnimation: "crouch",
		},
		crouchGetup: {
			index: 10,
			frames: 1,
			frameRate: 20,
			nextAnimation: "idle",
		},
		neutral_g: {
			index: 11,
			frames: 5,
			frameRate: 12,
			nextAnimation: "idle",
		},
		neutral_a: {
			index: 12,
			frames: 4,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		side_g: {
			index: 13,
			frames: 6,
			frameRate: 8,
			nextAnimation: "idle",
		},
		front_a: {
			index: 14,
			frames: 4,
			frameRate: 8,
			nextAnimation: "freefall",
		},
		back_a: {
			index: 15,
			frames: 4,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		special_g: {
			index: 16,
			frames: 2,
			frameRate: 8,
			nextAnimation: "special_g",
		},
		special_a: {
			index: 17,
			frames: 1,
			frameRate: 1,
			nextAnimation: "freefall",
		},
		high_g: {
			index: 18,
			frames: 9,
			frameRate: 8,
			nextAnimation: "idle",
		},
		high_a: {
			index: 19,
			frames: 1,
			frameRate: 2,
			nextAnimation: "high_a",
		},
		shortLand: {
			index: 20,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		medLand: {
			index: 21,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		longLand: {
			index: 22,
			frames: 1,
			frameRate: 2,
			nextAnimation: "idle",
		},
		cannonRecovery: {
			index: 23,
			frames: 1,
			frameRate: 1,
			nextAnimation: "idle",
		},
		dairLand: {
			index: 24,
			frames: 2,
			frameRate: 2,
			nextAnimation: "idle",
		},
		hurricaneKick: {
			index: 25,
			frames: 4,
			frameRate: 20,
			nextAnimation: "hurricaneKick",
		},
		hurricaneFinish: {
			index: 26,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
	},
	bananagent: {
		hitlag: {
			index: 0,
			frames: 1,
			frameRate: 1,
			nextAnimation: "hitlag",
		},
		hitstun: {
			index: 1,
			frames: 1,
			frameRate: 4,
			nextAnimation: "hitstun",
		},
		idle: {
			index: 2,
			frames: 2,
			frameRate: 2, //per second
			nextAnimation: "idle", //loops
		},
		run: {
			index: 3,
			frames: 4,
			frameRate: 6,
			nextAnimation: "run",
		},
		stop: {
			index: 4,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		jump: {
			index: 5,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		doubleJump: {
			index: 6,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		freefall: {
			index: 7,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		crouchStart: {
			index: 8,
			frames: 1,
			frameRate: 20,
			nextAnimation: "crouch",
		},
		crouch: {
			index: 9,
			frames: 1,
			frameRate: 1,
			nextAnimation: "crouch",
		},
		crouchGetup: {
			index: 10,
			frames: 1,
			frameRate: 20,
			nextAnimation: "idle",
		},
		neutral_g: {
			index: 11,
			frames: 1,
			frameRate: 1,
			nextAnimation: "idle",
		},
		neutral_a: {
			index: 12,
			frames: 1,
			frameRate: 1,
			nextAnimation: "freefall",
		},
		side_g: {
			index: 13,
			frames: 1,
			frameRate: 4,
			nextAnimation: "side_g",
		},
		front_a: {
			index: 14,
			frames: 6,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		back_a: {
			index: 15,
			frames: 7,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		special_g: {
			index: 16,
			frames: 1,
			frameRate: 1,
			nextAnimation: "idle",
		},
		special_a: {
			index: 17,
			frames: 5,
			frameRate: 8,
			nextAnimation: "freefall",
		},
		high_g: {
			index: 18,
			frames: 2,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		high_a: {
			index: 19,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		shortLand: {
			index: 20,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		medLand: {
			index: 21,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		longLand: {
			index: 22,
			frames: 1,
			frameRate: 2,
			nextAnimation: "idle",
		},
	},
	bananinja: {
		hitlag: {
			index: 0,
			frames: 1,
			frameRate: 4,
			nextAnimation: "hitlag",
		},
		hitstun: {
			index: 1,
			frames: 1,
			frameRate: 4,
			nextAnimation: "hitstun",
		},
		idle: {
			index: 2,
			frames: 2,
			frameRate: 2, //per second
			nextAnimation: "idle", //loops
		},
		run: {
			index: 3,
			frames: 4,
			frameRate: 12,
			nextAnimation: "run",
		},
		stop: {
			index: 4,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		jump: {
			index: 5,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		doubleJump: {
			index: 6,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		freefall: {
			index: 7,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		crouchStart: {
			index: 8,
			frames: 1,
			frameRate: 8,
			nextAnimation: "crouch",
		},
		crouch: {
			index: 9,
			frames: 1,
			frameRate: 1,
			nextAnimation: "crouch",
		},
		crouchGetup: {
			index: 10,
			frames: 1,
			frameRate: 20,
			nextAnimation: "idle",
		},
		neutral_g: {
			index: 11,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		neutral_a: {
			index: 12,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		side_g: {
			index: 13,
			frames: 5,
			frameRate: 12,
			nextAnimation: "idle",
		},
		front_a: {
			index: 14,
			frames: 6,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		back_a: {
			index: 15,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		special_g: {
			index: 16,
			frames: 7,
			frameRate: 14,
			nextAnimation: "special_g",
		},
		special_a: {
			index: 17,
			frames: 6,
			frameRate: 8,
			nextAnimation: "special_a",
		},
		high_g: {
			index: 18,
			frames: 7,
			frameRate: 16,
			nextAnimation: "freefall",
		},
		high_a: {
			index: 19,
			frames: 6,
			frameRate: 16,
			nextAnimation: "freefall",
		},
		shortLand: {
			index: 20,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		medLand: {
			index: 21,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		longLand: {
			index: 22,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		peeled_hitlag: {
			index: 0,
			frames: 1,
			frameRate: 4,
			nextAnimation: "hitlag",
		},
		peeled_hitstun: {
			index: 1,
			frames: 1,
			frameRate: 4,
			nextAnimation: "hitstun",
		},
		peeled_idle: {
			index: 2,
			frames: 2,
			frameRate: 2, //per second
			nextAnimation: "idle", //loops
		},
		peeled_run: {
			index: 3,
			frames: 4,
			frameRate: 12,
			nextAnimation: "run",
		},
		peeled_stop: {
			index: 4,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		peeled_jump: {
			index: 5,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		peeled_doubleJump: {
			index: 6,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		peeled_freefall: {
			index: 7,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		peeled_crouchStart: {
			index: 8,
			frames: 1,
			frameRate: 8,
			nextAnimation: "crouch",
		},
		peeled_crouch: {
			index: 9,
			frames: 1,
			frameRate: 1,
			nextAnimation: "crouch",
		},
		peeled_crouchGetup: {
			index: 10,
			frames: 1,
			frameRate: 20,
			nextAnimation: "idle",
		},
		peeled_neutral_g: {
			index: 11,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		peeled_neutral_a: {
			index: 12,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		peeled_side_g: {
			index: 13,
			frames: 5,
			frameRate: 12,
			nextAnimation: "idle",
		},
		peeled_front_a: {
			index: 14,
			frames: 6,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		peeled_back_a: {
			index: 15,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		peeled_special_g: {
			index: 16,
			frames: 7,
			frameRate: 14,
			nextAnimation: "special_g",
		},
		peeled_special_a: {
			index: 17,
			frames: 6,
			frameRate: 8,
			nextAnimation: "special_a",
		},
		peeled_high_g: {
			index: 18,
			frames: 7,
			frameRate: 16,
			nextAnimation: "freefall",
		},
		peeled_high_a: {
			index: 19,
			frames: 6,
			frameRate: 16,
			nextAnimation: "freefall",
		},
		peeled_shortLand: {
			index: 20,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		peeled_medLand: {
			index: 21,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		peeled_longLand: {
			index: 22,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		fishRecovery: {
			index: 23,
			frames: 4,
			frameRate: 8,
			nextAnimation: "idle",
		},
	},
	bllna: {
		hitlag: {
			index: 0,
			frames: 1,
			frameRate: 4,
			nextAnimation: "hitlag",
		},
		hitstun: {
			index: 1,
			frames: 1,
			frameRate: 4,
			nextAnimation: "hitstun",
		},
		idle: {
			index: 2,
			frames: 4,
			frameRate: 12, //per second
			nextAnimation: "idle", //loops
		},
		run: {
			index: 3,
			frames: 4,
			frameRate: 12,
			nextAnimation: "run",
		},
		stop: {
			index: 4,
			frames: 4,
			frameRate: 12,
			nextAnimation: "idle",
		},
		jump: {
			index: 5,
			frames: 4,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		doubleJump: {
			index: 6,
			frames: 4,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		freefall: {
			index: 7,
			frames: 4,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		crouchStart: {
			index: 8,
			frames: 1,
			frameRate: 20,
			nextAnimation: "crouch",
		},
		crouch: {
			index: 9,
			frames: 4,
			frameRate: 12,
			nextAnimation: "crouch",
		},
		crouchGetup: {
			index: 10,
			frames: 1,
			frameRate: 20,
			nextAnimation: "idle",
		},
		neutral_g: {
			index: 11,
			frames: 4,
			frameRate: 12,
			nextAnimation: "idle",
		},
		neutral_a: {
			index: 12,
			frames: 4,
			frameRate: 8,
			nextAnimation: "freefall",
		},
		side_g: {
			index: 13,
			frames: 4,
			frameRate: 12,
			nextAnimation: "idle",
		},
		front_a: {
			index: 14,
			frames: 4,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		back_a: {
			index: 15,
			frames: 8,
			frameRate: 16,
			nextAnimation: "freefall",
		},
		special_g: {
			index: 16,
			frames: 4,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		special_a: {
			index: 17,
			frames: 4,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		high_g: {
			index: 18,
			frames: 5,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		high_a: {
			index: 19,
			frames: 6,
			frameRate: 8,
			nextAnimation: "freefall",
		},
		shortLand: {
			index: 20,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		medLand: {
			index: 21,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		longLand: {
			index: 22,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		questHand: {
			index: 2,
			frames: 4,
			frameRate: 12,
			nextAnimation: "idle",
		},
		teleport: {
			index: 23,
			frames: 7,
			frameRate: 16,
			nextAnimation: "teleportRecovery",
		},
		teleportRecovery: {
			index: 24,
			frames: 4,
			frameRate: 16,
			nextAnimation: "idle",
		},
	},
	bananimal: {
		hitlag: {
			index: 0,
			frames: 1,
			frameRate: 1,
			nextAnimation: "hitlag",
		},
		hitstun: {
			index: 1,
			frames: 1,
			frameRate: 4,
			nextAnimation: "hitstun",
		},
		idle: {
			index: 2,
			frames: 2,
			frameRate: 2, //per second
			nextAnimation: "idle", //loops
		},
		run: {
			index: 3,
			frames: 4,
			frameRate: 8,
			nextAnimation: "run",
		},
		stop: {
			index: 4,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		jump: {
			index: 5,
			frames: 2,
			frameRate: 6,
			nextAnimation: "freefall",
		},
		doubleJump: {
			index: 6,
			frames: 2,
			frameRate: 6,
			nextAnimation: "freefall",
		},
		freefall: {
			index: 7,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		crouchStart: {
			index: 8,
			frames: 1,
			frameRate: 8,
			nextAnimation: "crouch",
		},
		crouch: {
			index: 9,
			frames: 1,
			frameRate: 1,
			nextAnimation: "crouch",
		},
		crouchGetup: {
			index: 10,
			frames: 1,
			frameRate: 20,
			nextAnimation: "idle",
		},
		neutral_g: {
			index: 11,
			frames: 6,
			frameRate: 16,
			nextAnimation: "idle",
		},
		neutral_a: {
			index: 12,
			frames: 7,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		side_g: {
			index: 13,
			frames: 7,
			frameRate: 12,
			nextAnimation: "idle",
		},
		front_a: {
			index: 14,
			frames: 2,
			frameRate: 8,
			nextAnimation: "freefall",
		},
		back_a: {
			index: 19,
			frames: 5,
			frameRate: 16,
			nextAnimation: "freefall",
		},
		special_g: {
			index: 16,
			frames: 1,
			frameRate: 0.1,
			nextAnimation: "idle",
		},
		special_a: {
			index: 17,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		high_g: {
			index: 11,
			frames: 6,
			frameRate: 10,
			nextAnimation: "idle",
		},
		high_a: {
			index: 19,
			frames: 13,
			frameRate: 16,
			nextAnimation: "freefall",
		},
		shortLand: {
			index: 20,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		medLand: {
			index: 21,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		longLand: {
			index: 22,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
	},
	demonana: {
		hitlag: {
			index: 0,
			frames: 1,
			frameRate: 1,
			nextAnimation: "hitlag",
		},
		hitstun: {
			index: 1,
			frames: 1,
			frameRate: 4,
			nextAnimation: "hitstun",
		},
		idle: {
			index: 2,
			frames: 2,
			frameRate: 2, //per second
			nextAnimation: "idle", //loops
		},
		run: {
			index: 3,
			frames: 4,
			frameRate: 6,
			nextAnimation: "run",
		},
		stop: {
			index: 4,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		jump: {
			index: 5,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		doubleJump: {
			index: 5,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		freefall: {
			index: 7,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		crouchStart: {
			index: 8,
			frames: 1,
			frameRate: 10,
			nextAnimation: "crouch",
		},
		crouch: {
			index: 9,
			frames: 9,
			frameRate: 8,
			nextAnimation: "crouch",
		},
		crouchGetup: {
			index: 10,
			frames: 1,
			frameRate: 10,
			nextAnimation: "idle",
		},
		neutral_g: {
			index: 11,
			frames: 2,
			frameRate: 3,
			nextAnimation: "idle",
		},
		neutral_a: {
			index: 12,
			frames: 5,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		side_g: {
			index: 13,
			frames: 1,
			frameRate: 4,
			nextAnimation: "side_g",
		},
		front_a: {
			index: 14,
			frames: 7,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		back_a: {
			index: 15,
			frames: 4,
			frameRate: 8,
			nextAnimation: "freefall",
		},
		special_g: {
			index: 16,
			frames: 1,
			frameRate: 1,
			nextAnimation: "idle",
		},
		special_a: {
			index: 17,
			frames: 1,
			frameRate: 1,
			nextAnimation: "freefall",
		},
		high_g: {
			index: 18,
			frames: 4,
			frameRate: 8,
			nextAnimation: "freefall",
		},
		high_a: {
			index: 19,
			frames: 8,
			frameRate: 24,
			nextAnimation: "freefall",
		},
		shortLand: {
			index: 20,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		medLand: {
			index: 21,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		longLand: {
			index: 22,
			frames: 1,
			frameRate: 2,
			nextAnimation: "idle",
		},
		demonPunch: {
			index: 23,
			frames: 9,
			frameRate: 12,
			nextAnimation: "idle",
		},
		missileRecovery: {
			index: 17,
			frames: 1,
			frameRate: 1,
			nextAnimation: "freefall",
		},
	},
	snow: {
		hitlag: {
			index: 0,
			frames: 1,
			frameRate: 1,
			nextAnimation: "hitlag",
		},
		hitstun: {
			index: 1,
			frames: 1,
			frameRate: 4,
			nextAnimation: "hitstun",
		},
		idle: {
			index: 2,
			frames: 2,
			frameRate: 2, //per second
			nextAnimation: "idle", //loops
		},
		run: {
			index: 3,
			frames: 8,
			frameRate: 12,
			nextAnimation: "run",
		},
		stop: {
			index: 4,
			frames: 4,
			frameRate: 20,
			nextAnimation: "idle",
		}, //make a bunch of duplicate frames here to deal with the animation issue
		jump: {
			index: 5,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		doubleJump: {
			index: 6,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		freefall: {
			index: 7,
			frames: 1,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		crouchStart: {
			index: 8,
			frames: 1,
			frameRate: 20,
			nextAnimation: "crouch",
		},
		crouch: {
			index: 9,
			frames: 1,
			frameRate: 4,
			nextAnimation: "crouch",
		},
		crouchGetup: {
			index: 10,
			frames: 1,
			frameRate: 20,
			nextAnimation: "idle",
		},
		neutral_g: {
			index: 11,
			frames: 1,
			frameRate: 0.1,
			nextAnimation: "idle",
		},
		neutral_a: {
			index: 12,
			frames: 7,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		side_g: {
			index: 13,
			frames: 9,
			frameRate: 8,
			nextAnimation: "side_g",
		},
		front_a: {
			index: 14,
			frames: 5,
			frameRate: 14,
			nextAnimation: "freefall",
		},
		back_a: {
			index: 15,
			frames: 3,
			frameRate: 6,
			nextAnimation: "freefall",
		},
		special_g: {
			index: 16,
			frames: 2,
			frameRate: 4,
			nextAnimation: "idle",
		},
		special_a: {
			index: 17,
			frames: 6,
			frameRate: 12,
			nextAnimation: "freefall",
		},
		high_g: {
			index: 18,
			frames: 1,
			frameRate: 2,
			nextAnimation: "idle",
		},
		high_a: {
			index: 19,
			frames: 1,
			frameRate: 0.5,
			nextAnimation: "freefall",
		},
		shortLand: {
			index: 20,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		medLand: {
			index: 21,
			frames: 1,
			frameRate: 4,
			nextAnimation: "idle",
		},
		longLand: {
			index: 22,
			frames: 1,
			frameRate: 2,
			nextAnimation: "idle",
		},
		slideLand: {
			index: 22,
			frames: 1,
			frameRate: 2,
			nextAnimation: "idle",
		},
		iceSpear_neutral_g: {
			index: 23,
			frames: 2,
			frameRate: 3,
			nextAnimation: "idle",
		},
		iceSpear_neutral_a: {
			index: 23,
			frames: 2,
			frameRate: 3,
			nextAnimation: "freefall",
		},
		iceSpear_front_a: {
			index: 24,
			frames: 4,
			frameRate: 4,
			nextAnimation: "freefall",
		},
		iceScythe_neutral_g: {
			index: 25,
			frames: 4,
			frameRate: 8,
			nextAnimation: "idle",
		},
		iceScythe_neutral_a: {
			index: 25,
			frames: 4,
			frameRate: 8,
			nextAnimation: "freefall",
		},
		iceScythe_front_a: {
			index: 26,
			frames: 4,
			frameRate: 8,
			nextAnimation: "freefall",
		},
		iceHammer_neutral_g: {
			index: 27,
			frames: 4,
			frameRate: 3,
			nextAnimation: "idle",
		},
		iceHammer_neutral_a: {
			index: 27,
			frames: 4,
			frameRate: 3,
			nextAnimation: "freefall",
		},
		iceHammer_front_a: {
			index: 28,
			frames: 3,
			frameRate: 3,
			nextAnimation: "freefall",
		},
		iceShine_neutral_g: {
			index: 29,
			frames: 2,
			frameRate: 8,
			nextAnimation: "iceShine_neutral_g",
		},
		iceShine_neutral_a: {
			index: 29,
			frames: 2,
			frameRate: 8,
			nextAnimation: "iceShine_neutral_a",
		},
		iceShine_front_a: {
			index: 30,
			frames: 1,
			frameRate: 2,
			nextAnimation: "idle",
		}, //make him kick it like falco!
		iceCannon_neutral_g: {
			index: 31,
			frames: 1,
			frameRate: 2,
			nextAnimation: "idle",
		},
		iceCannon_neutral_a: {
			index: 31,
			frames: 1,
			frameRate: 2,
			nextAnimation: "freefall",
		},
		iceCannon_front_a: {
			index: 32,
			frames: 1,
			frameRate: 2,
			nextAnimation: "idle",
		},
		summonWeapon: {
			index: 11,
			frames: 1,
			frameRate: 2,
			nextAnimation: "idle",
		},
	},
}

let particleAnimations = {
	doubleJump: {
		frames: 7,
		frameRate: 24,
	},
	banannonfire: {
		frames: 5,
		frameRate: 8,
	},
	banannonexplosion: {
		frames: 5,
		frameRate: 8,
	},
	shadowCrunch: {
		frames: 8,
		frameRate: 12,
	},
	evilSpire: {
		frames: 8,
		frameRate: 12,
		customSize: 64,
	},
	darkWhip: {
		frames: 7,
		frameRate: 12,
	},
	shadowHand: {
		frames: 6,
		frameRate: 12,
	},
	questGuide: {
		frames: 4,
		frameRate: 8,
		loop: true,
	},
	waterExhaust: {
		frames: 3,
		frameRate: 8,
		loop: true,
	},
	waterWave: {
		frames: 6,
		frameRate: 10,
	},
	waterSlice: {
		frames: 6,
		frameRate: 16,
	},
	demonWings: {
		frames: 6,
		frameRate: 12,
	},
	demonEnergy: {
		frames: 5,
		frameRate: 12,
		loop: true,
	},
	demonFlare: {
		frames: 4,
		frameRate: 8,
	},
	iceShine: {
		frames: 2,
		frameRate: 8,
	},
}

let stages = {
	jungle: [new collision(0, 0, 800, 800, "rock")],
	jungle2: [new collision(-450, 0, 300, 800, "rock"),new collision(450, 0, 300, 800, "rock")],
	bananabeach: [new collision(0,400,800,400, "rock"),new collision(-400,1050,150,20, "wood"),new collision(400,1050,150,20, "wood")],
}