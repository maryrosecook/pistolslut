/**
 * The Render Engine
 * ColliderComponent
 *
 * @fileoverview The base collision component.
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
Engine.include("/components/component.base.js");

Engine.initObject("ColliderComponent", "BaseComponent", function() {

/**
 * @class A collider component is responsible for handling potential collisions by 
 *        updating the associated collision model and checking for possible collisions.
 *
 * @param name {String} Name of the component
 * @param collisionModel {SpatialCollection} The collision model
 * @param priority {Number} Between 0.0 and 1.0, with 1.0 being highest
 *
 * @extends BaseComponent
 * @constructor
 * @description Creates a collider component which tests the collision model for
 *              potential collisions. Each frame, the component will update a potential
 *              collision list (PCL) for the host object, using its current position
 *              obtained from {@link Object2D#getPosition}. Each object which meets
 *              certain criteria will be passed to an <tt>onCollide()<tt> method which
 *              must be implemented by the host object.
 *              <p/>
 *              The event handler will be passed the time the collision was detected
 *              as its first argument, and the potential collision object as the second.
 *              The host must determine if the collision is valid for itself, and then
 *              return a value which indicates whether the component should contine to
 *              check for collisions, or if it should stop.
 *              <p/>
 *              If the <tt>onCollide()</tt> method is not implemented on the host, no 
 *              collision events will be passed.
 */
var ColliderComponent = BaseComponent.extend(/** @scope ColliderComponent.prototype */{

   collisionModel: null,
   
   objectType: null,

   /**
    * @private
    */
   constructor: function(name, collisionModel, priority) {
      this.base(name, BaseComponent.TYPE_COLLIDER, priority || 1.0);
      this.collisionModel = collisionModel;
      this.objectType = null;
   },

   /**
    * Releases the component back into the pool for reuse.  See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.collisionModel = null;
      this.objectType = null;
   },

   /**
    * Get the collision model being used by this component.
    * @return {SpatialContainer} The collision model
    */
   getCollisionModel: function() {
      return this.collisionModel;
   },
   
   /**
    * Get the object type that this collider component will respond to.  If
    * the value is <tt>null</tt>, all objects are potential collision objects.
    * @return {BaseObject} The only object type to collide with, or <tt>null</tt> for any object
    */
   getObjectType: function() {
      return this.objectType;
   },
   
   /**
    * Set the object type that this component will respond to.  Setting this to <tt>null</tt>
    * will trigger a potential collision when <i>any object</i> comes into possible contact 
    * with the component's host based on the collision model.  If the object isn't of this type,
    * no collision tests will be performed.  This allows the developer to fine tune which
    * object the collision component is responsible for.  As such, multiple collision components
    * could be used to handle different types of collisions.
    *
    * @param objType {BaseObject} The object type to check for
    */
   setObjectType: function(objType) {
      this.objectType = objType;
   },

   /**
    * Update the collision model that this component was initialized with.
    * Creates an object called <tt>ModelData</tt> on the host object which contains
    * information relative to the collision model.  This data contains:
    * <ul>
    * <li>lastNode - The last node the object was reported within.
    * </ul>
    * This data is used by the collider components to determine where to test for
    * collisions, and whether or not the PCL should be rebuilt.
    */
   updateModel: function() {

      // Get the model data for the object
      var obj = this.getHostObject();
      if (!obj.ModelData) {
         obj.ModelData = { lastNode: null };
      }

      if ( obj.ModelData.lastNode !==null && obj.ModelData.lastNode.getRect().containsPoint(obj.getPosition()) ) {
         // The object is within the same node
         return;
      }

      // Find the node that contains the object
      var aNode = this.getCollisionModel().findNodePoint(obj.getPosition());
      if (aNode != null) {
         if (obj.ModelData.lastNode !==null && (obj.ModelData.lastNode.getIndex() != aNode.getIndex())) {
				// If the last node the object was in isn't the same as the node its position is in,
				// remove it from the old node and add it to the new node
            obj.ModelData.lastNode.removeObject(obj);
            aNode.addObject(obj);
         } else if (obj.ModelData.lastNode === null) {
				// If the last node isn't specified, make sure to add it to the node
				aNode.addObject(obj);
			}
			
         obj.ModelData.lastNode = aNode;
      }
   },

   /**
    * Updates the object within the collision model and determines if
    * the host object should to be alerted whenever a potential collision
    * has occurred.  If a potential collision occurs, an array (referred to
    * as a Potentail Collision List, or PCL) will be created which
    * contains objects that might be colliding with the host object.  It
    * is up to the host object to make the final determination that a
    * collision has occurred.
    * <p/>
    * The list of objects within the PCL will be passed to the <tt>onCollide()</tt>
    * method (if declared) on the host object.  If a collision occurred and was
    * handled, the <tt>onCollide()</tt> method should return {@link CollisionComponent#STOP},
    * otherwise, it should return {@link CollisionComponent#CONTINUE} to continue
    * checking objects from the PCL against the host object.
    *
    * @param renderContext {RenderContext} The render context for the component
    * @param time {Number} The current engine time in milliseconds
    */
   execute: function(renderContext, time) {

      var host = this.getHostObject();

      // Update the collision model
      this.updateModel();

      // If the host object needs to know about collisions...
      if (host.onCollide)
      {
         // Get the PCL and check for collisions
         var pcl = this.getCollisionModel().getPCL(host.getPosition());
         var status = ColliderComponent.CONTINUE;
         EngineSupport.forEach(pcl, function(obj) {
            if (this.getHostObject() != obj && 
                (this.getObjectType() == null || this.getObjectType().isInstance(obj)) &&
                status == ColliderComponent.CONTINUE)
            {
               status = this.testCollision(time, obj); 
            }
         }, this);
      }
   },
   
   /**
    * Call the host object's <tt>onCollide()</tt> method, passing the time of the collision
    * and the potential collision object.  The return value should either tell the collision
    * tests to continue, or to stop.
    * <p/>
    * For the base collider component the collision test is up to the host object to determine.
    *
    * @param time {Number} The engine time (in milliseconds) when the potential collision occurred
    * @param collisionObj {HostObject} The host object with which the collision potentially occurs
    * @return {Number} A status indicating whether to continue checking, or to stop
    */
   testCollision: function(time, collisionObj) {
      return this.getHostObject().onCollide(collisionObj, time);
   }

}, /** @scope ColliderComponent.prototype */{ // Statics

   /**
    * Get the class name of this object
    *
    * @return {String} "ColliderComponent"
    */
   getClassName: function() {
      return "ColliderComponent";
   },

   /**
    * When <tt>onCollide()</tt> is called on the host object, it should
    * return this value if it hasn't handled the collision, or if it wishes to be 
    * notified about other potential collisions.
    * @type {Number}
    */
   CONTINUE: 0,

   /**
    * When <tt>onCollide()</tt> is called on the host object, it should
    * return this if no more collisions should be reported.
    * @type {Number}
    */
   STOP: 1

});

return ColliderComponent;

});