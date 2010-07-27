Engine.include("/engine/engine.math2d.js");
Engine.include("/engine/engine.particles.js");

Engine.initObject("BloodParticle", "Particle", function() {

	var BloodParticle = Particle.extend(/** @scope BloodParticle.prototype */{

		pos: null,
		vec: null,
		color: "#a00",
		
		constructor: function(pos, rot, spread, ttl) {
			this.base(ttl || 2000);
			this.pos = new Point2D(pos);

			var a = (rot - (spread / 2)) + (Math.random() * spread);
			this.vec = Math2D.getDirectionVector(Point2D.ZERO, BloodParticle.ref, a);
			var vel = 2 + (Math.random() * 2);
			this.vec.mul(vel)
		},

		release: function() {
			this.base();
			this.pos = null;
			this.vec = null;
		},

		draw: function(renderContext, time) {
			this.pos.add(this.vec);
			this.pos.x = this.pos.x - renderContext.getHorizontalScroll();
			renderContext.setFillStyle(this.color);
			renderContext.drawPoint(this.pos);
		}

	}, {
		getClassName: function() {
			return "BloodParticle";
		},

		ref: new Point2D(0, -1) // A simple reference point for the "up" vector
	});

	return BloodParticle;
});

Engine.initObject("ExplosionParticle", "BurnoutParticle", function() {

	var ExplosionParticle = BurnoutParticle.extend(/** @scope ExplosionParticle.prototype */{

		constructor: function(pos, spread, ttl) {
			this.base(pos, 0, Vector2D.create(0,0), 360, ttl)
		},
	}, {
		
		getClassName: function() {
			return "ExplosionParticle";
		},
	});

	return ExplosionParticle;
});

Engine.initObject("RicochetParticle", "BurnoutParticle", function() {

	var RicochetParticle = BurnoutParticle.extend(/** @scope RicochetParticle.prototype */{

		constructor: function(pos, rot, spread, ttl) {
			this.base(pos, rot, Vector2D.create(0,0), spread, ttl)
		},
	}, {
		
		getClassName: function() {
			return "RicochetParticle";
		},
	});

	return RicochetParticle;
});

Engine.initObject("BurnoutParticle", "Particle", function() {

	var BurnoutParticle = Particle.extend(/** @scope BurnoutParticle.prototype */{

		pos: null,
		vec: null,

		constructor: function(pos, rot, sourceVec, spread, ttl) {
			this.base(ttl || 2000);
			this.pos = new Point2D(pos);

			var a = (rot - (spread / 2)) + (Math.random() * spread);
			this.vec = Math2D.getDirectionVector(Point2D.ZERO, BurnoutParticle.ref, a);
			var vel = 1 + (Math.random() * 2);
			this.vec.mul(vel).add(sourceVec);
		},

		release: function() {
			this.base();
			this.pos = null;
			this.vec = null;
		},

		/**
		 * Called by the particle engine to draw the particle to the rendering
		 * context.
		 *
		 * @param renderContext {RenderContext} The rendering context
		 * @param time {Number} The engine time in milliseconds
		 */
		draw: function(renderContext, time) {
			this.pos.add(this.vec);
			this.pos.x = this.pos.x - renderContext.getHorizontalScroll();
			
			var colr = "#f00";
			var s = time - this.getBirth();
			var e = this.getTTL() - this.getBirth();
			colr = 255 - Math.floor(255 * (s / e));
			colr += (-10 + (Math.floor(Math.random() * 20)));
			var fb = (Math.random() * 100);
			if (fb > 90)
				colr = 255;
			colr = "#" + (colr.toString(16) + colr.toString(16) + "66");

			renderContext.setFillStyle(colr);
			renderContext.drawPoint(this.pos);
		}

	}, {
		getClassName: function() {
			return "BurnoutParticle";
		},

		ref: new Point2D(0, -1) // A simple reference point for the "up" vector
	});

	return BurnoutParticle;
});

Engine.initObject("SnowParticle", "Particle", function() {

	var SnowParticle = Particle.extend(/** @scope TrailParticle.prototype */{

		pos: null,
		vec: null,
		clr: null,
				
		constructor: function(levelWidth) {
			this.pos = new Point2D(Math.floor(Math.random() * levelWidth), 0);
						
			var ttl = 8000;
			this.base(ttl);
			this.clr = "#ffffff";
			
			var a = Math.floor((180) + (Math.random()));
			this.vec = Math2D.getDirectionVector(Point2D.ZERO, SnowParticle.ref, a);
			var vel = 2 + (Math.random() * 0.5);
			this.vec.mul(vel);
		},

		release: function() {
			this.base();
			this.pos = null;
			this.vec = null;
		},

		/**
		 * Called by the particle engine to draw the particle to the rendering
		 * context.
		 *
		 * @param renderContext {RenderContext} The rendering context
		 * @param time {Number} The engine time in milliseconds
		 */
		draw: function(renderContext, time) {
			this.pos.add(this.vec);
			this.pos.x = this.pos.x - renderContext.getHorizontalScroll();
			renderContext.setFillStyle(this.clr);
			renderContext.drawPoint(this.pos);
		}

	}, {
		getClassName: function() {
			return "SnowParticle";
		},
		
		ref: new Point2D(0, -1) // A simple reference point for the "up" vector
	});

	return SnowParticle;
});