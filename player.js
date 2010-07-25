Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Player", "Human", function() {

var Player = Human.extend({

	size: 4,
	
	shootDelay: 500,
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

	onCollide: function(obj) {
		if(obj instanceof Furniture && this.field.collider.colliding(this, [obj]))
		{
			if(this.field.collider.aFallingThroughB(this, obj))
			{
				this.endFall(obj);
				return ColliderComponent.STOP;
			}
			else if(this.field.collider.aOnLeftAndBumpingB(this, obj))
			{
				this.stopWalk(obj.getPosition().x - this.getBoundingBox().dims.x - 1);
				return ColliderComponent.STOP;
			}
			else if(this.field.collider.aOnRightAndBumpingB(this, obj))
			{
				this.stopWalk(obj.getPosition().x + obj.getBoundingBox().dims.x + 1);
				return ColliderComponent.STOP;
			}
		}
		return ColliderComponent.CONTINUE;
	},

	update: function(renderContext, time) {
		//this.base(renderContext, time);
		this.move(time);
		renderContext.pushTransform();
		this.base(renderContext, time);
		renderContext.popTransform();
		this.field.updateFramePosition(this.velocity, this); // move the render frame in response to player movement
	},

	move: function(time) {
		this.updateDeathState(time);
		this.field.applyGravity(this);

		// set sprite
		if(this.isAlive() && !this.isCrouching())
		{
			if(this.velocity.x != 0)
				this.setSprite(this.direction + Human.STANDING + Human.RUNNING);
			else
				this.setSprite(this.direction + Human.STANDING + Human.STILL);
		}
		
		this.handleFriction();
		
		this.setPosition(this.getPosition().add(this.velocity));
	},
	
	// if dead, carry on moving. A bit.
	friction: 0.1,
	handleFriction: function() {
		newX = null;
		if(!this.isAlive())
		{
			var x = this.velocity.x;
			if(x == 0)
				return;
			else if(x > 0)
			{
				newX = x - this.friction;
				if(newX < 0)
					newX = 0;
			}
			else // x < 0
			{
				newX = x + this.friction;
				if(newX < 0)
					newX = 0;
			}
			this.velocity.setX(newX);
		}
	},
	
	throwDelay: 1000,
	lastThrow: 0,
	throwGrenade: function() {
		if(new Date().getTime() - this.lastThrow > this.throwDelay)
		{
			this.lastThrow = new Date().getTime();
			var grenade = Grenade.create(this);
			this.field.renderContext.add(grenade);
		}
	},
	
	jumping: false,
	jumpSpeed: -9.0,
	postJumpAdjustmentVector: Vector2D.create(0, -1),
	jump: function() {
		if(!this.jumping)
		{
			this.jumping = true;
			this.velocity.setY(this.velocity.y + this.jumpSpeed);
			this.setPosition(this.getPosition().add(this.postJumpAdjustmentVector));
		}
	},

	walking: false,	
	walkSpeed: 3,
	walk: function(direction) {
		if(!this.walking && !this.isCrouching())
		{
			this.walking = true;
			this.direction = direction;
			if(direction == Human.LEFT)
				this.velocity.setX(this.velocity.x - this.walkSpeed);
			else if(direction == Human.RIGHT)
				this.velocity.setX(this.velocity.x + this.walkSpeed);
		}
	},

	stopWalk: function(newX) {
		this.velocity.setX(0);
		this.walking = false;
		if(newX != null)
			this.getPosition().setX(newX);
	},
	
	endFall: function(groundObj) {
		this.getPosition().setY(groundObj.getPosition().y - this.getBoundingBox().dims.y);
		this.velocity.setY(0);
		this.jumping = false;
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
				break;
			case EventEngine.KEYCODE_DOWN_ARROW:
				this.crouch();
				break;
			case 90: // z
				this.jump();
				break;
			case 88: // x
				if(this.shootKeyHasBeenUpSinceLastShot)
				{
					this.shoot();
					this.shootKeyHasBeenUpSinceLastShot = false;
				}
				break;
			case 67: // c
				this.throwGrenade();
				break;
			case 82: // r
				this.reload();
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
				break;
			case EventEngine.KEYCODE_UP_ARROW:
				break;
			case 88: // x
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