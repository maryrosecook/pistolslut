/**
 * The Render Engine
 * CircleColliderComponent
 *
 * @fileoverview A collision component which determines collisions via
 *               bounding circle comparisons.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 1216 $
 *
 * Copyright (c) 2010 Brett Fattori (brettf@renderengine.com)
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
Engine.include("/components/component.collider.js");

Engine.initObject("CircleColliderComponent", "CircleColliderComponent", function() {

/**
 * @class An extension of the {@link ColliderComponent} which will check if the
 *        object's are colliding based on a bounding circle.  
 *
 * @param name {String} Name of the component
 * @param collisionModel {SpatialCollection} The collision model
 * @param priority {Number} Between 0.0 and 1.0, with 1.0 being highest
 *
 * @extends ColliderComponent
 * @constructor
 * @description For this component to function, a movement vector must be available on the 
 *        host object by implementing the {@link Object2D#getVelocity} method which returns 
 *        a {@link Vector2D} instance.  Additionally the host object and collision object 
 *        must implement the {@link Object2D#getCircle} method which returns a 
 *        {@link Circle2D} instance.
 */
var CircleColliderComponent = ColliderComponent.extend(/** @scope CircleColliderComponent.prototype */{

   /**
    * Call the host object's <tt>onCollide()</tt> method, passing the time of the collision
    * and the potential collision object.  The return value should either tell the collision
    * tests to continue, or to stop.
    * <p/>
    * A circular bounding area collision must occur to trigger the <tt>onCollide()</tt> method.
    *
    * @param time {Number} The engine time (in milliseconds) when the potential collision occurred
    * @param collisionObj {HostObject} The host object with which the collision potentially occurs
    * @return {Number} A status indicating whether to continue checking, or to stop
    */
   testCollision: function(time, collisionObj) {
      
      var host = this.getHostObject();
      
      // Check for the required methods and see if a collision will occur
      if (host.getCircle && collisionObj.getCircle && host.getVelocity &&
          this.isPotentialCollision(collisionObj)) {

         return this.base(collisionObj, time);
      }
      
      return ColliderComponent.CONTINUE;
   },
   
   /**
    * Check for a potential collision between the host object's circle and the
    * collision object's circle.  Returns <tt>true</tt> if a collision will occur.
    * @private
    */
   isPotentialCollision: function(collisionObj) {
      
      var host = this.getHostObject();
      
      // Early out test
      var dist = collisionObj.getCircle().getCenter().dist(host.getCircle().getCenter());
      var sumRad = collisionObj.getCircle().getRadius() + host.getCircle().getRadius();
      dist -= sumRad;
      if (host.getVelocity().len() < dist) {
         // No collision possible
         return false;
      }

      var norm = Vector2D.create(host.getVelocity()).normalize();

      // Find C, the vector from the center of the moving
      // circle A to the center of B
      var c = Vector2D.create(collisionObj.getCircle().getCenter().sub(host.getCircle().getCenter()));
      var dot = norm.dot(c);

      // Another early escape: Make sure that A is moving
      // towards B! If the dot product between the movevec and
      // B.center - A.center is less that or equal to 0,
      // A isn't isn't moving towards B
      if (dot <= 0) {
        return false;
      }

      var lenC = c.len();
      var f = (lenC * lenC) - (dot * dot);

      // Escape test: if the closest that A will get to B
      // is more than the sum of their radii, there's no
      // way they are going collide
      var sumRad2 = sumRad * sumRad;
      if (f >= sumRad2) {
        return false;
      }

      // We now have F and sumRadii, two sides of a right triangle.
      // Use these to find the third side, sqrt(T)
      var t = sumRad2 - f;

      // If there is no such right triangle with sides length of
      // sumRadii and sqrt(f), T will probably be less than 0.
      // Better to check now than perform a square root of a
      // negative number.
      if (t < 0) {
        return false;
      }

      // Therefore the distance the circle has to travel along
      // movevec is D - sqrt(T)
      var distance = dot - Math.sqrt(t);

      // Get the magnitude of the movement vector
      var mag = host.getVelocity().len();

      // Finally, make sure that the distance A has to move
      // to touch B is not greater than the magnitude of the
      // movement vector.
      if (mag < distance) {
        return false;
      }

      // Set the length of the movevec so that the circles will just
      // touch
      //var moveVec = host.getVelocity().normalize();
      //movevec = moveVec.mul(distance);

      return true;         
   }

}, { /** @scope CircleColliderComponent.prototype */

   /**
    * Get the class name of this object
    *
    * @return {String}
    */
   getClassName: function() {
      return "CircleColliderComponent";
   }
   
});

return CircleColliderComponent;

});