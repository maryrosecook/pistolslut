Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Human", "Mover", function() {

var Human = Mover.extend({
	
	stateOfBeing: null,
	health: -1,
	standState: null,
	canThrowGrenades: false,
	
	constructor: function(name, position, health, weaponName, canThrowGrenades) {
		this.base(name);
		this.health = health;
		this.canThrowGrenades = canThrowGrenades;
		this.stateOfBeing = Human.ALIVE;
		this.standState = Human.STANDING;
		this.loadSprites();
		this.setupWeapons(weaponName);
		
		// Add components to move and draw the player
		this.add(Mover2DComponent.create("move"));
		this.add(SpriteComponent.create("draw"));
		this.add(ColliderComponent.create("collide", this.field.collisionModel));

		this.setSprite(this.direction + Human.STANDING + Human.STILL + this.isShootingSprite() + this.weapon.name);

		this.velocity = Vector2D.create(0, 0);
		this.getComponent("move").setCheckLag(false);
		this.getComponent("move").setPosition(position);
	},

	update: function(renderContext, time) {
		this.move(time);
		renderContext.pushTransform();
		this.base(renderContext, time);
		renderContext.popTransform();
		
		this.weapon.handleReload();
		this.weapon.handleAutomatic();
	},

	move: function(time) {
		this.updateDeathState(time);
		this.field.applyGravity(this);

		// set sprite
		if(this.isAlive() && !this.isCrouching())
		{
			if(this.velocity.x != 0)
				this.setSprite(this.direction + Human.STANDING + Human.RUNNING + this.isShootingSprite() + this.weapon.name);
			else
				this.setSprite(this.direction + Human.STANDING + Human.STILL + this.isShootingSprite() + this.weapon.name);
		}
		
		this.handleFriction();
		
		this.setPosition(this.getPosition().add(this.velocity));
	},
	
	// if dying, check if need to be switched to being dead
	updateDeathState: function(time) {
		if(this.stateOfBeing == Human.DYING) // we are playing their dying animation and might need to stop it
		{
			var currentSprite = this.getSprite();
			if(currentSprite.animationPlayed(time)) // at end of anim
			{
				this.setSprite(this.direction + Human.DEAD + this.weapon.name);
				this.stateOfBeing = Human.DEAD
			}
		}
	},
	
	die: function(bullet) {
		this.stateOfBeing = Human.DYING;
		this.setSprite(this.direction + Human.DYING + this.weapon.name);
		
		this.throwBackwards(bullet);
		
		// make uncollidable but leave human in the level
		if (this.ModelData.lastNode) 
			this.ModelData.lastNode.removeObject(this);
	},
	
	shoot: function() {
		this.weapon.startShooting();
		this.weapon.shoot();
	},
	
	throwBackwardsUp: -3,
	throwBackwardsTempering: 6,
	throwBackwards: function(bullet) {
		this.getVelocity().setX(bullet.getVelocity().x / this.throwBackwardsTempering);
		this.getPosition().setY(this.getPosition().y - 5);
		this.getVelocity().setY(this.throwBackwardsUp);
	},
	
	crouch: function() {
		if(!this.isCrouching())
		{
			this.standState = Human.CROUCHING;
			this.getPosition().setY(this.getPosition().y + this.getStandCrouchHeightDifference());
			this.stopWalk();
			this.setSprite(this.direction + Human.CROUCHING + Human.STILL + this.weapon.name);
		}
	},
	
	stand: function() {
		if(this.isCrouching())
		{
			this.standState = Human.STANDING;
			this.getPosition().setY(this.getPosition().y - this.getStandCrouchHeightDifference());
			this.setSprite(this.direction + Human.STANDING + Human.STILL + this.isShootingSprite() + this.weapon.name);
		}
	},
	
	// delay on when human lowers their gun
	delayBeforeLoweringGun: 1000,
	lastStoppedShooting: null,
	isShootingSprite: function() {
		if(this.weapon.shooting == Weapon.SHOOTING)
			return Weapon.SHOOTING;
		else
		{
			if(new Date().getTime() - this.lastStoppedShooting > this.delayBeforeLoweringGun)
				return Weapon.NOT_SHOOTING;
			else
				return Weapon.SHOOTING;
		}
	},
	
	stoppedShooting: function() { this.lastStoppedShooting = new Date().getTime(); },
	
	throwDelay: 1000,
	lastThrow: 0,
	throwGrenade: function() {
		if(new Date().getTime() - this.lastThrow > this.throwDelay)
		{
			this.lastThrow = new Date().getTime();
			var grenade = Grenade.create(this);
			this.field.renderContext.add(grenade);
		}
	},
	
	isGrenadesAvailable: function() { return true; },
	
	cycleWeapon: function() {
		if(this.weapons.length == 0)
			return;
			
		for(var i = 0; i < this.weapons.length; i++)
			if(i == this.weapons.length - 1)
				this.setWeapon(this.weapons[0].name);
			else if(this.weapons[i] == this.weapon)
			{
				this.setWeapon(this.weapons[i + 1].name);
				break;
			}
		
		this.field.notifier.post(Weapon.SWITCH, this.weapon);
		
		if(this.isCrouching()) // not moving so sprite won't get updated by normal update mechanism
			this.setSprite(this.direction + Human.CROUCHING + Human.STILL + this.weapon.name);
	},
	
	setWeapon: function(weaponName) {
		for(var i in this.weapons)
			if(this.weapons[i].name == weaponName)
				this.weapon = this.weapons[i];
	},
	
	jumping: false,
	jumpSpeed: -6.0,
	postJumpAdjustmentVector: Vector2D.create(0, -1),
	jump: function() {
		if(!this.jumping && !this.isCrouching())
		{
			this.jumping = true;
			this.velocity.setY(this.velocity.y + this.jumpSpeed);
			this.setPosition(this.getPosition().add(this.postJumpAdjustmentVector));
		}
	},

	turn: function(direction) { this.direction = direction; },

	walking: false,	
	walkSpeed: 3,
	walk: function(direction) {
		if(!this.walking && !this.isCrouching())
		{
			this.walking = true;
			this.direction = direction;
			if(direction == Collider.LEFT)
				this.velocity.setX(this.velocity.x - this.walkSpeed);
			else if(direction == Collider.RIGHT)
				this.velocity.setX(this.velocity.x + this.walkSpeed);
		}
	},
	
	stopWalk: function(newX) {
		this.velocity.setX(0);
		this.walking = false;
	},
	
	// holds human at passed X
	block: function(newX) {
		if(newX != null)
			this.getPosition().setX(newX);
	},
	
	endFall: function(groundObj) {
		this.getPosition().setY(groundObj.getPosition().y - this.getBoundingBox().dims.y);
		this.velocity.setY(0);
		this.jumping = false;
	},
		
	shot: function(bullet) {
		if(this.isAlive())
		{
			this.bloodSpurt(bullet);
			this.health -= bullet.damage;
			if(this.health <= 0)
				this.die(bullet);
		}
	},
	
	bloodSpread: 50,
	bloodParticleCount: 10,
	bloodParticleTTL: 300,
	bloodSpurt: function(projectile) {
		var positionData = this.field.collider.pointOfImpact(projectile, this);
		var position = null;
		if(positionData != null)
			var position = Point2D.create(positionData[0].x, positionData[0].y)

		if(position)
		{
			var particles = [];
			
			var sideHit = positionData[1];
			var reversedAngle = this.field.physics.reverseAngle(projectile, sideHit);
			for(var x = 0; x < this.bloodParticleCount; x++)
				particles[x] = BloodParticle.create(position, reversedAngle, this.bloodSpread, this.bloodParticleTTL);
				
			this.field.pEngine.addParticles(particles);
		}
	},
	
	setupWeapons: function(weaponName) {
		this.weapons = [];
		this.weapons.push(new M9(this));
		this.weapons.push(new Mac10(this));
		this.weapons.push(new SPAS(this));
		this.setWeapon(weaponName);
	},
	
	onCollide: function(obj) {
		if(obj instanceof Furniture && this.field.collider.colliding(this, [obj]))
		{
			if(this.field.collider.aFallingThroughB(this, obj))
				this.endFall(obj);
			else if(this.field.collider.aOnLeftAndBumpingB(this, obj))
				this.block(obj.getPosition().x - this.getBoundingBox().dims.x - 1);
			else if(this.field.collider.aOnRightAndBumpingB(this, obj))
				this.block(obj.getPosition().x + obj.getBoundingBox().dims.x + 1);
		}
		return ColliderComponent.CONTINUE;
	},
	
	// if dead, carry on moving. A bit.
	friction: 0.1,
	handleFriction: function() {
		newX = null;
		if(!this.isAlive())
		{
			var x = this.velocity.x;
			if(x == 0)
				return;
			else if(x > 0)
			{
				newX = x - this.friction;
				if(newX < 0)
					newX = 0;
			}
			else // x < 0
			{
				newX = x + this.friction;
				if(newX < 0)
					newX = 0;
			}
			this.velocity.setX(newX);
		}
	},
	
	loadSprites: function() {
		for(var spriteIdentifier in this.field.spriteLoader.get("girl").info.sprites)
			this.addSprite(spriteIdentifier, this.field.spriteLoader.getSprite("girl", spriteIdentifier));
	},
	
	isAlive: function() { return this.stateOfBeing == Human.ALIVE; },
	isCrouching: function() { return this.standState == Human.CROUCHING; },
	
	getGunAngle: function() { return Human.COORDINATES[this.direction]["gunAngle"]; },
	getGunTip: function() { return Human.COORDINATES[this.direction][this.standState][this.weapon.name]["gunTip"]; },
	getArmTip: function() { return Human.COORDINATES[this.direction][this.standState][this.weapon.name]["armTip"]; },
	getArmAngle: function() { return Human.COORDINATES[this.direction]["armAngle"]; },
	getStandCrouchHeightDifference: function() { return Human.COORDINATES["standCrouchHeightDifference"]; },
	
	release: function() {
		this.base();
		this.stateOfBeing = null;
		this.health = -1;
	},

	}, {
		getClassName: function() { return "Human"; },
		
		// states of being
		ALIVE: "Alive",
		DYING: "Dying",
		DEAD: "Dead",
		
		// standing state
		STANDING: "Standing",
		CROUCHING: "Crouching",
		
		RUNNING: "Running",
		STILL: "Still",
		
		CLIP_EMPTY: "Clipempty",
		RELOADED: "Reloaded",
		
		COORDINATES: {
			"Left": {
				"armAngle": 330,
				"gunAngle": 270,
			 	"Standing": {
					"M9": {
						"gunTip": new Point2D(3, 9),
						"armTip": new Point2D(0, 2),
					},
					"Mac10": {
						"gunTip": new Point2D(4, 7),
						"armTip": new Point2D(0, 2),
					},
					"SPAS": {
						"gunTip": new Point2D(3, 12),
						"armTip": new Point2D(0, 2),
					}
				},
				"Crouching": {
					"M9": {
						"gunTip": new Point2D(0, 9),
						"armTip": new Point2D(0, 2),
					},
					"Mac10": {
						"gunTip": new Point2D(3, 7),
						"armTip": new Point2D(0, 2),
					},
					"SPAS": {
						"gunTip": new Point2D(3, 12),
						"armTip": new Point2D(0, 2),
					}
				}
			},
			"Right": {
				"armAngle": 30,
				"gunAngle": 90,
				"Standing": {
					"M9": {
						"gunTip": new Point2D(45, 9),
						"armTip": new Point2D(44, 2),
					},
					"Mac10": {
						"gunTip": new Point2D(45, 7),
						"armTip": new Point2D(44, 2),
					},
					"SPAS": {
						"gunTip": new Point2D(45, 12),
						"armTip": new Point2D(44, 2),
					}
				},
				"Crouching": {
					"M9": {
						"gunTip": new Point2D(45, 9),
						"armTip": new Point2D(44, 2),
					},
					"Mac10": {
						"gunTip": new Point2D(45, 7),
						"armTip": new Point2D(44, 2),
					},
					"SPAS": {
						"gunTip": new Point2D(45, 12),
						"armTip": new Point2D(44, 2),
					}
				}
			},
			"standCrouchHeightDifference": 11
		},
	});

	return Human;
});