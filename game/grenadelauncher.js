Engine.initObject("GrenadeLauncher", "IndirectWeapon", function() {
	var GrenadeLauncher = IndirectWeapon.extend({
		constructor: function(owner) {
            this.clipCapacity = 3;
			this.base(GrenadeLauncher.getClassName(), owner);

			this.roundsPerMinute = 60;
			this.projectilesPerShot = 1;
			this.timeToReload = 1000;
            this.dischargeDelay = 200;
            this.animationTime = 400;
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

        THROW: "throw",
        MAX_GRENADES: 3,
        METER_CARET_SPACING: 14,
	});

	return GrenadeLauncher;
});