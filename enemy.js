Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Enemy", "Mover", function() {

var Enemy = Mover.extend({

	alive: false,
	direction: null,
	
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

		// Add components to move and draw
		this.add(Mover2DComponent.create("move"));
		this.add(SpriteComponent.create("draw"));
		this.add(ColliderComponent.create("collide", this.field.collisionModel));
		
		this.sprites = [];
		this.sprites["standing"] = this.field.spriteLoader.getSprite(name, "standing");
		this.sprites["shooting"] = this.field.spriteLoader.getSprite(name, "shooting");
		this.setSprite("standing");
		
		this.setPosition(position);
		this.velocity = Vector2D.create(0, 0);
		
		this.direction = "left";
		this.alive = true;
		
		var enemy = this;
		this.shootTimer = Interval.create("shoot", this.shootInterval,
			function() {
				enemy.shoot();
		});
	},
	
	update: function(renderContext, time) {
		renderContext.pushTransform();
		this.base(renderContext, time);
		renderContext.popTransform();
		this.setSprite("standing");
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
	},

	}, { // Static
		getClassName: function() {
			return "Enemy";
		},
	});

	return Enemy;
});