Engine.initObject("M9", "Weapon", function() {
	var M9 = Weapon.extend({
		
		constructor: function(owner) {
			this.base(owner, owner.field, M9.getClassName(), M9.CLIP_CAPACITY, Weapon.SEMI_AUTOMATIC, M9.ROUNDS_PER_MINUTE,
								M9.PROJECTILES_PER_SHOT, M9.TIME_TO_RELOAD, Bullet, M9.PROJECTILE_VELOCITY_VARIABILITY,
								M9.DISCHARGE_DELAY, M9.TIME_REQUIRED_FOR_DEAD_AIM);
		},
		
		ordinancePhysics: function() {
			return this.recoil(M9.BASE_SPREAD, M9.TIME_REQUIRED_FOR_DEAD_AIM, M9.STEADINESS);
		},
		
	}, {
		getClassName: function() { return "M9"; },
		
		CLIP_CAPACITY: 10,
		ROUNDS_PER_MINUTE: 999999,
		PROJECTILES_PER_SHOT: 1,
		TIME_TO_RELOAD: 1000,
		
		TIME_REQUIRED_FOR_DEAD_AIM: 1000,
		STEADINESS: 100,
		
		BASE_SPREAD: 2,
		PROJECTILE_VELOCITY_VARIABILITY: 0.5,
		DISCHARGE_DELAY: 0,
	});

	return M9;
});