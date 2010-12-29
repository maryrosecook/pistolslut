Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Enemy", "Human", function() {

var Enemy = Human.extend({
    improvement: 0,

	constructor: function(name, field, position, health, weaponName, grenadeThrower, improvement) {
		this.turn(Collider.LEFT);
		this.base(name, field, position, health, weaponName, grenadeThrower);
        this.improvement = improvement;

		this.add(AIComponent.create("logic" + this.name, null, this.field, this, "enemyai"));
	},

	getLogic: function() { return this.getComponent("logic" + this.name); },

	setupWeapons: function(weaponName) {
		this.weapons.push(new M9(this));
		this.weapons.push(new Mac10(this));
		this.weapons.push(new SPAS(this));
		this.weapons.push(new Mortar(this));
		this.base(weaponName);
	},

	die: function(ordinance) {
		this.base(ordinance);
		this.getLogic().removeFromHost();
		this.field.notifier.unsubscribe(Human.INCOMING, this.getLogic());
		this.field.notifier.unsubscribe(Human.RELOADED, this.getLogic());
	},

    who: function() { return Human.ENEMY },

	release: function() {
		this.base();
	}

	}, {
		getClassName: function() { return "Enemy"; },

	});

	return Enemy;
});