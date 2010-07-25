/**
 * The Render Engine
 * Transform2DComponent
 *
 * @fileoverview The base 2d transformation component.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
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
Engine.include("/engine/engine.math2d.js");
Engine.include("/components/component.base.js");

Engine.initObject("Transform2DComponent", "BaseComponent", function() {

/**
 * @class A simple component that maintains position, rotation, and scale.
 *
 * @param name {String} The name of the component
 * @param [priority=1.0] {Number} The priority of the component
 * @extends BaseComponent
 * @constructor
 * @description Create a 2d transformation component
 */
var Transform2DComponent = BaseComponent.extend(/** @scope Transform2DComponent.prototype */{

   position: null,
   rotation: 0,
   scale: 1.0,
   lastPosition: null,
   lastRenderPosition: null,
	worldPos: null,

   /**
    * @private
    */
   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_TRANSFORM, priority || 1.0);
      this.position = Point2D.create(0,0);
		this.worldPos = Point2D.create(0,0);
      this.lastPosition = Point2D.create(0,0);
      this.lastRenderPosition = Point2D.create(0,0);
      this.rotation = 0;
      this.scale = 1.0;
   },
	
	destroy: function() {
		this.position.destroy();
		this.worldPos.destroy();
		this.lastPosition.destroy();
		this.lastRenderPosition.destroy();
		this.base();
	},

   /**
    * Releases the component back into the object pool. See {@link PooledObject#release} for
    * more information.
    */
   release: function() {
      this.base();
      this.position = null;
      this.rotation = 0;
      this.scale = 1.0;
      this.lastPosition = null;
      this.lastRenderPosition = null;
		this.worldPos = null;
   },

   /**
    * Set the position of the transform.
    *
    * @param point {Point2D} The position
    */
   setPosition: function(point) {
      this.setLastPosition(this.getPosition());
      this.position.set(point);
   },

   /**
    * Returns the position of the transform.
    * @return {Point2D}
    */
   getPosition: function() {
      return this.position;
   },

   /**
    * Returns the render position of the transform.
    * @return {Point2D}
    */
   getRenderPosition: function() {
		this.worldPos.set(this.getPosition());
		this.worldPos.sub(this.getHostObject().getRenderContext().getWorldPosition());
      return this.worldPos;
   },

   /**
    * Set the last position that the transform was at.
    *
    * @param point {Point2D} The last position
    */
   setLastPosition: function(point) {
      this.lastPosition.set(point);
   },

   /**
    * Get the last position of the transform.
    * @return {Point2D}
    */
   getLastPosition: function() {
      return this.lastPosition;
   },

   /**
    * Get the last position of the transform.
    * @return {Point2D}
    */
   getLastRenderPosition: function() {
      return this.lastRenderPosition;
   },

   /**
    * Set the rotation of the transform.
    *
    * @param rotation {Number} The rotation
    */
   setRotation: function(rotation) {
      this.rotation = rotation;
   },

   /**
    * Get the rotation of the transform.
    * @return {Number}
    */
   getRotation: function() {
      return this.rotation;
   },

   /**
    * Get the render rotation of the transform.
    * @return {Number}
    */
   getRenderRotation: function() {
      var wR = this.getHostObject().getRenderContext().getWorldRotation();
      return wR + this.rotation;
   },

   /**
    * Set the uniform scale of the transform.  The uniform
    * scale applies to both the X and Y axis.
    *
    * @param scale {Number} The scale of the transform with 1.0 being 100%
    */
   setScale: function(scale) {
      this.scale = scale;
   },

   /**
    * Get the uniform scale of the transform.
    * @return {Number}
    */
   getScale: function() {
      return this.scale;
   },

   /**
    * Get the uniform render scale of the transform.
    * @return {Number}
    */
   getRenderScale: function() {
//    var wS = this.getHostObject().getRenderContext().getWorldScale();
//      return wS * this.scale;
      return this.scale;
   },

   /**
    * Set the components of a transformation: position, rotation,
    * and scale, within the rendering context.
    *
    * @param renderContext {RenderContext} The rendering context
    * @param time {Number} The engine time in milliseconds
    * @param rendering {Boolean} <tt>true</tt> during the rendering phase
    */
   execute: function(renderContext, time) {
      renderContext.setPosition(this.getRenderPosition());
      renderContext.setRotation(this.getRenderRotation());
      var s = this.getRenderScale();
      renderContext.setScale(s);
   }
}, /** @scope Transform2DComponent.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "Transform2DComponent"
    */
   getClassName: function() {
      return "Transform2DComponent";
   }
});

return Transform2DComponent;

});