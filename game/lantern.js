Engine.include("/components/component.mover2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Lantern", "Mover", function() {
	var Lantern = Mover.extend({
		field: null,
		
		constructor: function(field, wind, frameWidth, groundY) {
			this.base("Lantern");
			this.field = field;

			this.add(Mover2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));
			
			this.setZIndex(Lantern.Z_INDEX);
			
			this.addSprite("main", this.field.spriteLoader.getSprite("lantern", "main"));
			this.setSprite("main");
			
			var c_mover = this.getComponent("move");
			var startPosition = Point2D.create(frameWidth + (frameWidth * Math.random()), (groundY / 3) + (groundY / 3 * Math.random()))
			c_mover.setPosition(startPosition);
			c_mover.setVelocity(Vector2D.create(wind, Lantern.BASE_UPDRAUGHT + (Lantern.RANDOMISED_UPDRAUGHT * Math.random())));
			c_mover.setCheckLag(false);
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
		
	}, {
		getClassName: function() { return "Lantern"; },

		BASE_UPDRAUGHT: -0.1,
		RANDOMISED_UPDRAUGHT: -0.1,
		SCROLL_ATTENUATION: 0.6,
		Z_INDEX: 2,
	});

	return Lantern;
});