Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Shrapnel", "Mover", function() {
	var Shrapnel = Mover.extend({
		field: null,
		shooter: null,
        bouncer: false,

		baseSpeed: 15,
		damage: 1,
		safeDistance: 20,
        bounciness: 10,

		constructor: function(field, shooter, epicentre, ttl, bouncer, inSpread, inAngle) {
			this.base("Shrapnel");
			this.field = field;
			this.shooter = shooter;
			this.birth = new Date().getTime();
			this.life = this.birth + ttl;
            this.bouncer = bouncer;

			// Add components to move and draw the shrapnel
			this.add(Mover2DComponent.create("move"));
			this.add(Vector2DComponent.create("draw"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));

			this.getComponent("draw").setPoints(Shrapnel.shape);

            var spread = 360;
            var angle = 0;
            if(inSpread !== undefined && inAngle !== undefined)
            {
			    spread = inSpread;
                angle = inAngle;
            }

            var a = (angle - (spread / 2)) + (Math.random() * spread);
			var speed = 6 + (Math.random() * 17);

			var mover = this.getComponent("move");
			mover.setPosition(epicentre);
			mover.setVelocity(Math2D.getDirectionVector(Point2D.ZERO, Collider.UP, a).mul(speed));
			mover.setCheckLag(false);
		},

		update: function(renderContext, time) {
			if (time > this.life) // if past life, destroy
			{
				this.destroy();
				return;
			}

			this.updateColor(renderContext, time);

			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},

		updateColor: function(renderContext, time) {
			var colr = ParticleColorChanger.explosion(time, this.birth, this.life);
			if(this.color != colr)
			{
				this.color = colr;
				this.getComponent("draw").setLineStyle(this.color);
			}
		},

		onCollide: function(obj) {
			if(obj instanceof Furniture)
            {
				if(this.field.collider.objsColliding(this, obj))
                {
                    obj.shot(this);
                    if(this.bouncer === true)
                        return this.field.physics.handleBounce(this, obj);
                    else
                    {
						this.destroy();
						return ColliderComponent.STOP;
                    }
                }
			}
			else if(obj instanceof Human) {
				if(obj.isAlive())
				{
					if(this.field.collider.objsColliding(this, obj))
				    {
						obj.shot(this);
						this.destroy();
						return ColliderComponent.STOP;
					}
				}
			}
			return ColliderComponent.CONTINUE;
		},
	}, {
		getClassName: function() { return "Shrapnel"; },
		shape: [new Point2D(0, 0), new Point2D(1, 0), new Point2D(1,  1), new Point2D(0,  1)],
	});

	return Shrapnel;
});