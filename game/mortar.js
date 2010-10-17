Engine.initObject("Mortar", "Weapon", function() {
	var Mortar = Weapon.extend({
		
		constructor: function(owner) {
			this.clipCapacity = 1;
			this.base(owner, owner.field, Mortar.getClassName());
			this.automatic = Weapon.SEMI_AUTOMATIC;
			this.roundsPerMinute = 30;
			this.projectilesPerShot = 1;
			this.timeToReload = 1099;
			this.projectileVelocityVariability = 0.3;
			this.dischargeDelay = 1100;
			this.timeRequiredForDeadAim = 2000;
			this.projectileBaseSpeed = 16;
			this.projectileClazz = MortarRound;
		},
		
		ordinancePhysics: function() {
			return this.recoil(Mortar.BASE_SPREAD, Mortar.TIME_REQUIRED_FOR_DEAD_AIM, Mortar.STEADINESS);
		},
		
		setPose: function() {
			this.base();
			this.owner.crouch();
		},
		
		canStand: function() { return false; },
		hasLineOfFire: function() { return false; },
		
	}, {
		getClassName: function() { return "Mortar"; },
		
		TIME_REQUIRED_FOR_DEAD_AIM: 2000,
		STEADINESS: 1,
		BASE_SPREAD: 0,
	});

	return Mortar;
});