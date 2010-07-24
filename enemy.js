Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Enemy", "Mover", function() {

var Enemy = Mover.extend({

	direction: null,
	
	stateOfHealth: null,
	shootTimer: null,
	shootInterval: 1000,
	
	directionData: {
		"left": {
			"angle": 270,
			"gunTip": new Point2D(4, 16),
		},
		"right": {
			"angle": 90,
			"gunTip": new Point2D(44, 9),
		}
	},
	
	constructor: function(name, position) {
		this.base(name);
		this.field = PistolSlut;
		this.stateOfHealth = Enemy.ALIVE;

		// Add components to move and draw
		this.add(Mover2DComponent.create("move"));
		this.add(SpriteComponent.create("draw"));
		this.add(ColliderComponent.create("collide", this.field.collisionModel));
		
		this.sprites = [];
		this.sprites["standing"] = this.field.spriteLoader.getSprite(name, "standing");
		this.sprites["shooting"] = this.field.spriteLoader.getSprite(name, "shooting");
		this.sprites["dying"] = this.field.spriteLoader.getSprite(name, "dying");
		this.sprites["dead"] = this.field.spriteLoader.getSprite(name, "dead");
		this.setSprite("standing");
		
		this.setPosition(position);
		this.velocity = Vector2D.create(0, 0);
		this.direction = "left";
		this.getComponent("move").setCheckLag(false);
		
		var enemy = this;
		// this.shootTimer = Interval.create("shoot", this.shootInterval,
		// 	function() {
		// 		enemy.shoot();
		// });
	},
	
	update: function(renderContext, time) {
		renderContext.pushTransform();
		
		if(this.stateOfHealth == Enemy.DYING) // we are playing their dying animation and might need to stop it
		{
			var currentSprite = this.getSprite();
			if(currentSprite.animationPlayed(time)) // at end of anim
			{
				this.setSprite("dead");
				this.stateOfHealth = Enemy.DEAD
			}
		}
		
		
		this.base(renderContext, time);

		renderContext.popTransform();		
	},
	
	onCollide: function(obj) {
		return ColliderComponent.CONTINUE;
	},
	
	die: function(bullet) {
		this.stateOfHealth = Enemy.DYING;
		this.setSprite("dying");
		
		// make uncollidable but leave enemy in the level
		if (this.ModelData.lastNode) 
			this.ModelData.lastNode.removeObject(this);
	},
	
	muzzleFlashSpread: 15,
	muzzleParticleCount: 10,
	muzzleParticleTTL: 500,
	shoot: function() {
		this.setSprite("shooting");
		var bullet = Bullet.create(this);
		this.field.renderContext.add(bullet);
		
		var gunTipInWorld = Point2D.create(this.getGunTip()).add(this.getPosition());
		for (var x = 0; x < this.muzzleParticleCount; x++)
			this.field.pEngine.addParticle(BurnoutParticle.create(gunTipInWorld, this.getGunAngle(), this.velocity, this.muzzleFlashSpread, this.muzzleParticleTTL));
	},
	
	getGunAngle: function() {
		return this.directionData[this.direction]["angle"];
	},
	
	getGunTip: function() {
		return this.directionData[this.direction]["gunTip"];
	},
	
	release: function() {
		this.base();
	}

	}, { // Static
		getClassName: function() {
			return "Enemy";
		},
		
		ALIVE: 0,
		DYING: 1,
		DEAD: 2
	});

	return Enemy;
});