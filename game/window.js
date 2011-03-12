Engine.initObject("Window", "Mover", function() {
	var Window = Mover.extend({
		field: null,

		constructor: function(name, position, width, height) {
			this.base(name);
			this.field = PistolSlut;

			// Add components to move and draw
			this.add(Mover2DComponent.create("move"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));

			this.getComponent("move").setCheckLag(false);

			this.setPosition(position);

			this.setupGraphics(width, height);
            this.setRectBecauseStatic();
		},

		setupGraphics: function(width, height) {
			this.add(Vector2DComponent.create("draw"));
			var shape = [ new Point2D(0, 0), new Point2D(0, height), new Point2D(width, height), new Point2D(width, 0)];
            this.getComponent("draw").setPoints(shape);
			this.getComponent("draw").setLineStyle("white");
			this.getComponent("draw").setFillStyle("white");
		},

		update: function(renderContext, time) {
            if(!this.field.inView(this))
                return;

			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},

        onCollide: function(obj) {
			if(obj instanceof Bullet || obj instanceof Grenade || obj instanceof Barrel)
            {
                if(this.field.collider.objsColliding(this, obj))
                    return this.smash();
            }
            else if(obj instanceof Human)
                if(this.field.collider.objsColliding(this, obj) && obj.getVelocity().y > 0)
                    return this.smash();

			return ColliderComponent.CONTINUE;
		},

		smash: function(smasher) {
			var particles = [];
            var shardCount = Math.max(this.getBoundingBox().dims.x, this.getBoundingBox().dims.y);
			for(var x = 0; x < shardCount; x++)
				particles[x] = WindowShardParticle.create(this);

			this.field.pEngine.addParticles(particles);

            this.destroy();
            return ColliderComponent.STOP;
		},

        shouldSmash: function(potentialSmasher) { return potentialSmasher.getVelocity().len() > Window.SHATTER_SPEED; },
	}, {
		getClassName: function() { return "Window"; },

        SHATTER_SPEED: 10,
	});

	return Window;
});