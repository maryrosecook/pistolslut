Engine.initObject("Mortar", "IndirectWeapon", function() {
	var Mortar = IndirectWeapon.extend({
		constructor: function(owner) {
            this.clipCapacity = 1;
            this.spareClips = 2;
			this.base(Mortar.getClassName(), owner);

			this.roundsPerMinute = 30;
			this.projectilesPerShot = 1;
			this.timeToReload = 1099;
            this.dischargeDelay = 1100;
            this.animationTime = 2000;
			this.timeRequiredForDeadAim = 2000;
            this.playerRanges = Mortar.PLAYER_RANGES;
            this.flightSecs = 2.0;
			this.projectileVelocityVariability = 0;
            this.hasMuzzleFlash = true;
		},

		generateOrdinance: function() { return MortarRound.create(this); },

        hasLineOfFire: function() { return false; },
        isSpotterCompatible: function() { return true; },

        canStand: function() { return false; },
        setPose: function() {
			this.base();
			this.owner.crouch();
		},
	}, {
		getClassName: function() { return "Mortar"; },

		PLAYER_RANGES: {
	        "Left": { "min_range": 150, "max_range": 150 },
			"Right": { "min_range": 150, "max_range": 385 },
		},
	});

	return Mortar;
});