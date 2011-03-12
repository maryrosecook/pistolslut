Engine.initObject("Firework", "Object2D", function() {
	var Firework = Object2D.extend({
		field: null,
		birth: null,

		launchTimer: null,

		constructor: function(name, field, x, y, angle) {
			this.base(name);

			this.field = field;
			this.birth = new Date().getTime();

			this.add(Mover2DComponent.create("move"));
			this.add(Vector2DComponent.create("draw"));

			this.setPosition(new Point2D(x, y));
			this.setVelocity(Math2D.getDirectionVector(Point2D.ZERO, Collider.UP, angle));
			var speed = 17 + (Math.random() * 4);
			this.setVelocity(this.getVelocity().mul(speed));
			this.getComponent("move").setCheckLag(false);

			var c_draw = this.getComponent("draw");
			c_draw.setPoints(Firework.shape);
			c_draw.setLineStyle("white");
		},

		update: function(renderContext, time) {
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

		sparkCount: 80,
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

		shape: [ new Point2D(0, 0), new Point2D(1, 0), new Point2D(0,  1), new Point2D(1,  1)],
	});

	return Firework;
});