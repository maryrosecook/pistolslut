Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Enemy", "Human", function() {

var Enemy = Human.extend({

	direction: null,
	
	directionData: {
		"left": {
			"angle": 270,
			"gunTip": new Point2D(4, 9),
		},
		"right": {
			"angle": 90,
			"gunTip": new Point2D(44, 9),
		}
	},
	
	constructor: function(name, position) {
		this.base(name);
		this.health = 5;

		// Add components to move and draw
		this.add(Mover2DComponent.create("move"));
		this.add(SpriteComponent.create("draw"));
		this.add(ColliderComponent.create("collide", this.field.collisionModel));
		
		this.setPosition(position);
		this.velocity = Vector2D.create(0, 0);
		this.direction = "left";
		this.getComponent("move").setCheckLag(false);
		
		this.setSprite(this.direction + "stand");
		
		var enemy = this;
		this.shootTimer = Interval.create("shoot", this.shootInterval,
			function() {
				enemy.shoot();
		});
	},
	
	update: function(renderContext, time) {
		renderContext.pushTransform();
		this.updateDeathState(time);
		this.base(renderContext, time);
		renderContext.popTransform();		
	},
	
	die: function() {
		this.base();
		this.shootTimer.destroy();
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
	});

	return Enemy;
});