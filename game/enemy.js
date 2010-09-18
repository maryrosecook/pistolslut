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

	constructor: function(name, field, position, health, weaponName, canThrowGrenades) {
		this.direction = Collider.LEFT;
		this.base(name, field, position, health, weaponName, canThrowGrenades);
		
		this.add(AIComponent.create("logic" + this.name, null, this.field, this));
	},
	
	getLogic: function() { return this.getComponent("logic" + this.name); },
	
	die: function(ordinance) {
		this.base(ordinance);
		this.getLogic().removeFromHost();
		this.field.notifier.unsubscribe(Human.INCOMING, this.getLogic());
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