Engine.initObject("Mac10", "Weapon", function() {
	var Mac10 = Weapon.extend({
		
		constructor: function(owner) {
			this.base(owner, owner.field, Mac10.getClassName(), Mac10.CLIP_CAPACITY, Weapon.AUTOMATIC, Mac10.ROUNDS_PER_MINUTE,
								Mac10.PROJECTILES_PER_SHOT, Mac10.TIME_TO_RELOAD, Bullet, Mac10.PROJECTILE_VELOCITY_VARIABILITY,
								Mac10.DISCHARGE_DELAY, Mac10.TIME_REQUIRED_FOR_DEAD_AIM);
		},
		
		ordinancePhysics: function() {
			return this.recoil(Mac10.BASE_SPREAD, Mac10.TIME_REQUIRED_FOR_DEAD_AIM, Mac10.STEADINESS);
		},
		
	}, {
		getClassName: function() { return "Mac10"; },
		
		CLIP_CAPACITY: 30,
		ROUNDS_PER_MINUTE: 700,
		PROJECTILES_PER_SHOT: 1,
		TIME_TO_RELOAD: 2000,
		
		TIME_REQUIRED_FOR_DEAD_AIM: 1000,
		STEADINESS: 70,
		
		BASE_SPREAD: 5,
		PROJECTILE_VELOCITY_VARIABILITY: 0.5,
		DISCHARGE_DELAY: 0,
	});

	return Mac10;
});