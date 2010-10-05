Engine.initObject("Mortar", "Weapon", function() {
	var Mortar = Weapon.extend({
				
		constructor: function(owner) {
			this.base(owner, owner.field, Mortar.getClassName(), Mortar.CLIP_CAPACITY, Weapon.SEMI_AUTOMATIC, Mortar.ROUNDS_PER_MINUTE,
								Mortar.PROJECTILES_PER_SHOT, Mortar.TIME_TO_RELOAD, MortarRound, Mortar.PROJECTILE_VELOCITY_VARIABILITY,
								Mortar.DISCHARGE_DELAY, Mortar.TIME_REQUIRED_FOR_DEAD_AIM);
		},
		
		ordinancePhysics: function() {
			return this.recoil(Mortar.BASE_SPREAD, Mortar.TIME_REQUIRED_FOR_DEAD_AIM, Mortar.STEADINESS);
		},
		
		setPose: function() {
			this.base();
			this.owner.crouch();
		},
		
		canStand: function() { return false; },
		
	}, {
		getClassName: function() { return "Mortar"; },
		
		CLIP_CAPACITY: 1,
		ROUNDS_PER_MINUTE: 30,
		PROJECTILES_PER_SHOT: 1,
		TIME_TO_RELOAD: 1099,
		
		TIME_REQUIRED_FOR_DEAD_AIM: 2000,
		STEADINESS: 1,
		
		BASE_SPREAD: 0,
		PROJECTILE_VELOCITY_VARIABILITY: 0.1,
		
		DISCHARGE_DELAY: 900,
	});

	return Mortar;
});