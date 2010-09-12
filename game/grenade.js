Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Grenade", "Object2D", function() {

	var Grenade = Object2D.extend({

		shooter: null,
		field: null,
		speed: 6,
		sprites: null,
		timeThrown: null,
		pinTimer: 2000, // how long the grande takes to explode

		constructor: function(shooter) {
			this.base("Grenade");

			this.field = PistolSlut;
			this.shooter = shooter;
			this.timeThrown = new Date().getTime();
			
			this.add(Mover2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));

			this.sprites = {};
			this.sprites["throw"] = this.field.spriteLoader.getSprite("grenade", "throw");
			this.setSprite("throw");

			var c_mover = this.getComponent("move");
			var dir = Math2D.getDirectionVector(Point2D.ZERO, Grenade.tip, this.shooter.getArmAngle());
			
			c_mover.setPosition(Point2D.create(this.shooter.getPosition()).add(this.shooter.getArmTip()));
			c_mover.setVelocity(dir.mul(this.speed).add(this.shooter.getVelocity()));
			c_mover.setCheckLag(false);
		},

		release: function() {
			this.base();
			this.shooter = null;
			this.timeThrown = null;
		},

		/**
		 * Destroy a grenade, removing it from the list of objects
		 * in the last collision model node.
		 */
		destroy: function() {
			//AssertWarn(this.ModelData.lastNode, "Grenade not located in a node!");
			if (this.ModelData.lastNode) {
				this.ModelData.lastNode.removeObject(this);
			}
			this.base();
		},

		getPosition: function() {
			return this.getComponent("move").getPosition();
		},

		setPosition: function(point) {
			this.base(point);
			this.getComponent("move").setPosition(point);
		},
		
		getVelocity: function() {
			return this.getComponent("move").getVelocity();
		},
	
		setVelocity: function(vector) {
			return this.getComponent("move").setVelocity(vector);
		},

		getLastPosition: function() {
			return this.getComponent("move").getLastPosition();
		},

		update: function(renderContext, time) {
			// Is this grenade in field any more?
			if (!this.field.inView(this))
			{
				this.destroy();
				return;
			}
			
			if(this.timeThrown + this.pinTimer < new Date().getTime())
			{
				this.explode();
				return;
			}
			
			this.field.applyGravity(this);
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},

		onCollide: function(obj) {
			if(obj instanceof Furniture)
				if(new CheapRect(this).isIntersecting(new CheapRect(obj)))
					this.bounce(obj);	
			
			return ColliderComponent.CONTINUE;
		},

		// bounce the grenade		
		bounciness: 0.7,
		bounce: function(objHit) {
			var pointOfImpactData = this.field.collider.pointOfImpact(this, objHit);
			if(pointOfImpactData != null)
			{
				var sideHit = pointOfImpactData[1];
				this.setVelocity(this.field.physics.bounce(this.getVelocity(), this.bounciness, sideHit));
			}
		},
	
		shrapnelCount: 30,
		shrapnelTTL: 500,
		explode: function() {
			var particles = [];
			for(var x = 0; x < this.shrapnelCount; x++)
				this.field.renderContext.add(Shrapnel.create(this.field, this.shooter, this.getPosition(), this.shrapnelTTL));
			
			this.destroy();
		},
		
	  setSprite: function(spriteKey) {
		  var sprite = this.sprites[spriteKey];
		  this.setBoundingBox(sprite.getBoundingBox());
		  this.getComponent("draw").setSprite(sprite);
	  },

		getVelocity: function() {
			return this.getComponent("move").getVelocity();
		},
	
		setVelocity: function(vector) {
			return this.getComponent("move").setVelocity(vector);
		},

	}, {

		getClassName: function() {
			return "Grenade";
		},

		// The tip of the shooter at zero rotation (up)
		tip: new Point2D(0, -1)
	});

	return Grenade;
});