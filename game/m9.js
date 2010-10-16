Engine.initObject("M9", "Weapon", function() {
	var M9 = Weapon.extend({
		
		constructor: function(owner) {
			this.clipCapacity = 10;
			this.base(owner, owner.field, M9.getClassName());
			this.automatic = Weapon.SEMI_AUTOMATIC;
			this.roundsPerMinute = 999999;
			this.projectilesPerShot = 1;
			this.timeToReload = 1000;
			this.projectileVelocityVariability = 0.5;
			this.dischargeDelay = 0;
			this.timeRequiredForDeadAim = 1000;
			this.projectileBaseSpeed = 15;
			this.projectileClazz = Bullet;
		},
		
		ordinancePhysics: function() {
			return this.recoil(M9.BASE_SPREAD, M9.TIME_REQUIRED_FOR_DEAD_AIM, M9.STEADINESS);
		},
		
	}, {
		getClassName: function() { return "M9"; },

		TIME_REQUIRED_FOR_DEAD_AIM: 1000,
		STEADINESS: 100,	
		BASE_SPREAD: 2,
	});

	return M9;
});