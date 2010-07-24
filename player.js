Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Player", "Human", function() {

var Player = Human.extend({

	size: 4,
		
	bullets: 0,

	directionData: {
		"left": {
			"angle": 270,
			"gunTip": new Point2D(0, 9),
			"armAngle": 315,
			"armTip": new Point2D(0, 2),
		},
		"right": {
			"angle": 90,
			"gunTip": new Point2D(44, 9),
			"armAngle": 45,
			"armTip": new Point2D(44, 2),
		}
	},
	left: "left",
	right: "right",

	constructor: function() {
		this.base("Player");

		this.health = 2;

		// Add components to move and draw the player
		this.add(KeyboardInputComponent.create("input"));
		this.add(Mover2DComponent.create("move"));
		this.add(SpriteComponent.create("draw"));
		this.add(ColliderComponent.create("collide", this.field.collisionModel));
		
		//this.loadWeapons();
		
		this.direction = this.right;
		this.setSprite(this.direction + "stand");
		
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
		this.directionData = null;
		this.left = null;
		this.right = null;
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

	/**
	 * Update the player within the rendering context.  This draws
	 * the shape to the context, after updating the transform of the
	 * object.  If the player is thrusting, draw the thrust flame
	 * under the ship.
	 *
	 * @param renderContext {RenderContext} The rendering context
	 * @param time {Number} The engine time in milliseconds
	 */
	update: function(renderContext, time) {
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
		if(this.isAlive())
		{
			if(this.velocity.x != 0)
				this.setSprite(this.direction + "run");
			else
				this.setSprite(this.direction + "stand");
		}
		
		this.handleFriction();
		
		this.setPosition(this.getPosition().add(this.velocity));
	},
	
	// if dead, carry on moving. A bit.
	friction: 0.05,
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

	/**
	 * Called when the player shoots a bullet to create a bullet
	 * in the playfield and keep track of the active number of bullets.
	 */
	muzzleFlashSpread: 15,
	muzzleParticleCount: 10,
	muzzleParticleTTL: 500,
	shootDelay: 500,
	lastShot: 0,
	shoot: function() {
		if(new Date().getTime() - this.lastShot > this.shootDelay)
		{
			this.lastShot = new Date().getTime();
			var bullet = Bullet.create(this);
			this.field.renderContext.add(bullet);
			this.bullets++;

			var gunTipInWorld = new Point2D(this.getGunTip()).add(this.getPosition());
			var gunAngle = this.getGunAngle();
			for (var x = 0; x < this.muzzleParticleCount; x++)
				PistolSlut.pEngine.addParticle(BurnoutParticle.create(gunTipInWorld, gunAngle, this.velocity, this.muzzleFlashSpread, this.muzzleParticleTTL));
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
			this.velocity.add(Vector2D.create(0, this.jumpSpeed));
			this.setPosition(this.getPosition().add(this.postJumpAdjustmentVector));
		}
	},

	walking: false,	
	walkSpeed: 3,
	walk: function(direction) {
		if(!this.walking)
		{
			this.walking = true;
			this.direction = direction;
			if(direction == this.left)
				this.velocity.add(Vector2D.create(-this.walkSpeed, 0));
			else if(direction == this.right)
				this.velocity.add(Vector2D.create(this.walkSpeed, 0));
		}
	},

	stopWalk: function(newX) {
		this.velocity.setX(0);
		this.walking = false;
		if(newX != null)
			this.setPosition(Point2D.create(newX, this.getPosition().y));
	},
	
	endFall: function(groundObj) {
		var newPos = Point2D.create(this.getPosition().x, groundObj.getPosition().y).sub(Vector2D.create(0, this.getBoundingBox().dims.y));
		this.setPosition(newPos);
		this.velocity.setY(0);
		this.jumping = false;
	},

	/**
	 * Called by the keyboard input component to handle a key down event.
	 *
	 * @param event {Event} The event object
	 */
	onKeyDown: function(event) {
		if(!this.isAlive())
			return;
			
		switch (event.keyCode) {
			case EventEngine.KEYCODE_LEFT_ARROW:
				this.walk(this.left);
				break;
			case EventEngine.KEYCODE_RIGHT_ARROW:
				this.walk(this.right);
				break;
			case EventEngine.KEYCODE_UP_ARROW:
				break;
			case 90: // z
				this.jump();
				break;
			case 88: // x
				this.shoot();
				break;
			case 67: // c
				this.throwGrenade();
				break;
		}
		
		return false;
	},
	
	/**
	 * Called by the keyboard input component to handle a key up event.
	 *
	 * @param event {Event} The event object
	 */
	onKeyUp: function(event) {
		if(!this.isAlive())
			return;
			
		switch (event.keyCode) {
			case EventEngine.KEYCODE_LEFT_ARROW:
			case EventEngine.KEYCODE_RIGHT_ARROW:
				this.stopWalk(null);
				break;
			case EventEngine.KEYCODE_UP_ARROW:
				break;
		}
		
		return false;
	},
	
	getGunAngle: function() {
		return this.directionData[this.direction]["angle"];
	},
	
	getGunTip: function() {
		return this.directionData[this.direction]["gunTip"];
	},
	
	getArmTip: function() {
		return this.directionData[this.direction]["armTip"];
	},
	
	getArmAngle: function() {
		return this.directionData[this.direction]["armAngle"];
	},

	getVelocity: function() {
		return this.velocity;
	},

	setVelocity: function(vector) {
		return this.velocity = vector;
	},

	}, { // Static
		getClassName: function() {
			return "Player";
		},
	});

	return Player;
});