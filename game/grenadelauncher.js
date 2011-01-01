Engine.initObject("GrenadeLauncher", "IndirectWeapon", function() {
	var GrenadeLauncher = IndirectWeapon.extend({
		constructor: function(owner) {
            this.clipCapacity = 999999999999999; // not reloaded
			this.base(GrenadeLauncher.getClassName(), owner);

			this.roundsPerMinute = 60;
			this.projectilesPerShot = 1;
			this.timeToReload = 1000;
            this.dischargeDelay = 300;
            this.animationTime = 600;
			this.timeRequiredForDeadAim = 1000;
            this.playerRanges = GrenadeLauncher.PLAYER_RANGES;
            this.flightSecs = 1.5
			this.projectileVelocityVariability = 0;
            this.hasMuzzleFlash = false;
		},

		generateOrdinance: function() { return Grenade.create(this); },
        hasLineOfFire: function() { return false; },
	}, {
		getClassName: function() { return "GrenadeLauncher"; },

        PLAYER_RANGES: {
	        "Left": { "min_range": 150, "max_range": 150 },
			"Right": { "min_range": 150, "max_range": 385 },
		},
	});

	return GrenadeLauncher;
});