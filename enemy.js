Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Enemy", "Human", function() {

var Enemy = Human.extend({
	
	shootTimer: null,
	shootDelay: 1000,
	lastShot: 0,
	
	constructor: function(name, position) {
		this.base(name);
		this.health = 5;

		// Add components to move and draw
		this.add(Mover2DComponent.create("move"));
		this.add(SpriteComponent.create("draw"));
		this.add(AIComponent.create("logic", null, this.field.playerObj));
		this.add(ColliderComponent.create("collide", this.field.collisionModel));
		
		this.setPosition(position);
		this.velocity = Vector2D.create(0, 0);
		this.direction = Human.LEFT;
		this.getComponent("move").setCheckLag(false);
		
		this.setSprite(this.direction + Human.STANDING + Human.STILL);
		
		var enemy = this;
		this.shootTimer = Interval.create("shoot", this.shootDelay,
			function() {
				enemy.shoot();
		});
	},
	
	getLogic: function() { return this.getComponent("logic"); },
	
	// tell AI that shots have been fired nearby
	incoming: function(bullet) {
		this.getLogic().incoming(bullet);
	},
	
	die: function(bullet) {
		this.base(bullet);
		this.shootTimer.destroy();
		this.remove(this.getComponent("logic"));
	},
	
	release: function() {
		this.base();
		this.shootTimer = null;
		this.lastShot = 0;
	}

	}, { // Static
		getClassName: function() {
			return "Enemy";
		},
	});

	return Enemy;
});