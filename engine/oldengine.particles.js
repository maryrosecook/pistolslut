/**
 * The Render Engine
 * ParticleEngine
 *
 * @fileoverview The particle engine and base particle class.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 615 $
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

// Includes
Engine.include("/engine/engine.pooledobject.js");
Engine.include("/engine/engine.baseobject.js");

Engine.initObject("Particle", "PooledObject", function() {

/**
 * @class Base particle class.  A particle need only implement the
 *        draw method.  The remainder of the functionality is
 *        handled by this abstract class.
 */
var Particle = PooledObject.extend(/** @scope Particle.prototype */{

   life: 0,

   engine: null,

   birth: 0,

   constructor: function(lifetime) {
      this.base("Particle");
      this.life = lifetime;
      this.birth = 0;
   },

   release: function() {
      this.base();
      this.life = 0;
      this.engine = null;
      this.birth = 0;
   },

   init: function(pEngine, time) {
      this.engine = pEngine;
      this.life += time;
      this.birth = time;
   },

   update: function(renderContext, time) {
      if (time < this.life)
      {
         // Draw it ( I think this is an optimization point )
         renderContext.pushTransform();
         this.draw(renderContext, time);
         renderContext.popTransform();
      }
      else
      {
         // Remove it
         this.engine.removeParticle(this);
      }
   },

   getTTL: function() {
		return this.life;
	},

	getBirth: function() {
		return this.birth;
	},

   draw: function(renderContext, time) {
   }
}, {
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "Particle";
   }
});

return Particle;

});

Engine.initObject("ParticleEngine", "BaseObject", function() {

/**
 * @class The particle engine is simply a system for updating, and expiring
 *        particles within a game environment.  This is registered with the
 *        render context so it will be updated at regular intervals.
 *
 */
var ParticleEngine = BaseObject.extend(/** @scope ParticleEngine.prototype */{

   particles: null,

   lastTime: 0,

   dead: null,

   constructor: function() {
      this.base("ParticleEngine");
      this.particles = [];
      this.dead = [];
   },

   release: function() {
      this.base();
      this.particles = null,
      this.lastTime = 0;
      this.dead = null;
   },

   /**
    * Add a particle to the system.
    *
    * @param particle {Particle} A particle to animate
    */
   addParticle: function(particle) {
      this.particles.push(particle);
      particle.init(this, this.lastTime);
   },

   /**
    * Mark a particle as dead so we can remove it after
    * the update.
    *
    * @param particle {Particle} A particle to animate
    */
   removeParticle: function(particle) {
      this.dead.push(particle);
   },

   /**
    * Kill off all of the dead particles.
    * @private
    */
   kill: function() {
      for (var d = 0; d < this.dead.length; d++)
      {
         this.dead[d].destroy();
         EngineSupport.arrayRemove(this.particles, this.dead[d]);
      }
      this.dead = [];
   },

   /**
    * Update the particles within the render context, and for the specified time.
    *
    * @param renderContext {RenderContext} The context the particles will be rendered within.
    * @param time {Number} The global time within the engine.
    */
   update: function(renderContext, time) {
      var p = 1;

      this.lastTime = time;
      if (this.particles.length == 0)
      {
         return;
      }


      // Using Duff's device with loop inversion
      switch((this.particles.length - 1) & 0x3)
      {
         case 3:
            this.particles[p++].update(renderContext, time);
         case 2:
            this.particles[p++].update(renderContext, time);
         case 1:
            this.particles[p++].update(renderContext, time);
      }

      if (p < this.particles.length)
      {
         do
         {
            this.particles[p++].update(renderContext, time);
            this.particles[p++].update(renderContext, time);
            this.particles[p++].update(renderContext, time);
            this.particles[p++].update(renderContext, time);
         } while (p < this.particles.length);
      }

      if (this.dead.length)
      {
         // Kill off dead particles
         this.kill();
      }
   },

	getProperties: function() {
		var self = this;
		var prop = this.base(self);
		return $.extend(prop, {
			"Count" : [function() { return self.particles.length; },
						  null, false]
		});
	}


}, {
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "ParticleEngine";
   }
});

return ParticleEngine;

});