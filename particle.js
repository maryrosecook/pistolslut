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
			var vel = 2 + (Math.random() * 4);
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

Engine.initObject("RicochetParticle", "BurnoutParticle", function() {

	var RicochetParticle = BurnoutParticle.extend(/** @scope RicochetParticle.prototype */{

		constructor: function(pos, rot, spread, ttl) {
			this.base(pos, rot, spread, ttl)
		},
		
	}, {
		getClassName: function() { return "RicochetParticle"; },
	});

	return RicochetParticle;
});

Engine.initObject("BurnoutParticle", "Particle", function() {

	var BurnoutParticle = Particle.extend(/** @scope BurnoutParticle.prototype */{

		pos: null,
		vec: null,

		constructor: function(pos, rot, spread, ttl) {
			this.base(ttl || 2000);
			this.pos = new Point2D(pos);

			var a = (rot - (spread / 2)) + (Math.random() * spread);
			this.vec = Math2D.getDirectionVector(Point2D.ZERO, BurnoutParticle.ref, a);
			var vel = 1 + (Math.random() * 2);
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

	var SnowParticle = Particle.extend({

		pos: null,
		vec: null,
		clr: null,
				
		constructor: function(levelWidth) {
			this.pos = new Point2D(Math.floor(Math.random() * levelWidth), 0);
						
			var ttl = 8000;
			this.base(ttl);
			this.clr = "#ffffff";
			
			var a = Math.floor((180) + (Math.random()));
			this.vec = Math2D.getDirectionVector(Point2D.ZERO, SnowParticle.UP, a);
			var vel = 2 + (Math.random() * 0.5);
			this.vec.mul(vel);
		},

		release: function() {
			this.base();
			this.pos = null;
			this.vec = null;
		},

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
		
		UP: new Point2D(0, -1)
	});

	return SnowParticle;
});

Engine.initObject("FireParticle", "Particle", function() {

	var FireParticle = Particle.extend({

		color: null,
		pos: null,
		vec: null,
				
		constructor: function(x, y, width, maxTTL) {
			this.pos = new Point2D(x + Math.floor(Math.random() * width), y);
			this.base(this.getFireParticleTTL(width, maxTTL));
			
			var a = 0;
			this.vec = Math2D.getDirectionVector(Point2D.ZERO, FireParticle.UP, a);
			var vel = 0.5 + (Math.random() * 2);
			this.vec.mul(vel);
		},

		getFireParticleTTL: function(width, maxTTL)
		{
			var randPoint = Math.random() * width;
			var midPoint = width / 2;
	    if (randPoint > midPoint)
			{
	        randPoint = 1 - randPoint;
	        var height = 1 - ((randPoint - ((1 - randPoint) * randPoint)) * (1 / (1 - midPoint)));
	    } 
			else
			{
	    	var height = (randPoint - ((1 - randPoint) * randPoint)) * (1 / midPoint);
			}
	
			return ((height*height) / (width*width)) * maxTTL;
		},

		release: function() {
			this.base();
			this.pos = null;
			this.vec = null;
		},

		draw: function(renderContext, time) {
			this.pos.add(this.vec);
			this.pos.x = this.pos.x - renderContext.getHorizontalScroll();
			
			var colr = null;
			var s = time - this.birth;
			var e = this.life - this.birth;

			colr = 255 - Math.floor(255 * (s / e));
			colr += (-10 + (Math.floor(Math.random() * 20)));
			var fb = (Math.random() * 100);
			if (fb > 90)
				colr = 255;
			colr = "#" + ("ff" + colr.toString(16) + "00");

			if(this.color != colr)
			{
				this.color = colr;
				renderContext.setFillStyle(this.color);
			}

			renderContext.drawPoint(this.pos);
		}

	}, {
		getClassName: function() { return "FireParticle"; },
		UP: new Point2D(0, -1)
	});

	return FireParticle;
});