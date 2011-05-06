Engine.initObject("Status", "Base", function() {
	var Status = Base.extend({
        ai: null,

		constructor: function(field, ai) {
            this.field = field;
            this.ai = ai;
		},

		lastUnderFire: 0,
		safeIntervalAfterUnsafe: 2000,
		isNoUnsafeIncomingForAWhile: function() {
			return new Date().getTime() - this.lastUnderFire > this.safeIntervalAfterUnsafe;
		},

        verticalFieldOfFireAdditions: 20,
        isInDanger: function() {
            return this.field.inView(this.ai.host)
                && this.field.isPlayerAlive()
                && (this.field.collider.inLineOfFire(this.ai.host, this.field.playerObj, undefined, this.verticalFieldOfFireAdditions)
                    || !this.ai.host.weapon.hasLineOfFire());
        },

        coverDistance: 5,
        alreadyFoundCover: false,
        isInCover: function() {
            if(this.alreadyFoundCover === true)
                return true;

            var nearestCover = this.ai.getNearestCover();
            if(nearestCover !== null)
                this.alreadyFoundCover = this.field.collider.xDistance(nearestCover, this.ai.host) <= this.coverDistance;

            return this.alreadyFoundCover;
        },

        isHasOperationalWeapon: function() {
            for(var i in this.ai.host.weapons)
                if(this.ai.host.weapons[i].isOperational())
                    return true;

            return false;
        },

		yLineOfFireSpread: 10, // added to top and bottom of potential target to be on safer side
		isFriendliesInLineOfFire: function() {
			return this.ai.host.weapon.hasLineOfFire() == true
                && this.field.collider.isAnObjectInLineOfFire(this.ai.host, this.field.level.liveEnemies, undefined, this.yLineOfFireSpread);
		},

		furnitureBlockRange: 100,
		isFurnitureInLineOfFire: function() {
			return this.ai.host.weapon.hasLineOfFire() == true
                && this.field.collider.isAnObjectInLineOfFire(this.ai.host, this.field.level.cover, this.furnitureBlockRange, undefined);
		},

        isFreeAgent: function() { return !this.ai.host.isSpotter(); },
        isTurnedTowardsEnemy: function() { return this.ai.host.direction == this.ai.directionOfPlayer(); },
	}, {
		getClassName: function() { return "Status"; },
	});

	return Status;
});