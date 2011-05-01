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
            this.field.notifier.subscribe(AIComponent.SOUND, this, this.notifySound);
	    },

        // notification
		notifyShot: function(person) {
			if(person == this.host)
				this.reactToBeingUnderFire();
		},

        // notification
		notifyIncoming: function(ordinance) {
			if(ordinance.shooter != this.host)
                if(!this.host.isCrouching())
			        if(!this.field.collider.objectAtLeastDistanceAway(this.host, ordinance, ordinance.safeDistance))
				        this.reactToBeingUnderFire();
		},

        // notification
        notifySound: function(soundMaker) {
            if(this.field.inView(this.host))
                if(!this.isTurnedTowardsEnemy())
                    if(this.field.inView(soundMaker))
                        this.host.turn(this.field.collider.getDirectionOf(this.host, soundMaker));
        },

        // host action
		reactToBeingUnderFire: function() {
			this.lastUnderFire = new Date().getTime();
			this.host.crouch();
		},

        // host status
        isTurnedTowardsEnemy: function() { return this.host.direction == this.directionOfPlayer(); },

		execute: function(renderContext, time) {
            this.state = this.state.tick();
		},

        canReload: function() { return this.isFreeAgent() && this.host.weapon.hasAmmoLeft() && this.host.weapon.shouldReload(); },
        canFight: function() { return this.field.inView(this.host) && this.isFreeAgent() && this.isInDanger() && this.hasOperationalWeapon(); },
        canCrouch: function() { return !this.host.isCrouching(); },
        canIdle: function() { return true; },
		canTurnTowardsPlayer: function() { return this.host.direction != this.directionOfPlayer(); },
        canSpot: function() { return this.host.isSpotter(); },
        canStopSpotting: function() { return this.host.isSpotter() && !this.host.shooter.spotterCompatible(); },
        canStop: function() { return this.host.walking && this.isInCover(); },
        canRunForCover: function() { return !this.isInCover(); },

        canFindCover: function() {
            return this.host.isMobile()
                && this.noUnsafeIncomingForAWhile()
                && !this.isInCover()
                && this.getNearestCover() !== null;
        },

        lastCalledRange: 0,
        canCallRange: function() {
            return this.field.isPlayerAlive()
                && this.host.isSpotter()
                && this.lastCalledRange < this.host.shooter.weapon.lastShot
                && this.host.shooter.weapon.lastShot + (this.speechShowTime * 0.7) < new Date().getTime();
        },

        canSwitchWeapon: function() {
            if(this.host.weapons.length > 1)
                if(!this.host.weapon.isOperational() || this.getBetterWeapon() !== null)
                    return true;

            return false;
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
            if(this.host.spotterCompatible() && !this.host.hasSpotter())
            {
                var nearestAlly = this.getNearestAlly(Collider.AT_SIMILAR_HEIGHT);
                if(nearestAlly !== null && this.field.collider.xDistance(nearestAlly, this.host) < this.maxSpotterDistance)
                    return true;
            }

            return false;
        },

        // host actions
        reload: function() { this.host.weapon.reload(); },
        crouch: function() { this.host.crouch() },
        shoot: function() { this.host.shoot(); },
        stand: function() { this.host.stand(); },
        idle: function() { },
        turnTowardsPlayer: function() { this.host.turn(this.directionOfPlayer()); },
        enlistSpotter: function() { this.host.setSpotter(this.getNearestAlly(Collider.AT_SIMILAR_HEIGHT)); },
        stopSpotting: function() { this.host.shooter.unsetSpotter(); },
        stop: function() { this.host.stopWalk(); },

        // host action
        runForCover: function() {
            var nearestCover = this.getNearestCover();
            if(nearestCover !== null)
                this.host.walk(this.directionOfPlayer());
        },

        // host action
        // weapons are ordered by goodness
        switchWeapon: function() {
            if(!this.host.weapon.isOperational()) // current weapon fucked, just get next one
                this.host.cycleWeapon();
            else // switch to better weapon
            {
                var betterWeapon = this.getBetterWeapon();
                if(betterWeapon !== null) // possible that no better weapon anymore, so check to make sure
                    this.host.setWeapon();
            }
        },

        getBetterWeapon: function() {
            var weapons = this.host.weapons;
            for(var i in weapons)
                if(this.host.weapon.name == weapons[i].name) // bail once get to cur weapon
                    return null;
                else if(weapons[i].isOperational())
                    return weapons[i];

            return null;
        },

        // host action
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

        // host action
        throwGrenade: function() {
            this.host.throwGrenade();
            this.lastThrewGrenade = new Date().getTime();
        },

        // host status
        hasOperationalWeapon: function() {
            for(var i in this.host.weapons)
                if(this.host.weapons[i].isOperational())
                    return true;

            return false;
        },

        // host status
		lineOfFireSafetyMargin: 15, // added to top and bottom of potential target to be on safer side
		friendliesInLineOfFire: function() {
			return this.host.weapon.hasLineOfFire() == true
                && this.field.collider.isAnObjectInLineOfFire(this.host, this.field.level.liveEnemies, this.lineOfFireSafetyMargin, undefined);
		},

        // host status
		furnitureBlockRange: 100,
		furnitureInLineOfFire: function() {
			return this.host.weapon.hasLineOfFire() == true
                && this.field.collider.isAnObjectInLineOfFire(this.host, this.field.level.cover, undefined, this.furnitureBlockRange);
		},

        getNearestAlly: function(atSimilarHeight) { return this.field.collider.getNearest(null, atSimilarHeight, this.host, this.host.getAllies()); },
        getNearestCover: function() { return this.field.collider.getNearest(this.directionOfPlayer(), Collider.AT_SIMILAR_HEIGHT, this.host, this.field.level.cover); },
        directionOfPlayer: function() { return this.field.collider.getDirectionOf(this.host, this.field.playerObj); },
        isFreeAgent: function() { return !this.host.isSpotter(); },

        coverDistance: 5,
        alreadyFoundCover: false,
        isInCover: function() {
            if(this.alreadyFoundCover === true)
                return true;

            var nearestCover = this.getNearestCover();
            if(nearestCover !== null)
                this.alreadyFoundCover = this.field.collider.xDistance(nearestCover, this.host) <= this.coverDistance;

            return this.alreadyFoundCover;
        },

        // host status
        verticalFieldOfFireAdditions: 20,
        isInDanger: function() {
            return this.field.inView(this.host)
                && this.field.isPlayerAlive()
                && (this.field.collider.inLineOfFire(this.host, this.field.playerObj, this.verticalFieldOfFireAdditions)
                    || !this.host.weapon.hasLineOfFire());
        },

        // host status
        isPathBlocked: function() {
            var nearestFurnitureInDirectionFacing = this.field.collider.getNearest(this.host.direction, Collider.AT_SIMILAR_HEIGHT, this.host, this.field.level.cover);
            if(nearestFurnitureInDirectionFacing === null)
                return false
            else if(this.field.collider.xDistance(nearestFurnitureInDirectionFacing, this.host) > this.coverDistance)
                return false;
            else
                return true;
        },

        // host action
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
	    getClassName: function() { return "AIComponent"; },

        SOUND: "sound",
	});

	return AIComponent;
});