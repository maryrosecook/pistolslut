Engine.initObject("GrenadeLauncher", "Weapon", function() {
	var GrenadeLauncher = Weapon.extend({
		crosshair: null,
		lastVector: null,
		
		constructor: function(owner) {
			this.clipCapacity = 99999999999;
			this.base(owner, owner.field, GrenadeLauncher.getClassName());
			this.automatic = Weapon.AUTOMATIC;
			this.roundsPerMinute = 60;
			this.projectilesPerShot = 1;
			this.timeToReload = 1000;
			this.projectileVelocityVariability = 0;
			this.dischargeDelay = 0;
			this.timeRequiredForDeadAim = 1000;
			
			this.crosshair = new Crosshair(this.field, this);
			this.field.renderContext.add(this.crosshair);
		},
		
		ordinancePhysics: function() {
			return this.getVector();
		},
				
		generateOrdinance: function() { return Grenade.create(this); },
		
		started: null,
		startAim: function() {
			if(this.started == null && !this.isShooting() && this.allowedToFire())
			{
				this.startShooting();
				this.started = new Date().getTime();
				this.crosshair.show();
			}
		},

		discharge: function() {
			this.base();
			this.stopShooting();
			this.crosshair.hide();
			this.started = null;
		},
		
		getCrosshairPosition: function() {
			return Point2D.create(this.owner.getPosition().x + this.getDistance(), this.field.groundY);
		},

		getDistance: function() {
			var dir = this.owner.direction;
			var distance = null;
			if(this.started == null) // being thrown by an enemy - they don't aim
				var distance = GrenadeLauncher.RANGES[dir][GrenadeLauncher.MIN_RANGE];
			else
				var distance = Math.min(GrenadeLauncher.RANGES[dir][GrenadeLauncher.MIN_RANGE] + ((new Date().getTime() - this.started) / GrenadeLauncher.RANGE_GROWTH_ATTEN), GrenadeLauncher.RANGES[dir][GrenadeLauncher.MAX_RANGE]);
				
			if(this.owner.direction == Collider.LEFT)
				distance = -distance;

			this.lastDistance = distance;

			return distance;
		},

		getVector: function() { // distance is pos or neg, depending on which way facing
			var fpsFlightTime = GrenadeLauncher.FLIGHT_SECS * this.field.engineFPS;
			var armToGroundY = this.field.groundY - Point2D.create(this.owner.getPosition()).add(this.owner.getRelativeArmTip()).y;
			var diff = Vector2D.create(this.lastDistance, armToGroundY); 

		 	var velocity = Vector2D.create(0, 0);
		 	velocity.setX(diff.x / fpsFlightTime * 0.8);
		 	velocity.setY(-((diff.y / fpsFlightTime) + (0.5 * this.field.gravityVector.y * fpsFlightTime)));

			return velocity;
		},
		
	}, {
		getClassName: function() { return "GrenadeLauncher"; },
		
		RANGES: {
			"Left": { "min_range": 150, "max_range": 150 },
			"Right": { "min_range": 150, "max_range": 500 },
		},
		
		MIN_RANGE: "min_range",
		MAX_RANGE: "max_range",
		RANGE_GROWTH_ATTEN: 4,
		FLIGHT_SECS: 1.5,
	});

	return GrenadeLauncher;
});