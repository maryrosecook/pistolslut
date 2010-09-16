Engine.include("/components/component.logic.js");

Engine.initObject("AIComponent", "LogicComponent", function() {
	var AIComponent = LogicComponent.extend({
		field: null,

		// I know it's insane to pass the host in the constructer, but it doesn't seem to be available at this point
		constructor: function(name, priority, field, host) {
	  	this.base(name, priority || 1.0);
			this.field = field;

			// setup grenade throw timer
			var ai = this;
			this.shootTimer = Interval.create("shoot", host.shootDelay,
				function() {
					ai.notifyTimeToShoot();
			});
			
			// setup grenade throw timer
			var ai = this;
			this.grenadeTimer = Interval.create("shoot", host.grenadeThrowDelay,
				function() {
					ai.notifyTimeToThrowGrenade();
			});
	  },

		notifyTimeToShoot: function() {
			var host = this.getHostObject();
			if(this.isEnemyInSights()
				 && !host.isCrouching() 
				 && !this.friendliesInLineOfFire())
				host.shoot();
		},
		
		notifyTimeToThrowGrenade: function() {
			var host = this.getHostObject();
			if(this.isEnemyInSights()
				 && host.canThrowGrenades == true)
				host.throwGrenade();
		},
		
		isEnemyInSights: function() {
			return this.field.playerObj != null && this.field.inView(this.getHostObject());
		},
		
		notifyReloaded: function() {
			this.notifyTimeToShoot(); // try and start shooting right away
		},
		
		notifyIncoming: function(ordinance) {
			var host = this.getHostObject();
			if(ordinance.shooter != host)
				if(!this.objectSafeDistanceAway(ordinance))
				{
					this.lastNearDeath = new Date().getTime();
					host.crouch();
				}
		},
		
		// tell AI that clip is empty
		notifyWeaponEmpty: function(emptyGun) {
			var host = this.getHostObject();
			if(emptyGun.owner == host) {
				host.weapon.reload();
				host.crouch();
			}
		},

		execute: function(renderContext, time) {
			var host = this.getHostObject();
			if(host.isCrouching() && !host.weapon.isReloading() && this.noUnsafeIncomingForAWhile())
				host.stand();
				
			this.turnTowardsPlayer();
		},
		
		friendliesInLineOfFire: function() {
			var host = this.getHostObject();
			var playerEnemies = this.field.level.liveEnemies();
			for(var i in playerEnemies)
				if(host != playerEnemies[i])
					if(this.field.collider.inLineOfFire(host, playerEnemies[i]))
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
		
		lastNearDeath: 0,
		safeIntervalAfterUnsafeIncoming: 2000, 
		noUnsafeIncomingForAWhile: function() {
			return new Date().getTime() - this.lastNearDeath > this.safeIntervalAfterUnsafeIncoming;
		},
		
		safeBulletDistance: 20,
		objectSafeDistanceAway: function(obj) {
			var host = this.getHostObject();
			
			var safeObjDistance = 9999999999999999;
			if(obj instanceof Bullet)
				safeObjDistance = this.safeBulletDistance;
			
			if(obj.getPosition().dist(host.getPosition()) >= safeObjDistance)
				return true;
			else
				return false;
		},

		release: function() {
			this.base();
			this.shootTimer.destroy();
			this.grenadeTimer.destroy();
			this.shootTimer = null;
			this.grenadeTimer = null; 
		},

	}, {
	  getClassName: function() { return "AIComponent"; }
	
	});

	return AIComponent;
});