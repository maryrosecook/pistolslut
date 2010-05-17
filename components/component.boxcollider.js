/**
 * The Render Engine
 * BoxColliderComponent
 *
 * @fileoverview A box-box collision component.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 677 $
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
Engine.include("/components/component.collider.js");

Engine.initObject("BoxColliderComponent", "ColliderComponent", function() {

/**
 * @class An extension of the {@link ColliderComponent} which will check the
 *        two object's bounding boxes for a more precise collision.
 *
 * @param name {String} Name of the component
 * @param collisionModel {SpatialCollection} The collision model
 * @param priority {Number} Between 0.0 and 1.0, with 1.0 being highest
 *
 * @extends ColliderComponent
 */
var BoxColliderComponent = ColliderComponent.extend(/** @scope BoxColliderComponent.prototype */{

   /**
    * Call the host object's <tt>onCollide()</tt> method, passing the time of the collision
    * and the potential collision object.  The return value should either tell the collision
    * tests to continue, or to stop.
    * <p/>
    * A world bounding box collision must occur to trigger the <tt>onCollide()</tt> method.
    *
    * @param time {Number} The engine time (in milliseconds) when the potential collision occurred
    * @param collisionObj {HostObject} The host object with which the collision potentially occurs
    * @return {Number} A status indicating whether to continue checking, or to stop
    */
   testCollision: function(time, collisionObj) {
      if (this.getHostObject().getWorldBox && collisionObj.getWorldBox &&
          this.getHostObject().getWorldBox().isIntersecting(collisionObj.getWorldBox())) {

         return this.base(collisionObj, time);
      }
      
      return ColliderComponent.CONTINUE;
   }

}, { /** @scope BoxColliderComponent.prototype */

   /**
    * Get the class name of this object
    *
    * @return {String}
    */
   getClassName: function() {
      return "BoxColliderComponent";
   }
   
});

return BoxColliderComponent;

});