Engine.initObject("SPAS", "Weapon", function() {
	var SPAS = Weapon.extend({
		timeRequiredForDeadAim: 1000,
				
		constructor: function(owner) {
			this.base(owner, owner.field, SPAS.getClassName(), SPAS.CLIP_CAPACITY, Weapon.SEMI_AUTOMATIC, SPAS.ROUNDS_PER_MINUTE,
								SPAS.PROJECTILES_PER_SHOT, SPAS.TIME_TO_RELOAD, SPAS.PROJECTILE_VELOCITY_VARIABILITY);
		},
		
		bulletPhysics: function() {
			return this.recoil(SPAS.BASE_SPREAD, SPAS.TIME_REQUIRED_FOR_DEAD_AIM, SPAS.STEADINESS);
		},
		
	}, {
		getClassName: function() { return "SPAS"; },
		
		CLIP_CAPACITY: 6,
		ROUNDS_PER_MINUTE: 999999,
		PROJECTILES_PER_SHOT: 5,
		TIME_TO_RELOAD: 2000,
		
		BASE_SPREAD: 60,
		TIME_REQUIRED_FOR_DEAD_AIM: 1000,
		STEADINESS: 30,
		
		PROJECTILE_VELOCITY_VARIABILITY: 0.5
	});

	return SPAS;
});