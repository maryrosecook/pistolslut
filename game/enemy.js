Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Enemy", "Human", function() {

var Enemy = Human.extend({
	weapon: null,
	weapons: [],
	shootTimer: null,
	shootDelay: 1000,
	
	constructor: function(name, position) {
		this.base(name);
		this.health = 10;

		// Add components to move and draw
		this.add(Mover2DComponent.create("move"));
		this.add(SpriteComponent.create("draw"));
		this.add(AIComponent.create("logic", null, this.field.playerObj, this));
		this.add(ColliderComponent.create("collide", this.field.collisionModel));
		
		// subscribe to events the enemy should care about
		this.field.notifier.subscribe(Bullet.INCOMING_EVENT, this.getLogic(), this.getLogic().notifyIncoming);
		this.field.notifier.subscribe(Human.CLIP_EMPTY, this.getLogic(), this.getLogic().notifyWeaponEmpty);
		this.field.notifier.subscribe(Human.RELOADED, this.getLogic(), this.getLogic().notifyReloaded);
		//this.field.notifier.subscribe("playerMove", this.getLogic(), this.getLogic().playerMove);
		
		this.setPosition(position);
		this.velocity = Vector2D.create(0, 0);
		this.direction = Human.LEFT;
		this.getComponent("move").setCheckLag(false);
				
		this.setSprite(this.direction + Human.STANDING + Human.STILL + this.isShootingSprite() + this.weapon.name, 0);
	},
	
	getLogic: function() { return this.getComponent("logic"); },
	
	die: function(bullet) {
		this.base(bullet);
		this.shootTimer.destroy();
		this.remove(this.getComponent("logic"));
		this.field.notifier.unsubscribe(Bullet.INCOMING_EVENT, this.getLogic());
		this.field.notifier.unsubscribe(Human.CLIP_EMPTY, this.getLogic());
		this.field.notifier.unsubscribe(Human.RELOADED, this.getLogic());
	},
	
	release: function() {
		this.base();
		this.shootTimer = null;
	}

	}, { // Static
		getClassName: function() {
			return "Enemy";
		},
	});

	return Enemy;
});