Engine.initObject("Weapon", "Base", function() {
	var Weapon = Base.extend({
		name: null,
		owner: null,
		field: null,
		shotsInClip: 0,
		lastShot: 0,
		
		constructor: function(owner, field, name) {
			this.owner = owner;
			this.field = field;
			this.name = name;
			this.shotsInClip = this.clipCapacity;
			
			this.field.notifier.subscribe(Weapon.SWITCH, this, this.notifyWeaponSwitch);
		},
		
		notifyWeaponSwitch: function(weapon) {
			if(this != weapon) // if not switched to this weapon, stop an in progress reload
				this.reloading = false;
			else
				this.reload(); // if just switched to this weapon, start it reloading
		},
		
		setPose: function() { },
		canStand: function() { return true; },
		hasLineOfFire: function() { return true; }, // false for weapons with indirect fire
		
		dischargeTime: null,
		setFutureDischarge: function() { this.dischargeTime = new Date().getTime() + this.dischargeDelay; },
			
		handleDischarge: function(time) {
			if(this.dischargeTime != null && this.dischargeTime < time)
				this.discharge();
		},
		
		// actually fires the weapon
		discharge: function() {	
			if(this.owner.isAlive() == true)
			{
				// generate the ordinance
				for(var x = 0; x < this.projectilesPerShot; x++)
				{
					
					this.field.renderContext.add(eval(this.projectileClazz).create(this, this.projectileBaseSpeed, this.projectileVelocityVariability));
				}

				this.muzzleFlash();

				this.shotsInClip -= 1;
				this.lastShot = new Date().getTime();
				if(this.owner instanceof Player)
					this.field.notifier.post(Weapon.SHOOT, this);
			}
			this.dischargeTime = null;
		},
		
		// either fires weapon or sets it to fire in the future if there is a delay
		shoot: function() {
			if(this.dischargeTime == null && !this.isClipEmpty())
			{
				if(this.passSemiAutomaticCheck())
				{
					this.startShooting();

					// stop an in progress reload
					if(this.isReloading())
						this.reloading = false;
					
					if(this.dischargeDelay == 0) // just discharge weapon immediately
						this.discharge();
					else
						this.setFutureDischarge();
				}
			}

			if(this.isClipEmpty())
			{
				this.reload(); // auto reload
				this.field.notifier.post(Human.CLIP_EMPTY, this);		
			}
		},
		
		muzzleFlashSpread: 15,
		muzzleParticleCount: 10,
		muzzleParticleTTL: 500,
		muzzleFlash: function() {
			var gunTipInWorld = this.getGunTip();
			var particles = [];
			for(var x = 0; x < this.muzzleParticleCount; x++)
				particles[x] = BurnoutParticle.create(gunTipInWorld, this.owner.getGunAngle(), this.owner.velocity, this.muzzleFlashSpread, this.muzzleParticleTTL);
			this.field.pEngine.addParticles(particles);
		},
		
		// the faster the shooter shoots, the wilder their shots go
		recoil: function(baseSpread, timeRequiredForDeadAim, steadiness) {
			var timeSinceLastShot = new Date().getTime() - this.lastShot;
			
			var spread = baseSpread;
			if(timeSinceLastShot < timeRequiredForDeadAim)
				spread += (timeRequiredForDeadAim - timeSinceLastShot) / steadiness;
				
			var shootAngle = this.owner.getGunAngle() - (spread / 2) + (Math.random() * spread);
			return Math2D.getDirectionVector(Point2D.ZERO, Ordinance.tip, shootAngle);
		},
		
		shootKeyHasBeenUpSinceLastShot: true,
		shootKeyUp: function() {
			this.stopShooting();
			this.shootKeyHasBeenUpSinceLastShot = true;
		},
		shootKeyDown: function() { this.shootKeyHasBeenUpSinceLastShot = false; },
		isShootKeyHasBeenUpSinceLastShot: function() { return this.shootKeyHasBeenUpSinceLastShot; },
		
		// either not player, or automatic weapon, or player has let shoot key up since last shot
		passSemiAutomaticCheck: function() {
			return this.automatic == Weapon.AUTOMATIC || !(this.owner instanceof Player) || this.isShootKeyHasBeenUpSinceLastShot();
		},
		
		shooting: "Notshooting",
		startShooting: function() {  this.shooting = Weapon.SHOOTING; },
		stopShooting: function() {
			this.owner.stoppedShooting();
			this.shooting = Weapon.NOT_SHOOTING;
		},
		isShooting: function() { return this.shooting == Weapon.SHOOTING; },
		
		// keyboard repeat doesn't kick in right away
		handleAutomatic: function(time) {
			if(this.isShooting())
				if(this.automatic == Weapon.AUTOMATIC)
					if(time - this.lastShot > this.timeBetweenShots())
						this.shoot();
		},
		
		timeBetweenShots: function() {
			return (60 * 1000) / this.roundsPerMinute;
		},
		
		reloadBegun: 0,  // time reload was started
		reload: function() {
			if(!this.isReloading())
			{
				this.reloadBegun = new Date().getTime();
				this.reloading = true;
			}
		},

		// if reloading and the time to reload has elapsed, fill clip
		handleReload: function(time) {
			if(this.reloading)
				if(time - this.reloadBegun > this.timeToReload) // reload period has passed
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
		
		// if weapon owner is the player, returns number of shots in clip for the ammo meter
		getMeterReading: function() {
			if(this.owner instanceof Player)
				return this.shotsInClip;
			else
				return null;
		},
		
		// if weapon owner is the player, returns number of shots in clip for the ammo meter
		getMeterMax: function() {
			if(this.owner instanceof Player)
				return this.clipCapacity;
			else
				return null;
		},
		
		getGunTip: function() { return Point2D.create(this.owner.getRelativeGunTip()).add(this.owner.getPosition()); },
		
		release: function() {
			this.base();
			this.owner = null;
			this.field = null;
			this.clipCapacity = 0;
			this.shotsInClip = 0;
			this.automatic = null;
			this.roundsPerMinute = 0;
			this.projectilesPerShot = 0;
			this.timeToReload = 0;
			this.lastShot = 0;
			this.projectileVelocityVariability = 1;
			this.projectileClazz = null;
		},
		
	}, {
		getClassName: function() { return "Weapon"; },
		
		tip: new Point2D(0, -1), // The tip of the owner at zero rotation (up)
		
		SEMI_AUTOMATIC: "semi_automatic",
		AUTOMATIC: "automatic",
		
		SHOOTING: "Shooting",
		NOT_SHOOTING: "Notshooting",
		
		SWITCH: "switch", // a weapon switch event
		SHOOT: "shoot" // weapon actually shot
	});

	return Weapon;
});