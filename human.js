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
	//bullet oncollide bullet update, furniture shot furniutre particle ricochet - long executions
	// player update, human shoot, collider point of impact- high ave
	// collider getrect, bullet oncollide getposition, sign update, mover get position - high % of time
	
	
	update: function(renderContext, time) {
		this.base(renderContext, time)
		this.handleReload();
	},
	
	// if dying, check if need to be switched to being dead
	updateDeathState: function(time) {
		if(this.stateOfBeing == Human.DYING) // we are playing their dying animation and might need to stop it
		{
			var currentSprite = this.getSprite();
			if(currentSprite.animationPlayed(time)) // at end of anim
			{
				this.setSprite(this.direction + "dead");
				this.stateOfBeing = Human.DEAD
			}
		}
	},
	
	die: function() {
		this.stateOfBeing = Human.DYING;
		this.setSprite(this.direction + "dying");
		
		// make uncollidable but leave human in the level
		if (this.ModelData.lastNode) 
			this.ModelData.lastNode.removeObject(this);
	},
	
	triggerHeldDown: true, // whether trigger is being held down
	shotsInClip: 10,
	muzzleFlashSpread: 15,
	muzzleParticleCount: 10,
	muzzleParticleTTL: 500,
	shoot: function() {
		if(!this.clipEmpty())
		{
			this.field.renderContext.add(Bullet.create(this));
		
			var gunTipInWorld = Point2D.create(this.getGunTip()).add(this.getPosition());
			var particles = [];
			for (var x = 0; x < this.muzzleParticleCount; x++)
				particles[x] = BurnoutParticle.create(gunTipInWorld, this.getGunAngle(), this.velocity, this.muzzleFlashSpread, this.muzzleParticleTTL);
			this.field.pEngine.addParticles(particles);
			this.shotsInClip -= 1;
		}
		else if(this instanceof Player)
			this.field.level.tellSigns("Reload.  Love  from  SWiG.");
	},
	
	reloadBegun: 0,  // time reload was started
	reloadDelay: 2000,
	reload: function() {
		if(this.clipEmpty() && !this.isReloading())
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
				this.field.level.revertSigns(); // switch signs back to normal
			}
	},
	
	reloading: false,
	isReloading: function() { return this.reloading; },
	
	fillClip: function() {
		this.shotsInClip = 10;
	},
	
	clipEmpty: function() {
		return this.shotsInClip == 0;
	},
	
	crouch: function() {
		if(!this.isCrouching())
		{
			this.standState = Human.CROUCHING;
			this.setSprite(this.direction + Human.CROUCHING + Human.STILL);
			this.getPosition().setY(this.getPosition().y + this.getStandCrouchHeightDifference());
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
	
	getStandCrouchHeightDifference: function() {
		return this.coordinates["standCrouchHeightDifference"];
	},
	
	shot: function(bullet) {
		if(this.isAlive())
		{
			this.bloodSpurt(bullet);
			this.health -= bullet.damage;
			if(this.health <= 0)
				this.die();
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
		this.left = null;
		this.right = null;
	},

	}, { // Static
		getClassName: function() {
			return "Human";
		},
		
		// states of being
		ALIVE: 0,
		DYING: 1,
		DEAD: 2,
		
		// directions
		LEFT: "left",
		RIGHT: "right",
		
		// standing state
		STANDING: "standing",
		CROUCHING: "crouching",
		
		RUNNING: "running",
		STILL: "still"
	});

	return Human;
});