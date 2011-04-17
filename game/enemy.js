Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Enemy", "Human", function() {

var Enemy = Human.extend({
    accuracy: 1.0,

	constructor: function(name, field, position, typeData, direction) {
		this.turn(Collider.LEFT);
		this.base(name, field, position, typeData.health, typeData.weapons, typeData.grenadeThrower);
        this.accuracy = typeData.accuracy;

        if(direction !== undefined)
            this.turn(direction);

		this.add(AIComponent.create("logic" + this.name, null, this.field, this, "enemyai"));
	},

	getLogic: function() { return this.getComponent("logic" + this.name); },

    getAllies: function() { return this.field.level.liveEnemies; },

    spotterCompatible: function() {
        if(this.weapon.isSpotterCompatible())
            if(this.weapon.hasAmmoLeft())
                return true;

        return false;
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