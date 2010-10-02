Engine.initObject("Mortar", "Weapon", function() {
	var Mortar = Weapon.extend({
				
		constructor: function(owner) {
			this.base(owner, owner.field, Mortar.getClassName(), Mortar.CLIP_CAPACITY, Weapon.SEMI_AUTOMATIC, Mortar.ROUNDS_PER_MINUTE,
								Mortar.PROJECTILES_PER_SHOT, Mortar.TIME_TO_RELOAD, MortarRound, Mortar.PROJECTILE_VELOCITY_VARIABILITY);
		},
		
		bulletPhysics: function() {
			return this.recoil(Mortar.BASE_SPREAD, Mortar.TIME_REQUIRED_FOR_DEAD_AIM, Mortar.STEADINESS);
		},
		
	}, {
		getClassName: function() { return "Mortar"; },
		
		CLIP_CAPACITY: 1,
		ROUNDS_PER_MINUTE: 10,
		PROJECTILES_PER_SHOT: 1,
		TIME_TO_RELOAD: 6000,
		
		BASE_SPREAD: 60,
		TIME_REQUIRED_FOR_DEAD_AIM: 0,
		STEADINESS: 1,
		
		PROJECTILE_VELOCITY_VARIABILITY: 0.5
	});

	return Mortar;
});