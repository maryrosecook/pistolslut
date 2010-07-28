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
	
	coordinates: {
		"left": {
		 	"standing": {
				"angle": 270,
				"gunTip": new Point2D(0, 9),
				"armAngle": 315,
				"armTip": new Point2D(0, 2),
			},
			"crouching": {
				"angle": 270,
				"gunTip": new Point2D(0, 9),
				"armAngle": 315,
				"armTip": new Point2D(0, 2),
			}
		},
		"right": {
			"standing": {
				"angle": 90,
				"gunTip": new Point2D(44, 9),
				"armAngle": 45,
				"armTip": new Point2D(44, 2),
			},
			"crouching": {
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
	},

	update: function(renderContext, time) {
		this.move(time);
		renderContext.pushTransform();
		this.base(renderContext, time);
		renderContext.popTransform();
		
		this.handleReload();
	},

	move: function(time) {
		this.updateDeathState(time);
		this.field.applyGravity(this);

		// set sprite
		if(this.isAlive() && !this.isCrouching())
		{
			if(this.velocity.x != 0)
				this.setSprite(this.direction + Human.STANDING + Human.RUNNING);
			else
				this.setSprite(this.direction + Human.STANDING + Human.STILL);
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
				this.setSprite(this.direction + Human.DEAD);
				this.stateOfBeing = Human.DEAD
			}
		}
	},
	
	die: function(bullet) {
		this.stateOfBeing = Human.DYING;
		this.setSprite(this.direction + Human.DYING);
		
		this.throwBackwards(bullet);
		
		// make uncollidable but leave human in the level
		if (this.ModelData.lastNode) 
			this.ModelData.lastNode.removeObject(this);
	},
	
	throwBackwardsTempering: 5,
	throwBackwards: function(bullet) {
		this.getVelocity().setX(bullet.getVelocity().x / this.throwBackwardsTempering);
	},
	
	triggerHeldDown: true, // whether trigger is being held down
	shotsInClip: 10,
	muzzleFlashSpread: 15,
	muzzleParticleCount: 10,
	muzzleParticleTTL: 500,
	shoot: function() {
		if(!this.isClipEmpty() && !this.isReloading())
		{
			this.field.renderContext.add(Bullet.create(this));
		
			var gunTipInWorld = Point2D.create(this.getGunTip()).add(this.getPosition());
			var particles = [];
			for (var x = 0; x < this.muzzleParticleCount; x++)
				particles[x] = BurnoutParticle.create(gunTipInWorld, this.getGunAngle(), this.velocity, this.muzzleFlashSpread, this.muzzleParticleTTL);
			this.field.pEngine.addParticles(particles);
			this.shotsInClip -= 1;
			this.lastShot = new Date().getTime();
		}
		else if(this instanceof Player)
			this.field.notifier.post(Sign.HIJACK, "Reload.  Love  from  SWiG.");
		else if(this instanceof Enemy)
			this.field.notifier.post(Human.CLIP_EMPTY, this);
	},
	
	reloadBegun: 0,  // time reload was started
	reloadDelay: 2000,
	reload: function() {
		if(!this.isReloading())
		{
			this.reloadBegun = new Date().getTime();
			this.reloading = true;
		}
	},
	
	// if reloading and the time to reload has elapsed, fill clip
	handleReload: function() {
		if(this.reloading)
			if(new Date().getTime() - this.reloadBegun > this.reloadDelay) // reload period has passed
			{
				this.fillClip();
				this.reloading = false;
				this.field.notifier.post(Sign.REVERT, null); // switch signs back to normal
				this.field.notifier.post(Human.RELOADED, null); // switch signs back to normal
			}
	},
	
	reloading: false,
	isReloading: function() { return this.reloading; },
	
	fillClip: function() {
		this.shotsInClip = 10;
	},
	
	isClipEmpty: function() {
		return this.shotsInClip == 0;
	},
	
	crouch: function() {
		if(!this.isCrouching())
		{
			this.standState = Human.CROUCHING;
			this.setSprite(this.direction + Human.CROUCHING + Human.STILL);
			this.getPosition().setY(this.getPosition().y + this.getStandCrouchHeightDifference());
			this.stopWalk(null);
		}
	},
	
	stand: function() {
		if(this.isCrouching())
		{
			this.standState = Human.STANDING;
			this.setSprite(this.direction + Human.STANDING + Human.STILL);
			this.getPosition().setY(this.getPosition().y - this.getStandCrouchHeightDifference());
		}
	},
	
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
				return ColliderComponent.STOP;
			}
			else if(this.field.collider.aOnLeftAndBumpingB(this, obj))
			{
				this.stopWalk(obj.getPosition().x - this.getBoundingBox().dims.x - 1);
				return ColliderComponent.STOP;
			}
			else if(this.field.collider.aOnRightAndBumpingB(this, obj))
			{
				this.stopWalk(obj.getPosition().x + obj.getBoundingBox().dims.x + 1);
				return ColliderComponent.STOP;
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
		this.addSprite("leftstandingstill", this.field.spriteLoader.getSprite("girl", "leftstandingstill"));
		this.addSprite("leftstandingrunning", this.field.spriteLoader.getSprite("girl", "leftstandingrunning"));
		this.addSprite("leftdying", this.field.spriteLoader.getSprite("girl", "leftdying"));
		this.addSprite("leftdead", this.field.spriteLoader.getSprite("girl", "leftdead"));
		this.addSprite("leftcrouchingstill", this.field.spriteLoader.getSprite("girl", "leftcrouchingstill"));
		this.addSprite("rightstandingstill", this.field.spriteLoader.getSprite("girl", "rightstandingstill"));
		this.addSprite("rightstandingrunning", this.field.spriteLoader.getSprite("girl", "rightstandingrunning"));
		this.addSprite("rightdying", this.field.spriteLoader.getSprite("girl", "rightdying"));
		this.addSprite("rightdead", this.field.spriteLoader.getSprite("girl", "rightdead"));
		this.addSprite("rightcrouchingstill", this.field.spriteLoader.getSprite("girl", "rightcrouchingstill"));
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
		ALIVE: "alive",
		DYING: "dying",
		DEAD: "dead",
		
		// directions
		LEFT: "left",
		RIGHT: "right",
		
		// standing state
		STANDING: "standing",
		CROUCHING: "crouching",
		
		RUNNING: "running",
		STILL: "still",
		
		CLIP_EMPTY: "clip_empty",
		RELOADED: "reloaded"
	});

	return Human;
});