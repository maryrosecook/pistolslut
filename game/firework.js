Engine.initObject("Firework", "Object2D", function() {
	var Firework = Object2D.extend({
		field: null,
		birth: null,
		
		launchTimer: null,
		contrailTimer: null,
		emitInterval: 1,
		
		constructor: function(name, field, x, y, angle) {
			this.base(name);
						
			this.field = field;
			this.birth = new Date().getTime();
			
			this.add(Mover2DComponent.create("move"));
			this.add(Vector2DComponent.create("draw"));
			
			this.setPosition(new Point2D(x, y));
			this.setVelocity(Math2D.getDirectionVector(Point2D.ZERO, Firework.TIP, angle));
			var speed = 20 + (Math.random() * 4);
			this.setVelocity(this.getVelocity().mul(speed));
			this.getComponent("move").setCheckLag(false);
			
			var c_draw = this.getComponent("draw");
			c_draw.setPoints(Firework.shape);
			c_draw.setLineStyle("white");
			c_draw.setFillStyle("white");
			
			// setup contrail emitter
			var firework = this;
			this.contrailTimer = Interval.create(this.name, this.emitInterval,
				function() {
					var angle = firework.getVelocity().angleBetween(Firework.UP);
					var ttl = Firework.CONTRAIL_BASE_TTL * Math.random();
					field.pEngine.addParticle(ContrailParticle.create(Point2D.create(firework.getPosition()), ttl, angle, Firework.CONTRAIL_SPREAD));
			});
		},
		
		update: function(renderContext, time) {
			if (!this.field.inView(this))
			{
				this.destroy();
				return;
			}			

			if(this.getVelocity().y > -3)
			{
				this.explode();
				return
			}

			this.field.applyGravity(this);
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},
		
		sparkCount: 120,
		explode: function() {
			var particles = [];
			for(var i = 0; i < this.sparkCount; i++)
				particles[i] = (FireworkExplosionParticle.create(Point2D.create(this.getPosition())));
			this.field.pEngine.addParticles(particles);
			
			this.destroy();
		},
		
		release: function() {
			this.base();
			this.field = null;
			this.birth = null;
		},
		
		destroy: function() {
			this.contrailTimer.destroy();
			this.contrailTimer = null;
			this.base();
		},
		
		getPosition: function() { return this.getComponent("move").getPosition(); },
		setPosition: function(position) { 
			this.base(position);
			return this.getComponent("move").setPosition(position);
		},
	
		getVelocity: function() { return this.getComponent("move").getVelocity(); },
		setVelocity: function(vector) { return this.getComponent("move").setVelocity(vector); },
		
	}, {
		getClassName: function() { return "Firework"; },
		
		UP: new Point2D(0, -1),
		TIP: new Point2D(0, -1),
		CONTRAIL_BASE_TTL: 800,
		CONTRAIL_SPREAD: 10,
		
		shape: [ new Point2D(-1, 0), new Point2D(0, 0), new Point2D(0,  1), new Point2D(0,  1)],
	});

	return Firework;
});