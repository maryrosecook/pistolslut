Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Player", "Human", function() {
    var Player = Human.extend({

	    constructor: function(field, groundY) {
		    var startPosition = Point2D.create(50, groundY);
		    this.turn(Collider.RIGHT);
		    this.base("Player", field, startPosition, Player.STARTING_HEALTH, ["M9", "Mac10", "SPAS"], Player.CAN_THROW_GRENADES);

		    this.add(KeyboardInputComponent.create("input"));
	    },

	    release: function() {
		    this.base();
	    },

	    update: function(renderContext, time) {
		    this.base(renderContext, time);
		    this.field.updateFramePosition(this.getVelocity(), this); // move the render frame in response to player movement

		    if(this.getVelocity().x != 0)
			    this.field.notifier.post(Player.MOVE_EVENT, this);

            this.handleHealthReload(time);
	    },

        handleHealthReload: function(time) {
            if(this.isAlive() && this.health != this.maxHealth)
                if(this.lastShot + Player.HEALTH_RELOAD_DELAY < new Date().getTime())
                {
                    this.field.healthMeter.reset();
                    this.health = this.maxHealth;
                }
        },

        lastShot: 0,
        shot: function(ordinance) {
            if(this.isAlive())
                this.field.healthMeter.decrement();

            this.base(ordinance);
            if(this.isAlive())
                this.lastShot = new Date().getTime();
        },

	    // if walking when pressed crouch, have now stood up
	    // and want to resume walk.  A workaround for weird keyboard handling.
	    resumeWalk: function() {
		    if(this.walkPaused == true)
		    {
			    this.walk(this.direction);
			    this.walkPaused = false;
		    }
	    },

	    // if walking when pressed crouch, save direction of walk
	    // for future resuption.  A workaround for weird keyboard handling.
	    walkPaused: false,
	    handlePausedWalk: function() {
		    if(this.walking)
			    this.walkPaused = true;
		    this.stopWalk();
	    },

	    onKeyDown: function(keyCode) {
		    if(!this.isAlive())
			    return;

		    switch (keyCode) {
			    case EventEngine.KEYCODE_LEFT_ARROW:
				    this.walk(Collider.LEFT);
				    break;
			    case EventEngine.KEYCODE_RIGHT_ARROW:
				    this.walk(Collider.RIGHT);
				    break;
			    case EventEngine.KEYCODE_UP_ARROW:
				    this.jump();
				    break;
			    case EventEngine.KEYCODE_DOWN_ARROW:
				    this.handlePausedWalk();
				    this.crouch();
				    break;
			    case 90: // z
				    // deal with an initial shot on semi-automatic
				    if(!this.weapon.isShooting()) // got to block delayed keyboard auto-repeat
					    this.shoot();

				    this.weapon.shootKeyDown();
				    break;
			    case 67: // c
				    this.grenadeLauncher.startAim();
				    break;
			    case 88: // x
				    this.cycleWeapon();
				    break;
		    }

		    return false;
	    },

	    onKeyUp: function(keyCode) {
		    if(!this.isAlive())
			    return;

		    switch (keyCode) {
			    case EventEngine.KEYCODE_LEFT_ARROW:
			    case EventEngine.KEYCODE_RIGHT_ARROW:
				    this.stopWalk();
				    this.walkPaused = false; // stopped walking so walk no longer paused
				    break;
			    case EventEngine.KEYCODE_DOWN_ARROW:
				    this.stand();
				    // allowed to start walking now, but must
				    // work around lack of keyboard repeat support in engine for this case
				    this.resumeWalk();
				    break;
			    case 67: // c
				    if(this.grenadeLauncher.isAiming())
					    this.throwGrenade();
				    break;
			    case 90: // z
				    this.weapon.shootKeyUp();
				    break;
		    }

		    return false;
	    },

        who: function() { return Human.PLAYER; },
	}, {
		getClassName: function() { return "Player"; },

		STARTING_HEALTH: 5,
		CAN_THROW_GRENADES: true,

        HEALTH_RELOAD_DELAY: 5000,
        HEALTH_RELOAD: "health_reload",

		MOVE_EVENT: "playerMove"
	});

	return Player;
});