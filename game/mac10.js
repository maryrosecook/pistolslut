Engine.initObject("Mac10", "Weapon", function() {
	var Mac10 = Weapon.extend({
		
		constructor: function(owner) {
			this.clipCapacity = 30;
			this.base(owner, owner.field, Mac10.getClassName());
			this.automatic = Weapon.AUTOMATIC;
			this.roundsPerMinute = 700;
			this.projectilesPerShot = 1;
			this.timeToReload = 2000;
			this.projectileVelocityVariability = 0.5;
			this.dischargeDelay = 0;
			this.timeRequiredForDeadAim = 1000;
			this.projectileBaseSpeed = 15;
			this.projectileClazz = Bullet;
		},
		
		ordinancePhysics: function() {
			return this.recoil(Mac10.BASE_SPREAD, Mac10.TIME_REQUIRED_FOR_DEAD_AIM, Mac10.STEADINESS);
		},
		
	}, {
		getClassName: function() { return "Mac10"; },

		TIME_REQUIRED_FOR_DEAD_AIM: 1000,
		STEADINESS: 70,
		BASE_SPREAD: 5,
	});

	return Mac10;
});