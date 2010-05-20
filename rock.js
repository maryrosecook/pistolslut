/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * The asteroid object
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 692 $
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
Engine.include("/engine/engine.timers.js");

Engine.initObject("SpaceroidsRock", "Object2D", function() {

/**
 * @class An asteroid
 *
 * @param size {Number} The size of the asteroid. Defaults to 10
 * @param position {Point2D} the position of the rock.  If not specified
 *                 a random location with the playfield will be selected.
 * @param pWidth {Number} The width of the playfield in pixels
 * @param pHeight {Number} The height of the playfield in pixels
 */
var SpaceroidsRock = Object2D.extend({

   size: 10,

   speed: 0.3,

   pBox: null,

   scoreValue: 10,

   constructor: function(size, position, pWidth, pHeight) {
      this.base("Spaceroid");

      // Add components to move and draw the asteroid
      this.add(Mover2DComponent.create("move"));
      this.add(Vector2DComponent.create("draw"));
      this.add(ColliderComponent.create("collider", Spaceroids.collisionModel));

      // Playfield bounding box for quick checks
      this.pBox = Rectangle2D.create(0, 0, pWidth, pHeight);

      // Set size and position
      this.size = size || 10;
      this.scoreValue = SpaceroidsRock.values[String(this.size)];
      if (!position)
      {
         // Set the position
         position = new Point2D( Math.floor(Math.random() * this.pBox.getDims().x),
                                 Math.floor(Math.random() * this.pBox.getDims().y));
      }
      this.setPosition(position);
      this.getComponent("move").setCheckLag(false);
   },

   release: function() {
      this.base();
      this.size = 10;
      this.speed = 0.3;
      this.pBox = null;
      this.scoreValue = 10;
   },

   /**
    * Destroy an asteroid, removing it from the list of objects
    * in the last collision model node.
    */
   destroy: function() {
      AssertWarn(this.ModelData.lastNode, "Rock not located in a node!");
      if (this.ModelData.lastNode) {
         this.ModelData.lastNode.removeObject(this);
      }
      this.base();
   },

   /**
    * Update the asteroid in the rendering context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    */
   update: function(renderContext, time) {
      var c_mover = this.getComponent("move");

      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();

      // Debug the collision node
      if (Engine.getDebugMode() && this.ModelData && this.ModelData.lastNode)
      {
         renderContext.setLineStyle("blue");
         renderContext.drawRectangle(this.ModelData.lastNode.rect);
      }
   },

   /**
    * Returns the position of the rock
    * @type Point2D
    */
   getPosition: function() {
      return this.getComponent("move").getPosition();
   },

   getRenderPosition: function() {
      return this.getComponent("move").getRenderPosition();
   },

   /**
    * Returns the last position of the rock.
    * @type Point2D
    */
   getLastPosition: function() {
      return this.getComponent("move").getLastPosition();
   },

   /**
    * Set the position of the rock.
    *
    * @param point {Point2D} The position of the rock
    */
   setPosition: function(point) {
      this.base(point);
      this.getComponent("move").setPosition(point);
   },

   /**
    * Get the rotation of the rock.
    * @type Number
    */
   getRotation: function() {
      return this.getComponent("move").getRotation();
   },

   /**
    * Set the rotation of the rock.
    *
    * @param angle {Number} The rotation of the asteroid
    */
   setRotation: function(angle) {
      this.base(angle);
      this.getComponent("move").setRotation(angle);
   },

   /**
    * Set the shape of the asteroid from one of the
    * available shapes.
    */
   setShape: function() {
      var c_draw = this.getComponent("draw");

      // Pick one of the three shapes
      var tmp = [];
      tmp = SpaceroidsRock.shapes[Math.floor(Math.random() * 3)];

      // Scale the shape
      var s = [];
      for (var p = 0; p < tmp.length; p++)
      {
         var pt = Point2D.create(tmp[p][0], tmp[p][1]);
         pt.mul(this.size);
         s.push(pt);
      }

      // Assign the shape to the vector component
      c_draw.setPoints(s);
      c_draw.setLineStyle("white");
      c_draw.setLineWidth(0.5);
   },

   /**
    * Set the velocity vector and angular velocity of an asteroid.
    */
   setMotion: function() {
      // Randomize the position and velocity
      var c_mover = this.getComponent("move");

      // Pick a random rotation and spin speed
      c_mover.setRotation( Math.floor(Math.random() * 360));
      c_mover.setAngularVelocity( Math.floor(Math.random() * 10) > 5 ? 0.5 : -0.5);


      var b = Point2D.create(0,-1.2);
      var vec = Math2D.getDirectionVector(Point2D.ZERO, b, Math.floor(Math.random() * 360));

      c_mover.setVelocity(vec);
   },

   /**
    * Initialize an asteroid
    */
   setup: function() {

      this.setShape();
      this.setMotion();

      Spaceroids.rocks++;
   },

   /**
    * Called when an asteroid is killed by the player to create
    * a particle explosion and split up the asteroid into smaller
    * chunks.  If the asteroid is at its smallest size, the
    * rock will not be split anymore.  Also adds a score to the player's
    * score.
    */
   kill: function() {
      // Make some particles
      var pCount = 30;

      Spaceroids.rocks--;

      // Break the rock up into smaller chunks
      if (this.size - 4 > 1)
      {
         var curVel = this.getComponent("move").getVelocity().len();
         for (var p = 0; p < 3; p++)
         {
            var rock = SpaceroidsRock.create(this.size - 4, this.getPosition());
            this.getRenderContext().add(rock);
            rock.setup(this.pBox.getDims().x, this.pBox.getDims().y);
            
            var r_mover = rock.getComponent("move");
            r_mover.setVelocity(r_mover.getVelocity().mul(curVel + 0.5));
            if (Spaceroids.isAttractMode) {
               rock.killTimer = Engine.worldTime + 2000;
            }
         }
      }

      if (Spaceroids.rocks == 0) {
         OneShotTimeout.create("nextLevel", 3000, function() {
            Spaceroids.nextLevel();
         });
      }

      this.destroy();
   },

   /**
    * Called when an asteroid collides with an object in the PCL.  If the
    * object is the player, calls the <tt>kill()</tt> method on the player
    * object.
    */
   onCollide: function(obj) {
      if (obj instanceof SpaceroidsPlayer &&
          (this.getWorldBox().isIntersecting(obj.getWorldBox())))
      {
         if (obj.isAlive())
         {
            obj.kill();
            this.kill();
            return ColliderComponent.STOP;
         }
      }

      if (Spaceroids.isAttractMode &&
            obj.killTimer < Engine.worldTime &&
            obj instanceof SpaceroidsRock &&
            obj != this &&
            this.getWorldBox().isIntersecting(obj.getWorldBox()))
      {
         this.kill();
         obj.kill();
         return ColliderComponent.STOP;
      }

      return ColliderComponent.CONTINUE;
   }

}, { // Static Only

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "SpaceroidsRock";
   },

   /**
    * The different asteroid vector shapes
    * @private
    */
   shapes: [[ [-4, -2], [-2, -3], [ 0, -5], [ 4, -4], [ 5,  0], [ 3,  4], [-2,  5], [-3,  2], [-5,  1] ],
            [ [-3, -3], [-1, -5], [ 3, -4], [ 2, -2], [ 5, -3], [ 5,  2], [ 1,  5], [-4,  5], [-3,  0] ],
            [ [-2, -3], [ 2, -5], [ 5, -1], [ 3,  2], [ 4,  4], [ 0,  5], [-3,  2] ]],

   /**
    * The value of each size, in points
    * @private
    */
   values: { "10": 10, "6": 15, "2": 20 }

});

return SpaceroidsRock;

});

