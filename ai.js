Engine.include("/components/component.logic.js");

Engine.initObject("AIComponent", "LogicComponent", function() {

	var AIComponent = LogicComponent.extend(/** @scope AIComponent.prototype */{
		playerObj: null,

		constructor: function(name, priority, playerObj) {
	  	this.base(name, priority || 1.0);
			this.playerObj = playerObj;
	  },

		execute: function(renderContext, time) {
			var host = this.getHostObject();
			if(host.isCrouching() && this.noUnsafeIncomingForAWhile())
				host.stand();
				
			this.turnTowardsPlayer();
		},
		
		turnTowardsPlayer: function() {
			var host = this.getHostObject();
			
			var dirToTurn = Human.LEFT;
			if(host.getPosition().x < this.playerObj.getPosition().x) // host on left
				dirToTurn = Human.RIGHT;
				
			if(host.direction != dirToTurn)
				host.turn(dirToTurn);
		},
		
		lastNearDeath: 0,
		safeIntervalAfterUnsafeIncoming: 2000, 
		noUnsafeIncomingForAWhile: function() {
			return new Date().getTime() - this.lastNearDeath > this.safeIntervalAfterUnsafeIncoming;
		},
		
		incoming: function(bullet) {
			var host = this.getHostObject();
			if(bullet.shooter != host)
			{
				if(!this.objectSafeDistanceAway(bullet))
				{
					this.lastNearDeath = new Date().getTime();
					host.crouch();
				}
			}
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