Engine.include("/components/component.logic.js");

Engine.initObject("AIComponent", "LogicComponent", function() {

	var AIComponent = LogicComponent.extend(/** @scope AIComponent.prototype */{
		playerObj: null,

		// I know it's insane to pass the host in the constructer, but it doesn't seem to be available at this point
		constructor: function(name, priority, playerObj, host) {
	  	this.base(name, priority || 1.0);
			this.playerObj = playerObj;

			// setup shoot timer
			var ai = this;
			host.shootTimer = Interval.create("shoot", host.shootDelay,
				function() {
					ai.notifyTimeToShoot();
			});
	  },

		execute: function(renderContext, time) {
			var host = this.getHostObject();
			if(host.isCrouching() && !host.weapon.isReloading() && this.noUnsafeIncomingForAWhile())
				host.stand();
				
			this.turnTowardsPlayer();
		},
		
		notifyTimeToShoot: function() {
			var host = this.getHostObject();
			if(!host.isCrouching())
				host.shoot();
		},
		
		notifyReloaded: function() {
			this.getHostObject().shoot(); // try and start shooting right away
			// just let the execute method deal with standing up if necessary on the next go round
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
		
		turnTowardsPlayer: function() {
			if(this.playerObj) // player might not have been created, yet
			{
				var host = this.getHostObject();
			
				var dirToTurn = Human.LEFT;
				if(host.getPosition().x < this.playerObj.getPosition().x) // host on left
					dirToTurn = Human.RIGHT;
				
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
		},

	}, /** @scope AIComponent.prototype */{
	  getClassName: function() {
			return "AIComponent";
	  }
	});

	return AIComponent;
});