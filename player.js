Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Player", "Human", function() {

var Player = Human.extend({

	size: 4,
	
	lastShot: 0,
	bullets: 0,

	constructor: function() {
		this.base("Player");

		this.health = 2;

		// Add components to move and draw the player
		this.add(KeyboardInputComponent.create("input"));
		this.add(Mover2DComponent.create("move"));
		this.add(SpriteComponent.create("draw"));
		this.add(ColliderComponent.create("collide", this.field.collisionModel));
		
		//this.loadWeapons();
		
		this.direction = Human.RIGHT;
		this.setSprite(this.direction + Human.STANDING + Human.STILL);
		
		this.velocity = Vector2D.create(0, 0);
		this.getComponent("move").setCheckLag(false);
	},
	
	setup: function(pWidth, pHeight) {
		this.pBox = Rectangle2D.create(0, 0, pWidth, pHeight); // Playfield bounding box for quick checks

		// Put us on the ground in the middle
		var c_mover = this.getComponent("move");
		c_mover.setPosition(new Point2D(50, this.field.groundY));
	},

	loadWeapons: function() {
		var weaponData = this.level.levelResource.info.objects.signs;
		for(var i in signs)
		{
			var signData = signs[i];
			var sign = new Sign(this.renderContext, signData.text, this.signColor, Point2D.create(signData.x, signData.y), signData.width, this.signLetterSpacing);	
			this.renderContext.add(sign);
		}
	},

	release: function() {
		this.base();
		this.size = 4;
		this.bullets = 0;
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
		this.stopWalk(null);
	},

	shootKeyHasBeenUpSinceLastShot: true,
	onKeyDown: function(keyCode) {
		if(!this.isAlive())
			return;
			
		switch (keyCode) {
			case EventEngine.KEYCODE_LEFT_ARROW:
				this.walk(Human.LEFT);
				break;
			case EventEngine.KEYCODE_RIGHT_ARROW:
				this.walk(Human.RIGHT);
				break;
			case EventEngine.KEYCODE_UP_ARROW:
				this.jump();
				break;
			case EventEngine.KEYCODE_DOWN_ARROW:
				this.handlePausedWalk();
				this.crouch();
				break;
			case 90: // z
				if(this.shootKeyHasBeenUpSinceLastShot)
				{
					this.shoot();
					this.shootKeyHasBeenUpSinceLastShot = false;
				}
				break;
			case 88: // x
				this.throwGrenade();
				break;
			case 67: // c
				this.reload();
				break;
			case 82: // r
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
				this.stopWalk(null);
				break;
			case EventEngine.KEYCODE_DOWN_ARROW:
				this.stand();
				// allowed to start walking now, but must
				// work around lack of keyboard repeat support in engine
				this.resumeWalk();
				break;
			case EventEngine.KEYCODE_UP_ARROW:
				break;
			case 90: // z
				this.shootKeyHasBeenUpSinceLastShot = true;
				break;
		}
		
		return false;
	},

	}, { // Static
		getClassName: function() {
			return "Player";
		},
	});

	return Player;
});