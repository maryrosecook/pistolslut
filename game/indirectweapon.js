Engine.initObject("IndirectWeapon", "Weapon", function() {
	var IndirectWeapon = Weapon.extend({
		crosshair: null,
        x: null, // a custom x distance to fire

        shotsSinceTargetMoved: 0,
        lastTargetPositionX: null,
        lastX: 0,

		constructor: function(name, owner) {
			this.base(name, owner, owner.field);
			this.automatic = Weapon.SEMI_AUTOMATIC;

			this.crosshair = new Crosshair(this.field, this);
			this.field.renderContext.add(this.crosshair);
		},

		started: null,
        stopped: null,
        isAiming: function() { return this.started !== null; },
		startAim: function() {
			if(this.started == null && !this.isShooting() && this.allowedToFire())
			{
				this.started = new Date().getTime();
				this.crosshair.show();
			}
		},
        stopAim: function() {
            this.stopped = new Date().getTime();
        },

		ordinancePhysics: function() {
			return this.getVector();
		},

        shoot: function() {
            this.base();
            this.stopAim();
        },

		discharge: function() {
            this.handleZeroingIn();
			this.base();

			this.stopShooting();
			this.crosshair.hide();
		    this.resetRange();
		},

        // keeps count of number of shots since target last moved. Used for accuracy of indirect weapons.
        handleZeroingIn: function() {
            var currentPlayerPosition = this.field.playerObj.getPosition();
            if(this.lastTargetPositionX == currentPlayerPosition.x)
                this.shotsSinceTargetMoved += 1;
            else
            {
                this.lastX = 0;
                this.shotsSinceTargetMoved = 0;
            }

            this.lastTargetPositionX = currentPlayerPosition.x;
        },

        resetRange: function() {
            this.started = null;
            this.stopped = null;
            this.x = null;
        },

		getCrosshairPosition: function() {
			return Point2D.create(this.owner.getPosition().x + this.getX(), this.field.groundY);
		},

        setX: function(x) { this.x = x; }, // set a custom firing distance
		getX: function() {
			var dir = this.owner.direction;

            var x = null;
            if(this.owner.who() == Human.ENEMY) // enemies set x by hand
            {
                var perfectShotX = this.owner.getPosition().x - this.field.playerObj.getPosition().x;
                var lastMissedBy = Math.abs(perfectShotX - this.lastX);

                var steadiness = this.owner.accuracy;
                if(this instanceof GrenadeLauncher || this.owner.spotter !== null) // if grenade or have a spotter, improve with each shot
                    steadiness += this.shotsSinceTargetMoved;

                var missBy = lastMissedBy / (steadiness / Math.random());
                if(this.lastX > perfectShotX)
                    x = perfectShotX - missBy;
                else
                    x = perfectShotX + missBy;

                this.lastX = x;
            }
            else // human so use aiming crosshair
            {
                var timeDelta = null;
                if(this.stopped)
                    timeDelta = this.stopped - this.started;
                else
                    timeDelta = new Date().getTime() - this.started;

			    x = Math.min(this.getMinPlayerRange() + (timeDelta / Crosshair.RANGE_GROWTH_ATTENUATION), this.getMaxPlayerRange());
            }

			if(this.owner.direction == Collider.LEFT)
				x = -x;

			return x;
		},

        getMinPlayerRange: function() { return this.playerRanges[this.owner.direction][IndirectWeapon.MIN_RANGE]; },
        getMaxPlayerRange: function() { return this.playerRanges[this.owner.direction][IndirectWeapon.MAX_RANGE]; },

		getVector: function() { // x is pos or neg, depending on which way facing
			var fpsFlightTime = this.flightSecs * this.field.engineFPS;
			var gunToGroundY = this.field.groundY - Point2D.create(this.getGunTip()).y;
			var diff = Vector2D.create(this.getX(), gunToGroundY);

		 	var velocity = Vector2D.create(0, 0);
		 	velocity.setX(diff.x / fpsFlightTime);
		 	velocity.setY(-(-(diff.y / fpsFlightTime) + (0.5 * this.field.gravityVector.y * fpsFlightTime)));

			return velocity;
		},

	}, {
		getClassName: function() { return "IndirectWeapon"; },

        MIN_RANGE: "min_range",
		MAX_RANGE: "max_range",
	});

	return IndirectWeapon;
});