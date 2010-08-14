Engine.initObject("Weapon", "Base", function() {
	var Weapon = Base.extend({
		name: null,
		owner: null,
		field: null,
		clipCapacity: 0,
		shotsInClip: 0,
		automatic: false,
		roundsPerMinute: 0,
		projectilesPerShot: 0,
		timeToReload: 0,
		lastShot: 0,
		projectileVelocityVariability: 1,
		
		constructor: function(owner, field, name, clipCapacity, automatic, roundsPerMinute, projectilesPerShot, timeToReload, projectileVelocityVariability) {
			this.owner = owner;
			this.field = field;
			this.name = name;
			this.clipCapacity = clipCapacity;
			this.shotsInClip = clipCapacity;
			this.automatic = automatic;
			this.roundsPerMinute = roundsPerMinute;
			this.projectilesPerShot = projectilesPerShot;
			this.timeToReload = timeToReload;
			this.projectileVelocityVariability = projectileVelocityVariability;
		},
		
		muzzleFlashSpread: 15,
		muzzleParticleCount: 10,
		muzzleParticleTTL: 500,
		shoot: function() {
			if(!this.isClipEmpty() && !this.isReloading())
			{
				if(this.passSemiAutomaticCheck())
				{
					for(var x = 0; x < this.projectilesPerShot; x++)
						this.field.renderContext.add(Bullet.create(this, this.projectileVelocityVariability));

					var gunTipInWorld = this.getGunTip();
					var particles = [];
					for(var x = 0; x < this.muzzleParticleCount; x++)
						particles[x] = BurnoutParticle.create(gunTipInWorld, this.owner.getGunAngle(), this.owner.velocity, this.muzzleFlashSpread, this.muzzleParticleTTL);
					this.field.pEngine.addParticles(particles);
					this.shotsInClip -= 1;
					this.lastShot = new Date().getTime();
				}
			}
			else
				this.field.notifier.post(Human.CLIP_EMPTY, this);
		},
		
		// the faster the shooter shoots, the wilder their shots go
		recoil: function(baseSpread, timeRequiredForDeadAim, steadiness) {
			var now = new Date().getTime();
			var timeSinceLastShot = now - this.lastShot;
			
			var spread = (baseSpread / 2) - (Math.random() * baseSpread); // basic inaccuracy even with very slow firing
			if(timeSinceLastShot < timeRequiredForDeadAim)
				spread += (timeRequiredForDeadAim - timeSinceLastShot) / steadiness;
				
			var shootAngle = (this.owner.getGunAngle() - (spread / 2)) + (Math.random() * spread);
			var dir = Math2D.getDirectionVector(Point2D.ZERO, Bullet.tip, shootAngle);
			return dir;
		},
		
		shootKeyHasBeenUpSinceLastShot: true,
		shootKeyUp: function() { this.shootKeyHasBeenUpSinceLastShot = true; },
		shootKeyDown: function() { this.shootKeyHasBeenUpSinceLastShot = false; },
		isShootKeyHasBeenUpSinceLastShot: function() { return this.shootKeyHasBeenUpSinceLastShot; },
		
		// either not player, or automatic weapon, or player has let shoot key up since last shot
		passSemiAutomaticCheck: function() {
			return !(this.owner instanceof Player) || this.automatic == Weapon.AUTOMATIC || this.isShootKeyHasBeenUpSinceLastShot();
		},
		
		shooting: "Notshooting",
		startShooting: function(shooting) { this.shooting = Weapon.SHOOTING; },
		stopShooting: function(shooting) {
			this.owner.stoppedShooting();
			this.shooting = Weapon.NOT_SHOOTING;
		},
		isShooting: function() { return this.shooting == Weapon.SHOOTING; },
		
		// keyboard repeat doesn't kick in right away
		handleAutomatic: function() {
			if(this.isShooting())
				if(this.automatic == Weapon.AUTOMATIC)
					if(new Date().getTime() - this.lastShot > this.timeBetweenShots())
						this.shoot();
		},
		
		timeBetweenShots: function() {
			return (60 * 1000) / this.roundsPerMinute;
		},
		
		reloadBegun: 0,  // time reload was started
		reloadDelay: 2000,
		reload: function() {
			if(!this.isReloading())
			{
				this.reloadBegun = new Date().getTime();
				this.reloading = true;
			}
		},

		// if reloading and the time to reload has elapsed, fill clip
		handleReload: function() {
			if(this.reloading)
				if(new Date().getTime() - this.reloadBegun > this.reloadDelay) // reload period has passed
				{
					this.fillClip();
					this.reloading = false;
					this.field.notifier.post(Human.RELOADED, this);
				}
		},

		reloading: false,
		isReloading: function() { return this.reloading; },

		fillClip: function() {
			this.shotsInClip = this.clipCapacity;
		},

		isClipEmpty: function() {
			return this.shotsInClip == 0;
		},
		
		getGunTip: function() {
			return Point2D.create(this.owner.getGunTip()).add(this.owner.getPosition());
		},
		
	}, {
		getClassName: function() { return "Weapon"; },
		
		tip: new Point2D(0, -1), // The tip of the owner at zero rotation (up)
		
		SEMI_AUTOMATIC: "semi_automatic",
		AUTOMATIC: "automatic",
		
		SHOOTING: "Shooting",
		NOT_SHOOTING: "Notshooting",
		
		SWITCH: "switch" // a weapon switch event
	});

	return Weapon;
});