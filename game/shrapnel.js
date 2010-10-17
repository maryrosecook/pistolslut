Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Shrapnel", "Mover", function() {
	var Shrapnel = Mover.extend({
		field: null,
		shooter: null,
		
		baseSpeed: 15,
		damage: 1,
		safeDistance: 20,
		
		constructor: function(field, shooter, epicentre, ttl) {
			this.base("Shrapnel");
			this.field = field;
			this.shooter = shooter;
			this.birth = new Date().getTime();
			this.life = this.birth + ttl;

			// Add components to move and draw the shrapnel
			this.add(Mover2DComponent.create("move"));
			this.add(Vector2DComponent.create("draw"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));
			
			this.getComponent("draw").setPoints(Shrapnel.shape);
			
			var spread = 360;
			var a = (0 - (360 / 2)) + (Math.random() * spread);
			var vel = 1 + (Math.random() * 11);
			
			var mover = this.getComponent("move");
			mover.setPosition(epicentre);
			mover.setVelocity(Math2D.getDirectionVector(Point2D.ZERO, Ordinance.tip, a));
			mover.setVelocity(mover.getVelocity().mul(vel));
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
			if(obj instanceof Furniture) {
				if(new CheapRect(this).isIntersecting(obj.rect))
			  {
					obj.shot(this);
					this.destroy();
					return ColliderComponent.STOP;
				}
			}
			else if(obj instanceof Human) {
				if(obj.isAlive())
				{
					if(obj instanceof Enemy) // tell enemy about shots being fired
						this.field.notifier.post(Human.INCOMING, this);
					
					if(new CheapRect(this).isIntersecting(new CheapRect(obj)))
				  {
						obj.shot(this);
						this.destroy();
						return ColliderComponent.STOP;
					}
				}
			}
			return ColliderComponent.CONTINUE;
		},

		release: function() {
			this.base();
		},

		destroy: function() {
			if (this.ModelData.lastNode)
				this.ModelData.lastNode.removeObject(this);
			this.base();
		},

	}, {
		getClassName: function() { return "Shrapnel"; },
		shape: [new Point2D(-1, 0), new Point2D(0, 0), new Point2D(0,  0), new Point2D(0,  0)],
	});

	return Shrapnel;
});