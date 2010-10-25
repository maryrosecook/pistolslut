Engine.initObject("GrenadeLauncher", "Weapon", function() {
	var GrenadeLauncher = Weapon.extend({
		crosshair: null,
		
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
			if(this.started == null)
			{
				this.started = new Date().getTime();
				this.crosshair.show();
			}
		},

		discharge: function() {
			this.base();
			this.crosshair.hide();
			this.started = null;
		},
		
		getCrosshairPosition: function() {
			return Point2D.create(this.owner.getPosition().x + this.getDistance(), this.field.groundY);
		},

		getDistance: function() {
			var distance = null;
			if(this.started == null) // being thrown by an enemy - they don't aim
				var distance = GrenadeLauncher.MAX_RANGE;
			else
				var distance = Math.min(GrenadeLauncher.MIN_RANGE + ((new Date().getTime() - this.started) / GrenadeLauncher.RANGE_GROWTH_ATTEN), GrenadeLauncher.MAX_RANGE);
				
			if(this.owner.direction == Collider.LEFT)
				distance = -distance;

			return distance;
		},

		getVector: function() { // distance is pos or neg, depending on which way facing
			var distance = this.getDistance();
			var fpsFlightTime = GrenadeLauncher.FLIGHT_SECS * (this.field.engineFPS);
			var armToGroundY = this.field.groundY - Point2D.create(this.owner.getPosition()).add(this.owner.getRelativeArmTip()).y;
			var diff = Vector2D.create(distance, armToGroundY); 
			
		 	var velocity = Vector2D.create(0, 0);
		 	velocity.setX((diff.x * 0.9) / fpsFlightTime);
		 	velocity.setY((diff.y - (0.5 * this.field.gravityVector.y * fpsFlightTime * fpsFlightTime)) / fpsFlightTime);
		
			//console.log(distance, armToGroundY, velocity.x, velocity.y)
			return velocity;
		},
		
	}, {
		getClassName: function() { return "GrenadeLauncher"; },
		
		MIN_RANGE: 200,
		MAX_RANGE: 500,
		RANGE_GROWTH_ATTEN: 6,
		FLIGHT_SECS: 2,
	});

	return GrenadeLauncher;
});