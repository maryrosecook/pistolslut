/**
 * The Render Engine
 *
 * @fileoverview An object which loads an image and a collision map
 *               for usage as a single layered scrolling background.
 *
 * @fileoverview An extension of the canvas context that provides the
 *               display of a scrolling background.
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
Engine.include("/engine/engine.math2d.js");
Engine.include("/rendercontexts/context.canvascontext.js");

Engine.initObject("ScrollingBackground", "CanvasContext", function() {

/**
 * @class A scrolling background render context with an associated
 *        collision map.  The render context loads a level which defines
 *        the image that will be displayed within a rendering context.
 *
 * @constructor
 * @param name {String} The name of the object
 * @param level {Level} A level object to use for this scrolling background
 * @param windowWidth {Number} The width of the viewable window, in pixels
 * @param windowHeight {Number} The height of the viewable window, in pixels
 * @example ScrollingBackground.create("background", levelObj, 640, 448);
 * @extends CanvasContext
 */
var ScrollingBackground = CanvasContext.extend(/** @scope ScrollingBackground.prototype */{

   level: null,

   visRect: null,

   /**
    * @private
    */
   constructor: function(name, level, windowWidth, windowHeight) {
      // Create an element for us to use as our window
      this.base(name || "ScrollingBackground", windowWidth, windowHeight);
      this.visRect = Rectangle2D.create(0, 0, windowWidth, windowHeight);
      this.level = level;
   },

   /**
    * Set the scroll position for the background using a {@link Point2D} to
    * define the X and Y scroll amount.
    *
    * @param point {Point2D} The scroll position along X and Y
    */
   setWorldPosition: function(point) {
      this.visRect.setTopLeft(point);
      this.base(point);
   },

   /**
    * Set the horizontal scroll amount in pixels.
    *
    * @param x {Number} The horizontal scroll in pixels
    */
   setHorizontalScroll: function(x) {
      var pt = this.visRect.getTopLeft();
      pt.setX(x);
      this.setWorldPosition(pt);
   },

   /**
    * Set the vertical scroll amount in pixels.
    *
    * @param y {Number} The vertical scroll in pixels
    */
   setVerticalScroll: function(y) {
      var pt = this.visRect.getTopLeft();
      pt.setY(y);
      this.setWorldPosition(pt);
   },

   /**
    * Get the horizontal scroll amount in pixels.
    * @return {Number} The horizontal scroll
    */
   getHorizontalScroll: function() {
      return this.visRect.getTopLeft().x;
   },

   /**
    * Get the vertical scroll amount in pixels.
    * @return {Number} The vertical scroll
    */
   getVerticalScroll: function() {
      return this.visRect.getTopLeft().y;
   },

   // framechange - removed this function because background image is now blank because of parallax
   // setupWorld: function(time) {
   //    this.base(time);
   // 
   //    // Render the slice of the level image first
   //    this.drawImage(this.getViewport(), this.level.getSourceImage(), this.visRect);
   // }

}, /** @scope ScrollingBackground.prototype */{

   /**
    * Get the class name of this object
    * @return {String} The string "ScrollingBackground"
    */
   getClassName: function() {
      return "ScrollingBackground";
   }
});

return ScrollingBackground;

});

