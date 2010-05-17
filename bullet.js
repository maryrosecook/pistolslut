
/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * The bullet object
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 687 $
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

Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("SpaceroidsBullet", "Object2D", function() {

/**
 * @class The bullet object.
 *
 * @param player {Spaceroids.Player} The player object this bullet comes from,
 */
var SpaceroidsBullet = Object2D.extend({

   player: null,

   field: null,

   rot: null,

   constructor: function(player) {
      this.base("Bullet");

      // This is a hack!
      this.field = Spaceroids;

      // Track the player that created us
      this.player = player;
      this.rot = player.getRotation();

      // Add components to move and draw the bullet
      this.add(Mover2DComponent.create("move"));
      this.add(Vector2DComponent.create("draw"));
      this.add(ColliderComponent.create("collide", this.field.collisionModel));

      // Get the player's position and rotation,
      // then position this at the tip of the ship
      // moving away from it
      var p_mover = this.player.getComponent("move");
      var c_mover = this.getComponent("move");
      var c_draw = this.getComponent("draw");

      c_draw.setPoints(SpaceroidsBullet.shape);
      c_draw.setLineStyle("white");
      c_draw.setFillStyle("white");

      var dir = Math2D.getDirectionVector(Point2D.ZERO, SpaceroidsBullet.tip, this.player.direction);
			
			var playerPosition = Point2D.create(p_mover.getPosition());
			var gunTipPosition = playerPosition.add(this.player.gunTip);
			
      c_mover.setPosition(gunTipPosition.add(Point2D.create(dir).mul(10)));
      c_mover.setVelocity(dir.mul(8));
      c_mover.setCheckLag(false);
   },

   release: function() {
      this.base();
      this.player = null;
   },

   /**
    * Destroy a bullet, removing it from the list of objects
    * in the last collision model node.
    */
   destroy: function() {
      AssertWarn(this.ModelData.lastNode, "Bullet not located in a node!");
      if (this.ModelData.lastNode) {
         this.ModelData.lastNode.removeObject(this);
      }
      this.base();
   },

   /**
    * Returns the bullet position
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   getRenderPosition: function() {
      return this.getComponent("move").getRenderPosition();
   },

   /**
    * Returns the last position of the bullet
    * @type Point2D
    */
   getLastPosition: function() {
      return this.getComponent("move").getLastPosition();
   },

   /**
    * Set the position of the bullet.
    *
    * @param point {Point2D} The position of the bullet.
    */
   setPosition: function(point) {
      this.base(point);
      this.getComponent("move").setPosition(point);
   },

   /**
    * Update the host object to reflect the state of the bullet.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {
      var c_mover = this.getComponent("move");

      // Particle trail
      if (Spaceroids.evolved) {
         this.field.pEngine.addParticle(TrailParticle.create(this.getPosition(), this.rot, 45, "#aaaaff", 250));
      }

      // Is this bullet in field any more?
      var p = c_mover.getPosition();
      var bBox = Rectangle2D.create(p.x, p.y, 2, 2);
      if (!this.field.inField(p, bBox))
      {
         this.player.removeBullet(this);
         this.destroy();
         return;
      }

      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();
   },

   /**
    * Called whenever an object is located in the PCL which might
    * be in a collision state with this bullet.  Checks for collisions
    * with rocks and UFO's.
    *
    * @param obj {HostObject} The object that the bullet might be in a
    *            collision state with.
    *
    * @returns <tt>ColliderComponent.STOP</tt> if the collision was handled,
    *          otherwise <tt>ColliderComponent.CONTINUE</tt> if the other
    *          objects in the PCL should be tested.
    */
   onCollide: function(obj) {
      if ((obj instanceof SpaceroidsRock) &&
          ( (obj.getWorldBox().containsPoint(this.getPosition())) ||
            (Math2D.lineBoxCollision(this.getPosition(), this.getLastPosition(), obj.getWorldBox())) )
         )
      {
         // Kill the rock
         obj.kill();

         // Remove the bullet
         this.player.removeBullet(this);
         this.destroy();

         // All set
         return ColliderComponent.STOP;
      }

      return ColliderComponent.CONTINUE;
   }


}, {
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "SpaceroidsBullet";
   },

   // Why we have this, I don't know...
   shape: [ new Point2D(-1, -1), new Point2D( 1, -1),
            new Point2D( 1,  1), new Point2D(-1,  1)],

   // The tip of the player at zero rotation (up)
   tip: new Point2D(0, -1)
});

return SpaceroidsBullet;

});