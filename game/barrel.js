Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Barrel", "Mover", function() {
	var Barrel = Mover.extend({

		constructor: function() {
			this.base("Barrel");
			this.field = PistolSlut;

			// Add components to move and draw the mortar round
			this.add(Mover2DComponent.create("move"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));
            this.add(SpriteComponent.create("draw"));

            this.addSprite("main", this.field.spriteLoader.getSprite("barrel.gif", "main"));
			this.setSprite("main");

            this.getComponent("move").setCheckLag(false);
		},

		release: function() {
			this.base();
		},

		update: function(renderContext, time) {
			this.field.applyGravity(this);
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},

		onCollide: function(obj) {
			if(obj instanceof Furniture || obj instanceof Lift)
				return this.handleBounce(obj);

			return ColliderComponent.CONTINUE;
		},

		shrapnelCount: 60,
		shrapnelTTL: 700,
		explode: function() {
			for(var x = 0; x < this.shrapnelCount; x++)
				this.field.renderContext.add(Shrapnel.create(this.field, this.shooter, this.getPosition(), this.shrapnelTTL));

			this.destroy();
		},
	}, {
		getClassName: function() { return "Barrel"; },

		tip: new Point2D(0, -1),
	});

	return Barrel;
});