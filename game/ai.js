Engine.include("/components/component.logic.js");

Engine.initObject("AIComponent", "LogicComponent", function() {
	var AIComponent = LogicComponent.extend({
		field: null,

		// I know it's insane to pass the host in the constructer, but it doesn't seem to be available at this point
		constructor: function(name, priority, field, host) {
	  	this.base(name, priority || 1.0);
			this.field = field;

			// subscribe to events the enemy cares about
			this.field.notifier.subscribe(Human.INCOMING, this, this.notifyIncoming);
			this.field.notifier.subscribe(Human.CLIP_EMPTY, this, this.notifyWeaponEmpty);
			this.field.notifier.subscribe(Human.RELOADED, this, this.notifyReloaded);
			this.field.notifier.subscribe(Human.SHOT, this, this.notifyShot);
			//this.field.notifier.subscribe("playerMove", this, this.playerMove);

			// setup shoot timer
			var ai = this;
			host.shootTimer = Interval.create("shoot", 1000,
				function() {
					ai.notifyTimeToShoot();
			});
			
			// setup grenade throw timer
			if(host.canThrowGrenades)
			{
				host.grenadeTimer = Interval.create("shoot", host.grenadeThrowDelay,
					function() {
						ai.notifyTimeToThrowGrenade();
				});
			}
	  },

		notifyShot: function() {
			this.reactToBeingUnderFire();
		},

		notifyTimeToShoot: function() {
			var host = this.getHostObject();
			if(this.isEnemyInSights()
				 && !this.friendliesInLineOfFire()
				 && !this.furnitureInLineOfFire())
				host.shoot();
		},
		
		notifyTimeToThrowGrenade: function() {
			var host = this.getHostObject();
			if(this.isEnemyInSights()
				 && host.canThrowGrenades == true
				 && !host.isCrouching())
				host.throwGrenade();
		},
		
		notifyReloaded: function() {
			this.notifyTimeToShoot(); // try and start shooting right away
		},
		
		notifyIncoming: function(ordinance) {
			var host = this.getHostObject();
			if(ordinance.shooter != host)
				if(!this.field.collider.objectDistanceAway(host, ordinance, ordinance.safeDistance))
					this.reactToBeingUnderFire();
		},
		
		reactToBeingUnderFire: function() {
			this.lastUnderFire = new Date().getTime();
			this.getHostObject().crouch();
		},
		
		// tell AI that clip is empty
		notifyWeaponEmpty: function(emptyGun) {
			var host = this.getHostObject();
			if(emptyGun.owner == host)
				host.crouch();
		},
		
		isEnemyInSights: function() { return this.field.playerObj != null && this.field.inView(this.getHostObject()); },

		execute: function(renderContext, time) {
			var host = this.getHostObject();
			if(host.isCrouching() && !host.weapon.isReloading() && host.canStand() && this.noUnsafeIncomingForAWhile())
				host.stand();
				
			this.turnTowardsPlayer();
		},
		
		lineOfFireSafetyMargin: 5, // add this to top and bottom of potential target to be on safer side
		friendliesInLineOfFire: function() {
			var host = this.getHostObject();
			var playerEnemies = this.field.level.liveEnemies();
			if(host.weapon.hasLineOfFire() == true)
				for(var i in playerEnemies)
					if(host != playerEnemies[i])
						if(this.field.collider.inLineOfFire(host, playerEnemies[i], this.lineOfFireSafetyMargin))
							return true;
			
			return false;
		},
		
		furnitureBlockRange: 100,
		furnitureInLineOfFire: function() {
			var furniture = this.field.level.furniture;
			var host = this.getHostObject();
			if(host.weapon.hasLineOfFire() == true)
				for(var i in furniture)
					if(!this.field.collider.objectDistanceAway(host, furniture[i], this.furnitureBlockRange))
						if(this.field.collider.inLineOfFire(host, furniture[i]))
							return true;
						
			return false;
		},
		
		turnTowardsPlayer: function() {
			if(this.field.playerObj) // player might not have been created, yet
			{
				var host = this.getHostObject();
			
				var dirToTurn = Collider.LEFT;
				if(host.getPosition().x < this.field.playerObj.getPosition().x) // host on left
					dirToTurn = Collider.RIGHT;
				
				if(host.direction != dirToTurn)
					host.turn(dirToTurn);
			}
		},
		
		lastUnderFire: 0,
		safeIntervalAfterUnsafe: 2000, 
		noUnsafeIncomingForAWhile: function() {
			return new Date().getTime() - this.lastUnderFire > this.safeIntervalAfterUnsafe;
		},
		
		removeFromHost: function() {
			var host = this.getHostObject();
			host.shootTimer.destroy();
			host.shootTimer = null;
			if(host.grenadeTimer != null)
			{
				host.grenadeTimer.destroy();
				host.grenadeTimer = null;
			}
			host.remove(this);
		},

	}, {
	  getClassName: function() { return "AIComponent"; }
	
	});

	return AIComponent;
});