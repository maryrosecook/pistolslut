Engine.include("/components/component.logic.js");

Engine.initObject("AIComponent", "LogicComponent", function() {
	var AIComponent = LogicComponent.extend({
		field: null,
        state: null,
        status: null,

		// I know it's insane to pass the host in the constructer, but it doesn't seem to be available at this point
		constructor: function(name, priority, field, host, behaviourTreeName) {
	  	    this.base(name, priority || 1.0);
			this.field = field;

            this.state = new Machine(this.field.remoteFileLoader.getData(behaviourTreeName)).generateTree(this);
            this.status = new Status(field, this);

			// subscribe to events the enemy cares about
			this.field.notifier.subscribe(Human.INCOMING, this, this.notifyIncoming);
			this.field.notifier.subscribe(Human.SHOT, this, this.notifyShot);
            this.field.notifier.subscribe(AIComponent.SOUND, this, this.notifySound);
	    },

		execute: function(renderContext, time) {
            this.state = this.state.tick();
		},

		notifyShot: function(person) {
			if(person == this.host)
				this.reactToBeingUnderFire();
		},

		notifyIncoming: function(ordinance) {
			if(ordinance.shooter != this.host)
                if(!this.host.isCrouching())
			        if(!this.field.collider.objectAtLeastDistanceAway(this.host, ordinance, ordinance.safeDistance))
				        this.reactToBeingUnderFire();
		},

        notifySound: function(soundMaker) {
            if(this.field.inView(this.host))
                if(!this.status.isTurnedTowardsEnemy())
                    if(this.field.inView(soundMaker))
                        this.host.turn(this.field.collider.getDirectionOf(this.host, soundMaker));
        },

        canFight: function() {
            return this.field.inView(this.host)
                && this.status.isFreeAgent()
                && this.status.isInDanger()
                && this.status.isHasOperationalWeapon();
        },
        canIdle: function() { return true; },
        canSpot: function() { return this.host.isSpotter(); },
        canFindCover: function() {
            return this.host.isMobile()
                && this.status.isNoUnsafeIncomingForAWhile()
                && !this.status.isInCover()
                && this.getNearestCover() !== null;
        },

        canReload: function() {
            return this.status.isFreeAgent()
                && this.host.weapon.hasAmmoLeft()
                && this.host.weapon.shouldReload();
        },
        reload: function() { this.host.weapon.reload(); },

        canCrouch: function() { return !this.host.isCrouching(); },
        crouch: function() { this.host.crouch() },

		canTurnTowardsPlayer: function() { return this.host.direction != this.directionOfPlayer(); },
        turnTowardsPlayer: function() { this.host.turn(this.directionOfPlayer()); },

        canStopSpotting: function() {
            return this.host.isSpotter()
                && !this.host.shooter.spotterCompatible();
        },
        stopSpotting: function() { this.host.shooter.unsetSpotter(); },

        canStop: function() {
            return this.host.walking
                && this.status.isInCover();
        },
        stop: function() { this.host.stopWalk(); },

        canRunForCover: function() { return !this.status.isInCover(); },
        runForCover: function() {
            var nearestCover = this.getNearestCover();
            if(nearestCover !== null)
                this.host.walk(this.directionOfPlayer());
        },

        lastCalledRange: 0,
        canCallRange: function() {
            return this.field.isPlayerAlive()
                && this.host.isSpotter()
                && this.lastCalledRange < this.host.shooter.weapon.lastShot
                && this.host.shooter.weapon.lastShot + (this.speechShowTime * 0.7) < new Date().getTime();
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

        canSwitchWeapon: function() {
            return this.host.weapons.length > 1
                && (!this.host.weapon.isOperational()
                    || this.getBetterWeapon() !== null);
        },
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

		canShoot: function() {
			return this.host.weapon.allowedToFire()
                && !this.status.isFriendliesInLineOfFire()
                && !this.status.isFurnitureInLineOfFire();
		},
        shoot: function() { this.host.shoot(); },

        lastThrewGrenade: 0,
        throwGrenadeDelay: 5000,
        canThrowGrenade: function() {
            return this.host.grenadeThrower
                && Engine.worldTime - this.lastThrewGrenade > this.throwGrenadeDelay;
        },
        throwGrenade: function() {
            this.host.throwGrenade();
            this.lastThrewGrenade = new Date().getTime();
        },

        canStand: function() {
            return this.host.isCrouching()
                && this.host.weapon.canStand()
                && !this.host.weapon.isReloading()
                && this.status.isNoUnsafeIncomingForAWhile();
        },
        stand: function() { this.host.stand(); },

        maxSpotterDistance: 200,
        canEnlistSpotter: function() {
            if(this.host.spotterCompatible() && !this.host.hasSpotter())
            {
                var nearestAlly = this.getNearestAlly(Collider.AT_SIMILAR_HEIGHT);
                return nearestAlly !== null
                    && this.field.collider.xDistance(nearestAlly, this.host) < this.maxSpotterDistance;
            }

            return false;
        },
        enlistSpotter: function() { this.host.setSpotter(this.getNearestAlly(Collider.AT_SIMILAR_HEIGHT)); },

        getBetterWeapon: function() {
            var weapons = this.host.weapons;
            for(var i in weapons)
                if(this.host.weapon.name == weapons[i].name) // bail once get to cur weapon - it can only get worse
                    return null;
                else if(weapons[i].isOperational())
                    return weapons[i];

            return null;
        },

        getNearestAlly: function(atSimilarHeight) { return this.field.collider.getNearest(null, atSimilarHeight, this.host, this.host.getAllies()); },
        getNearestCover: function() { return this.field.collider.getNearest(this.directionOfPlayer(), Collider.AT_SIMILAR_HEIGHT, this.host, this.field.level.cover); },
        directionOfPlayer: function() { return this.field.collider.getDirectionOf(this.host, this.field.playerObj); },

		reactToBeingUnderFire: function() {
			this.status.lastUnderFire = new Date().getTime();
			this.host.crouch();
		},

        turnTo: function(obj) {
            var dir = this.field.collider.getDirectionOf(this.host, obj);
            if(dir != this.host.direction)
                this.host.turn(dir);
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