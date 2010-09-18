Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Player", "Human", function() {

var Player = Human.extend({
	weapon: null,
	weapons: null,

	constructor: function(field, groundY) {
		var startPosition = new Point2D(50, groundY);
		this.direction = Collider.RIGHT;
		
		this.base("Player", field, startPosition, Player.STARTING_HEALTH, Player.STARTING_WEAPON, Player.CAN_THROW_GRENADES);
		
		this.add(KeyboardInputComponent.create("input"));
		
		this.field.notifier.subscribe(Human.INCOMING, this, this.notifyIncoming);
		this.field.notifier.subscribe(Human.GRENADE_NEARBY, this, this.notifyGrenadeNearby);
		this.field.notifier.subscribe(Grenade.EXPLODED, this, this.notifyGrenadeExploded);
	},
	
	setup: function(pWidth, pHeight) {
		this.pBox = Rectangle2D.create(0, 0, pWidth, pHeight); // Playfield bounding box for quick checks
	},

	notifyIncoming: function(ordinance) {
		if(ordinance instanceof Grenade)
			if(!this.field.collider.objectDistanceAway(this, ordinance, ordinance.safeDistance))
				this.field.notifier.post(Human.GRENADE_NEARBY, ordinance);
	},

	release: function() {
		this.base();
	},

	update: function(renderContext, time) {
		this.base(renderContext, time);
		this.field.updateFramePosition(this.velocity, this); // move the render frame in response to player movement
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
			case 88: // x
				this.throwGrenade();
				break;
			case 65: // a
				this.weapon.reload();
				break;
			case 83: // s
				this.cycleWeapon();
				break;
		}
		
		this.field.notifier.post(Player.MOVE_EVENT, this);
		
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
			case EventEngine.KEYCODE_UP_ARROW:
				break;
			case 90: // z
				this.weapon.stopShooting();
				this.weapon.shootKeyUp();
				break;
		}
		
		return false;
	},

	}, {
		getClassName: function() { return "Player"; },
		
		STARTING_HEALTH: 10,
		STARTING_WEAPON: "M9",
		CAN_THROW_GRENADES: true,
		
		MOVE_EVENT: "playerMove"
	});

	return Player;
});