/**
 * The Render Engine
 * Object2D
 *
 * @fileoverview An extension of the <tt>HostObject</tt> which is specifically geared
 *               towards 2d game development.
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
Engine.include("/engine/engine.hostobject.js");

Engine.initObject("Object2D", "HostObject", function() {

/**
 * @class An object for use in a 2d environment.  Methods for getting the position, rotation
 * and scale should be implemented within the extended class.
 * 
 * @param name {String} The name of the object
 * @extends HostObject
 * @constructor
 * @description Create a 2d host object
 */
var Object2D = HostObject.extend(/** @scope Object2D.prototype */{

   /** @private */
   zIndex: 1,

   /** @private */
   bBox: null,
	wBox: null,
	lastPosition: null,

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name);
      this.lastPosition = Point2D.create(5,5);
		this.bBox = Rectangle2D.create(0,0,1,1);
		this.wBox = Rectangle2D.create(0,0,1,1);
      this.zIndex = 1;
   },
	
	/**
	 * Destroy the object.
	 */
	destroy: function() {
		this.bBox.destroy();
		this.wBox.destroy();
		this.lastPosition.destroy();
		this.base();
	},

   /**
    * Release the object back into the pool.
    */
   release: function() {
      this.base();
      this.zIndex = 1;
      this.bBox = null;
		this.lastPosition = null;
   },

   /**
    * Set the bounding box of this object
    *
    * @param x {Number|Rectangle2D} The X coordinate, or the rectangle that completely encompasses
    *                           		this object.
    * @param y {Number} If X is a coordinate, this is the Y coordinate
    * @param w {Number} If X is a coordinate, this is the width
    * @param h {Number} If X is a coordinate, this is the height
    */
   setBoundingBox: function(x,y,w,h) {
		this.bBox.set(x,y,w,h);
   },

   /**
    * Get the bounding box of this object
    *
    * @return {Rectangle2D} The object bounding rectangle
    */
   getBoundingBox: function() {
      return this.bBox;
   },

   /**
    * Get the world bounding box.
    * @return {Rectangle2D} The world bounding rectangle
    */
   getWorldBox: function() {
		this.wBox.set(this.getBoundingBox());
      return this.wBox.offset(this.getRenderPosition());
   },
   
   /**
    * [ABSTRACT] Get the world bounding circle.
    * @return {Circle2D}
    */
   getCircle: function() {
      // ABSTRACT METHOD
   },
   
   /**
    * [ABSTRACT] Get the velocity of the object.
    * @return {Vector2D}
    */
   getVelocity: function() {
      // ABSTRACT METHOD
   },

   /**
    * [ABSTRACT] Set the position of the object
    * @param point {Point2D} The position of the object
    */
   setPosition: function(point) {
      // ABSTRACT
   },

   /**
    * Get the position of the object.
    * @return {Point2D} The position
    */
   getPosition: function() {
      return Point2D.ZERO;
   },

   /**
    * Get the render position of the object.
    * @return {Point2D}
    */
   getRenderPosition: function() {
      return Point2D.ZERO;
   },

   /**
    * Get the last position the object was rendered at.
    * @return {Point2D}
    */
   getLastPosition: function() {
      return Point2D.ZERO;
   },

   /**
    * [ABSTRACT] Set the rotation of the object
    * @param angle {Number} The rotation angle
    */
   setRotation: function(angle) {
   },

   /**
    * Get the rotation of the object
    * @return {Number}
    */
   getRotation: function() {
      return 0;
   },

   /**
    * [ABSTRACT] Set the scale of the object along the X and Y axis.
    * @param scaleX {Number} The scale along the X axis
    * @param scaleY {Number} The scale along the Y axis
    */
   setScale: function(scaleX, scaleY) {
   },

   /**
    * Get the uniform scale of the object.
    * @return {Number}
    */
   getScale: function() {
      return 1;
   },

   /**
    * Get the scale of the object along the X axis
    * @return {Number}
    */
   getScaleX: function() {
      return 1;
   },

   /**
    * Get the scale of the object along the Y axis.
    * @return {Number}
    */
   getScaleY: function() {
      return 1;
   },

   /**
    * Set the depth at which this object will render to
    * the context.  The lower the z-index, the further
    * away from the front the object will draw.
    *
    * @param zIndex {Number} The z-index of this object
    */
   setZIndex: function(zIndex) {
      this.zIndex = zIndex;
      if (this.getRenderContext()) {
         this.getRenderContext().sort();
      }
   },

   /**
    * Get the depth at which this object will render to
    * the context.
    *
    * @return {Number}
    */
   getZIndex: function() {
      return this.zIndex;
   },

   /**
    * When editing objects, this method returns an object which
    * contains the properties with their getter and setter methods.
    * @return {Object} The properties object
    */
   getProperties: function() {
      var self = this;
      var prop = this.base(self);
      return $.extend(prop, {
         "ZIndex"       : [function() { return self.getZIndex(); },
                           function(i){   self.setZIndex(i); }, true],
         "BoundingBox"  : [function() { return self.getBoundingBox().toString(); },
                           null, false],
         "WorldBox"     : [function() { return self.getWorldBox().toString(); },
                           null, false],
         "Position"     : [function() { return self.getPosition(); },
                           function(i) { var p = i.split(","); self.setPosition(Point2D.create(p[0],p[1])); }, true],
         "RenderPos"    : [function() { return self.getRenderPosition() },
                           null, false],
         "Rotation"     : [function() { return self.getRotation(); },
                           function(i) { self.setRotation(i); }, true],
         "Scale"        : [function() { return self.getScale(); },
                           function(i) {self.setScale(i,i); }, true]
      });
   }

}, /** @scope Object2D.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "Object2D"
    */
   getClassName: function() {
      return "Object2D";
   }
});

return Object2D;

});