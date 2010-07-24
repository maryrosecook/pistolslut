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
	
	constructor: function(name) {
		this.base(name);
		this.stateOfBeing = Human.ALIVE;
		this.loadSprites();
	},
	//bullet oncollide bullet update, furniture shot furniutre particle ricochet - long executions
	// player update, human shoot, collider point of impact- high ave
	// collider getrect, bullet oncollide getposition, sign update, mover get position - high % of time
	// if dying, check it they need to be switched to being dead
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
	
	shootTimer: null,
	shootInterval: 1000,
	muzzleFlashSpread: 15,
	muzzleParticleCount: 10,
	muzzleParticleTTL: 500,
	shoot: function() {
		var bullet = Bullet.create(this);
		this.field.renderContext.add(bullet);
		
		var gunTipInWorld = Point2D.create(this.getGunTip()).add(this.getPosition());
		for (var x = 0; x < this.muzzleParticleCount; x++)
			this.field.pEngine.addParticle(BurnoutParticle.create(gunTipInWorld, this.getGunAngle(), this.velocity, this.muzzleFlashSpread, this.muzzleParticleTTL));
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
			for(var x = 0; x < this.bloodParticleCount; x++)
		 		this.field.pEngine.addParticle(BloodParticle.create(position, angle, this.bloodSpread, this.bloodParticleTTL));
	},
	
	loadSprites: function() {
		this.addSprite("leftstand", this.field.spriteLoader.getSprite("girl", "leftstand"));
		this.addSprite("leftrun", this.field.spriteLoader.getSprite("girl", "leftrun"));
		this.addSprite("leftdying", this.field.spriteLoader.getSprite("girl", "leftdying"));
		this.addSprite("leftdead", this.field.spriteLoader.getSprite("girl", "leftdead"));
		this.addSprite("rightstand", this.field.spriteLoader.getSprite("girl", "rightstand"));
		this.addSprite("rightrun", this.field.spriteLoader.getSprite("girl", "rightrun"));
		this.addSprite("rightdying", this.field.spriteLoader.getSprite("girl", "rightdying"));
		this.addSprite("rightdead", this.field.spriteLoader.getSprite("girl", "rightdead"));
	},
	
	isAlive: function() {
		return this.stateOfBeing == Human.ALIVE;
	},
	
	release: function() {
		this.base();
		this.stateOfBeing = null;
		this.health = -1;
	},

	}, { // Static
		getClassName: function() {
			return "Human";
		},
		
		// states of being
		ALIVE: 0,
		DYING: 1,
		DEAD: 2
	});

	return Human;
});