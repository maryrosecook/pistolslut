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

		notifyIncoming: function(ordinance) {
			if(ordinance.shooter != this.host)
				if(!this.field.collider.objectAtLeastDistanceAway(this.host, ordinance, ordinance.safeDistance))
					this.reactToBeingUnderFire();
		},

		reactToBeingUnderFire: function() {
			this.lastUnderFire = new Date().getTime();
			this.host.crouch();
		},

        isTurnedTowardsEnemy: function() { return this.host.direction == this.directionOfPlayer(); },

		execute: function(renderContext, time) {
            this.state = this.state.tick();
		},

        canReload: function() { return this.isFreeAgent() && this.host.weapon.hasAmmoLeft() && this.host.weapon.shouldReload(); },
        canFight: function() { return this.isFreeAgent() && this.isInDanger() && this.hasOperationalWeapon(); },
        canCrouch: function() { return !this.host.isCrouching(); },
        canIdle: function() { return true; },
		canTurnTowardsPlayer: function() { return this.host.direction != this.directionOfPlayer(); },
        canSpot: function() { return this.host.isSpotter(); },
        canSwitchWeapon: function() { return !this.host.weapon.hasAmmoLeft() && this.host.weapons.length > 1; },
        canFindCover: function() { return !this.isInCover() && this.host.weapon.isMobile(); },
        canStop: function() { return this.isInCover() && this.host.walking; },
        canRunForCover: function() { return !this.isInCover(); },

        lastCalledRange: 0,
        canCallRange: function() {
            return this.field.isPlayerAlive()
                && this.host.isSpotter()
                && this.lastCalledRange < this.host.shooter.weapon.lastShot
                && this.host.shooter.weapon.lastShot + (this.speechShowTime * 0.7) < new Date().getTime();
        },

		canShoot: function() {
			return this.host.weapon.allowedToFire()
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

        maxSpotterDistance: 200,
        canEnlistSpotter: function() {
            if(this.needSpotter())
            {
                var nearestAlly = this.getNearestAlly();
                if(nearestAlly !== null && this.field.collider.xDistance(nearestAlly, this.host) < this.maxSpotterDistance)
                    return true;
            }

            return false;
        },

        reload: function() { this.host.weapon.reload(); },
        crouch: function() { this.host.crouch() },
        shoot: function() { this.host.shoot(); },
        stand: function() { this.host.stand(); },
        idle: function() { },
        turnTowardsPlayer: function() { this.host.turn(this.directionOfPlayer()); },
        enlistSpotter: function() { this.host.setSpotter(this.getNearestAlly()); },
        switchWeapon: function() { this.host.cycleWeapon(); },
        stop: function() { this.host.stopWalk(); },

        runForCover: function() {
            var nearestCover = this.getNearestCover();
            if(nearestCover !== null)
                this.host.walk(this.directionOfPlayer());
        },

        speechShowTime: 2000,
        callRange: function() {
            var x = this.field.collider.xDistance(this.host.shooter, this.field.playerObj);
            var text = "Range " + x + " feet";
            new Speech(this.field,
                       this.host,
                       text,
                       this.host.getPosition().x,
                       this.host.getPosition().y - 20,
                       75,
                       this.speechShowTime).show();

            this.lastCalledRange = new Date().getTime();
        },

        throwGrenade: function() {
            this.host.throwGrenade();
            this.lastThrewGrenade = new Date().getTime();
        },

        needSpotter: function() {
            if(this.host.weapon.isSpotterCompatible())
                if(!this.host.hasSpotter())
                    return true;
        },

        hasOperationalWeapon: function() {
            for(var i in this.host.weapons)
                if(this.host.weapons[i].hasAmmoLeft())
                    return true;

            return false;
        },

		lineOfFireSafetyMargin: 5, // added to top and bottom of potential target to be on safer side
		friendliesInLineOfFire: function() {
			var playerEnemies = this.field.level.liveEnemies();
			if(this.host.weapon.hasLineOfFire() == true)
				for(var i in playerEnemies)
					if(this.host != playerEnemies[i])
                        if(this.field.inView(playerEnemies[i]))
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

        getNearestAlly: function() { return this.field.collider.getNearest(null, this.host, this.host.getAllies()); },
        getNearestCover: function() { return this.field.collider.getNearest(this.directionOfPlayer(), this.host, this.field.level.furniture); },
        directionOfPlayer: function() { return this.field.collider.getDirectionOf(this.host, this.field.playerObj); },
        isFreeAgent: function() { return !this.host.isSpotter(); },

        coverDistance: 20,
        isInCover: function() {
            var nearestCover = this.getNearestCover();
            if(nearestCover !== null)
                return this.field.collider.xDistance(this.getNearestCover(), this.host) <= this.coverDistance;
            else
                return false;
        },

        verticalFieldOfFireAdditions: 20,
        isInDanger: function() {
            return this.field.inView(this.host)
                && this.field.isPlayerAlive()
                && this.field.collider.inLineOfFire(this.host, this.field.playerObj, this.verticalFieldOfFireAdditions);
        },

        isPathBlocked: function() {
            var nearestFurnitureInDirectionFacing = this.field.collider.getNearest(this.host.direction, this.host, this.field.level.furniture);
            if(nearestFurnitureInDirectionFacing === null)
                return false
            else if(this.field.collider.xDistance(nearestFurnitureInDirectionFacing, this.host) > this.coverDistance)
                return false;
            else
                return true;
        },

        turnTo: function(obj) {
            var dir = this.field.collider.getDirectionOf(this.host, obj);
            if(dir != this.host.direction)
                this.host.turn(dir);
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