Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Human", "Mover", function() {

var Human = Mover.extend({
	
	weapon: null,
	stateOfBeing: null,
	health: -1,
	standState: null,
	
	coordinates: {
		"Left": {
		 	"Standing": {
				"angle": 270,
				"gunTip": new Point2D(0, 9),
				"armAngle": 315,
				"armTip": new Point2D(0, 2),
			},
			"Crouching": {
				"angle": 270,
				"gunTip": new Point2D(0, 9),
				"armAngle": 315,
				"armTip": new Point2D(0, 2),
			}
		},
		"Right": {
			"Standing": {
				"angle": 90,
				"gunTip": new Point2D(44, 9),
				"armAngle": 45,
				"armTip": new Point2D(44, 2),
			},
			"Crouching": {
				"angle": 90,
				"gunTip": new Point2D(44, 9),
				"armAngle": 45,
				"armTip": new Point2D(44, 2),
			}
		},
		"standCrouchHeightDifference": 11
	},
	
	constructor: function(name) {
		this.base(name);
		this.stateOfBeing = Human.ALIVE;
		this.standState = Human.STANDING;
		this.loadSprites();
		this.weapon = new M9(this);
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
				this.setSprite(this.direction + Human.STANDING + Human.RUNNING + this.isShootingSprite() + this.weapon.name, this.getSprite().getFrameNumber(time));
			else
				this.setSprite(this.direction + Human.STANDING + Human.STILL + this.isShootingSprite() + this.weapon.name, 0);
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
				this.setSprite(this.direction + Human.DEAD + this.weapon.name, 0);
				this.stateOfBeing = Human.DEAD
			}
		}
	},
	
	die: function(bullet) {
		this.stateOfBeing = Human.DYING;
		this.setSprite(this.direction + Human.DYING + this.weapon.name, 0);
		
		this.throwBackwards(bullet);
		
		// make uncollidable but leave human in the level
		if (this.ModelData.lastNode) 
			this.ModelData.lastNode.removeObject(this);
	},
	
	shoot: function() {
		this.weapon.shoot();
	},
	
	throwBackwardsDown: 2,
	throwBackwardsTempering: 5,
	throwBackwards: function(bullet) {
		this.getVelocity().setX(bullet.getVelocity().x / this.throwBackwardsTempering);
		this.getVelocity().setY(this.throwBackwardsDown);
	},
	
	crouch: function() {
		if(!this.isCrouching())
		{
			this.standState = Human.CROUCHING;
			this.getPosition().setY(this.getPosition().y + this.getStandCrouchHeightDifference());
			this.stopWalk();
			this.setSprite(this.direction + Human.CROUCHING + Human.STILL + this.weapon.name, 0);
		}
	},
	
	stand: function() {
		if(this.isCrouching())
		{
			this.standState = Human.STANDING;
			this.getPosition().setY(this.getPosition().y - this.getStandCrouchHeightDifference());
			this.setSprite(this.direction + Human.STANDING + Human.STILL + this.isShootingSprite() + this.weapon.name, 0);
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
	
	switchWeapon: function(newWeapon) {
		this.weapon = newWeapon;
		if(this.isCrouching()) // not moving so sprite won't get updated by normal update mechani
			this.setSprite(this.direction + Human.CROUCHING + Human.STILL + this.weapon.name, 0);
	},
	
	jumping: false,
	jumpSpeed: -9.0,
	postJumpAdjustmentVector: Vector2D.create(0, -1),
	jump: function() {
		if(!this.jumping && !this.isCrouching())
		{
			this.jumping = true;
			this.velocity.setY(this.velocity.y + this.jumpSpeed);
			this.setPosition(this.getPosition().add(this.postJumpAdjustmentVector));
		}
	},

	turn: function(direction) {
		this.direction = direction;
	},

	walking: false,	
	walkSpeed: 3,
	walk: function(direction) {
		if(!this.walking && !this.isCrouching())
		{
			this.walking = true;
			this.direction = direction;
			if(direction == Human.LEFT)
				this.velocity.setX(this.velocity.x - this.walkSpeed);
			else if(direction == Human.RIGHT)
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
	
	getStandCrouchHeightDifference: function() {
		return this.coordinates["standCrouchHeightDifference"];
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
	
	bloodSpread: 15,
	bloodParticleCount: 10,
	bloodParticleTTL: 300,
	bloodSpurt: function(bullet) {
		var positionData = this.field.collider.pointOfImpact(bullet, this);
		var position = null;
		if(positionData != null)
			var position = Point2D.create(positionData[0].x, positionData[0].y)
			
		var angle = this.field.collider.angleOfImpact(bullet);
		if(position && angle)
		{
			var particles = [];
			for(var x = 0; x < this.bloodParticleCount; x++)
				particles[x] = BloodParticle.create(position, angle, this.bloodSpread, this.bloodParticleTTL);
			this.field.pEngine.addParticles(particles);
		}
	},
	
	onCollide: function(obj) {
		if(obj instanceof Furniture && this.field.collider.colliding(this, [obj]))
		{
			if(this.field.collider.aFallingThroughB(this, obj))
			{
				this.endFall(obj);
				//return ColliderComponent.STOP;
			}
			else if(this.field.collider.aOnLeftAndBumpingB(this, obj))
			{
				this.block(obj.getPosition().x - this.getBoundingBox().dims.x - 1);
				//return ColliderComponent.STOP;
			}
			else if(this.field.collider.aOnRightAndBumpingB(this, obj))
			{
				this.block(obj.getPosition().x + obj.getBoundingBox().dims.x + 1);
				//return ColliderComponent.STOP;
			}
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
	
	isAlive: function() {
		return this.stateOfBeing == Human.ALIVE;
	},
	
	getGunAngle: function() {
		return this.coordinates[this.direction][this.standState]["angle"];
	},
	
	getGunTip: function() {
		return this.coordinates[this.direction][this.standState]["gunTip"];
	},
	
	getArmTip: function() {
		return this.coordinates[this.direction][this.standState]["armTip"];
	},
	
	getArmAngle: function() {
		return this.coordinates[this.direction][this.standState]["armAngle"];
	},
	
	isCrouching: function() {
		return this.standState == Human.CROUCHING;
	},
	
	release: function() {
		this.base();
		this.stateOfBeing = null;
		this.health = -1;
		this.coordinates = null;
	},

	}, { // Static
		getClassName: function() {
			return "Human";
		},
		
		// states of being
		ALIVE: "Alive",
		DYING: "Dying",
		DEAD: "Dead",
		
		// directions
		LEFT: "Left",
		RIGHT: "Right",
		
		// standing state
		STANDING: "Standing",
		CROUCHING: "Crouching",
		
		RUNNING: "Running",
		STILL: "Still",
		
		CLIP_EMPTY: "Clipempty",
		RELOADED: "Reloaded"
	});

	return Human;
});