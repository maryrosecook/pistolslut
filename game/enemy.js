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
	grenadeThrowDelay: 5000,
	shootDelay: 1001,

	constructor: function(name, position, health, weaponName, canThrowGrenades) {
		this.direction = Collider.LEFT;
		this.base(name, position, health, weaponName, canThrowGrenades);
		
		this.add(AIComponent.create("logic", null, this.field, this));
		
		// subscribe to events the enemy cares about
		this.field.notifier.subscribe(Bullet.INCOMING_EVENT, this.getLogic(), this.getLogic().notifyIncoming);
		this.field.notifier.subscribe(Human.CLIP_EMPTY, this.getLogic(), this.getLogic().notifyWeaponEmpty);
		this.field.notifier.subscribe(Human.RELOADED, this.getLogic(), this.getLogic().notifyReloaded);
		//this.field.notifier.subscribe("playerMove", this.getLogic(), this.getLogic().playerMove);
	},
	
	getLogic: function() { return this.getComponent("logic"); },
	
	die: function(bullet) {
		this.base(bullet);
		this.getLogic().release();
		this.remove(this.getComponent("logic"));
		this.field.notifier.unsubscribe(Bullet.INCOMING_EVENT, this.getLogic());
		this.field.notifier.unsubscribe(Human.CLIP_EMPTY, this.getLogic());
		this.field.notifier.unsubscribe(Human.RELOADED, this.getLogic());
	},
	
	release: function() {
		this.base();
	}

	}, {
		getClassName: function() { return "Enemy"; },
		
	});

	return Enemy;
});