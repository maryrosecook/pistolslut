/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * A simple particle
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 520 $
 *
 * Copyright (c) 2008 Brett Fattori (brettf@renderengine.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

Engine.include("/engine/engine.math2d.js");
Engine.include("/engine/engine.particles.js");

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

	/**
	 * @class A simple particle
	 *
	 * @param pos {Point2D} The starting position of the particle.  A
	 *				velocity vector will be derived from this position.
	 */
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
			renderContext.setPosition(this.pos);
			
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
			renderContext.drawPoint(Point2D.ZERO);
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

	/**
	 * @class A simple particle
	 *
	 * @param pos {Point2D} The starting position of the particle.  A
	 *				velocity vector will be derived from this position.
	 */
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
			renderContext.setPosition(this.pos);
			renderContext.setFillStyle(this.clr);
			renderContext.drawPoint(Point2D.ZERO);
		}

	}, {
		getClassName: function() {
			return "SnowParticle";
		},
		
		ref: new Point2D(0, -1) // A simple reference point for the "up" vector
	});

	return SnowParticle;
});