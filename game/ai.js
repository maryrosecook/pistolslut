Engine.include("/components/component.logic.js");

Engine.initObject("AIComponent", "LogicComponent", function() {
	var AIComponent = LogicComponent.extend({
		field: null,
        state: null,

		// I know it's insane to pass the host in the constructer, but it doesn't seem to be available at this point
		constructor: function(name, priority, field, host, behaviourTreeName) {
	  	    this.base(name, priority || 1.0);
			this.field = field;

            this.state = new Machine(this.field.remoteFileLoader.getData(behaviourTreeName)).generateTree(this);

			// subscribe to events the enemy cares about
			this.field.notifier.subscribe(Human.INCOMING, this, this.notifyIncoming);
			this.field.notifier.subscribe(Human.SHOT, this, this.notifyShot);
	    },

		notifyShot: function(person) {
			if(person == this.host)
				this.reactToBeingUnderFire();
		},

		notifyTimeToThrowGrenade: function() {
			if(this.isEnemyInSights() && this.host.grenadeThrower == true && this.host.isCrouching())
		        this.host.throwGrenade();
		},

		notifyIncoming: function(ordinance) {
			if(ordinance.shooter != this.host)
				if(!this.field.collider.objectAtLeastDistanceAway(this.host, ordinance, ordinance.safeDistance))
					this.reactToBeingUnderFire();
		},

		reactToBeingUnderFire: function() {
			this.lastUnderFire = new Date().getTime();
			this.host.crouch();
		},

		isEnemyInSights: function() { return this.field.playerObj != null && this.field.inView(this.host); },

		execute: function(renderContext, time) {
            this.state = this.state.tick();
		},

        canReload: function() { return this.host.weapon.shouldReload(); },
        canFight: function() { return this.isEnemyInSights(); },
        canCrouch: function() { return !this.host.isCrouching(); },
        canIdle: function() { return !this.canFight(); },
		canTurnTowardsPlayer: function() { return this.host.direction != this.directionOfPlayer(); },

		canShoot: function() {
			return this.host.weapon.allowedToFire()
                && this.isEnemyInSights()
                && !this.friendliesInLineOfFire()
                && !this.furnitureInLineOfFire();
		},

        lastThrewGrenade: 0,
        throwGrenadeDelay: 5000,
        canThrowGrenade: function() {
            return this.host.grenadeThrower
                && Engine.worldTime - this.lastThrewGrenade > this.throwGrenadeDelay;
        },

        canStand: function() {
            return this.host.isCrouching()
                && this.host.weapon.canStand()
                && !this.host.weapon.isReloading()
                && this.noUnsafeIncomingForAWhile();
        },

        reload: function() { this.host.weapon.reload(); },
        crouch: function() { this.host.crouch() },
        shoot: function() { this.host.shoot(); },
        stand: function() { this.host.stand(); },
        idle: function() { },
        turnTowardsPlayer: function() { this.host.turn(this.directionOfPlayer()); },

        throwGrenadeShort: function() {
            var x = GrenadeLauncher.RANGES[Human.ENEMY][GrenadeLauncher.MIN_RANGE];
            this.throwGrenadeWithX(x);
        },

        throwGrenadeRandom: function() {
            var min = GrenadeLauncher.RANGES[Human.ENEMY][GrenadeLauncher.MIN_RANGE];
            var max = Math.random() * GrenadeLauncher.RANGES[Human.ENEMY][GrenadeLauncher.MAX_RANGE];
            this.throwGrenadeWithX(Math.max(min, max));
        },

        throwAccurateGrenade: function() {
            var x = this.host.getPosition().x - this.field.playerObj.getPosition().x;
            this.throwGrenadeWithX(x);
        },

        throwGrenadeWithX: function(x) {
            this.host.grenadeLauncher.setX(x);
            this.host.throwGrenade();
            this.lastThrewGrenade = new Date().getTime();
        },

		lineOfFireSafetyMargin: 5, // add this to top and bottom of potential target to be on safer side
		friendliesInLineOfFire: function() {
			var playerEnemies = this.field.level.liveEnemies();
			if(this.host.weapon.hasLineOfFire() == true)
				for(var i in playerEnemies)
					if(this.host != playerEnemies[i])
						if(this.field.collider.inLineOfFire(this.host, playerEnemies[i], this.lineOfFireSafetyMargin))
							return true;

			return false;
		},

		furnitureBlockRange: 100,
		furnitureInLineOfFire: function() {
			var furniture = this.field.level.furniture;
			if(this.host.weapon.hasLineOfFire() == true)
				for(var i in furniture)
					if(!this.field.collider.objectAtLeastDistanceAway(this.host, furniture[i], this.furnitureBlockRange))
						if(this.field.collider.inLineOfFire(this.host, furniture[i]))
							return true;

			return false;
		},

        directionOfPlayer: function() {
			if(this.host.getPosition().x < this.field.playerObj.getPosition().x)
				return Collider.RIGHT;
            else
                return Collider.LEFT;
        },

		lastUnderFire: 0,
		safeIntervalAfterUnsafe: 2000,
		noUnsafeIncomingForAWhile: function() {
			return new Date().getTime() - this.lastUnderFire > this.safeIntervalAfterUnsafe;
		},

		removeFromHost: function() {
			this.host.remove(this);
		},
	}, {
	  getClassName: function() { return "AIComponent"; }

	});

	return AIComponent;
});