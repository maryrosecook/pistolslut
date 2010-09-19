Engine.include("/components/component.mover2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Lantern", "Object2D", function() {
	var Lantern = Object2D.extend({
		field: null,
		sprites: {},
		
		constructor: function(field, wind, frameWidth, groundY) {
			this.base("Lantern");
			this.field = field;

			this.add(Mover2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));
			
			this.setZIndex(Lantern.Z_INDEX);
			this.setupSprite();
			
			var c_mover = this.getComponent("move");
			var startPosition = Point2D.create(frameWidth + (frameWidth * Math.random()), (groundY / 3) + (groundY / 3 * Math.random()))
			c_mover.setPosition(startPosition);
			c_mover.setVelocity(Vector2D.create(wind, Lantern.BASE_UPDRAUGHT + (Lantern.RANDOMISED_UPDRAUGHT * Math.random())));
			c_mover.setCheckLag(false);
		},
		
		setupSprite: function() {
			this.sprites["main"] = this.field.spriteLoader.getSprite("lantern", "main");
			
			var origSpeed = this.sprites["main"].getSpeed();
			this.sprites["main"].setSpeed(origSpeed + (Math.random() * Lantern.FLICKER_SPEED_ATTENUATION) - (Lantern.FLICKER_SPEED_ATTENUATION / 2));
			
			this.setSprite("main");
		},

	  setSprite: function(spriteKey) {
		  var sprite = this.sprites[spriteKey];
		  this.setBoundingBox(sprite.getBoundingBox());
		  this.getComponent("draw").setSprite(sprite);
	  },

		release: function() {
			this.base();
			this.sprites = {};
		},
		
		destroy: function() {
			this.base();
			EngineSupport.arrayRemove(this.field.level.lanterns, this);
		},

		update: function(renderContext, time) {
			if (!this.field.level.inLevel(this))
			{
				this.destroy();
				return;
			}

			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},
		
		getPosition: function() { return this.getComponent("move").getPosition(); },
		setPosition: function(point) {
			this.base(point);
			this.getComponent("move").setPosition(point);
		},

		getRenderPosition: function() { return this.getComponent("move").getRenderPosition(); },
		getLastPosition: function() { return this.getComponent("move").getLastPosition(); },
		
	}, {
		getClassName: function() { return "Lantern"; },

		BASE_UPDRAUGHT: -0.1,
		RANDOMISED_UPDRAUGHT: -0.1,
		SCROLL_ATTENUATION: 0.6,
		Z_INDEX: 2,
	});

	return Lantern;
});