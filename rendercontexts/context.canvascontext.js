/**
 * The Render Engine
 * CanvasContext
 *
 * @fileoverview An extension of the 2D render context which encapsulates
 *               the Canvas element.
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
Engine.include("/rendercontexts/context.render2d.js");

Engine.initObject("CanvasContext", "RenderContext2D", function() {

/**
 * @class A <tt>canvas</tt> element represented within the engine.  A canvas
 * is a 2D context which can render lines, images, and polygons.  Transformations
 * can be saved and restored, allowing for complex, stacked transformations.
 *
 * @extends RenderContext2D
 * @constructor
 * @description Create a new instance of a canvas context.
 * @param name {String} The name of the context
 * @param width {Number} The width (in pixels) of the canvas context.
 * @param height {Number} The height (in pixels) of the canvas context.
 */
var CanvasContext = RenderContext2D.extend(/** @scope CanvasContext.prototype */{

   context2D: null,

   worldRect: null,

   mouseHandler: false,

   /**
    * @private
    */
   constructor: function(name, width, height) {
      Assert((width != null && height != null), "Width and height must be specified in CanvasContext");

      this.setWidth(width);
      this.setHeight(height);
      var canvas;
      var worldScale = this.getWorldScale();
      // Create the canvas element
      canvas = document.createElement("canvas");

      this.setViewport(Rectangle2D.create(0, 0, this.width, this.height));
      this.base(name || "CanvasContext", canvas);

      canvas.id = this.getId();
      this.setWorldScale(this.getWorldScale());
   },

   afterAdd: function(parent) {
   },

   /**
    * Releases the object back into the object pool.  See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.context2D = null;
      this.mouseHandler = false;
   },

	/**
	 * Set the scale of the world
	 * @param scaleX {Number} The scale of the world along the X axis
	 * @param scaleY {Number} The scale of the world along the y axis 
	 */
   setWorldScale: function(scaleX, scaleY) {
      this.base(scaleX, scaleY);

      scaleY = scaleY ? scaleY : scaleX;
      // Adjust the element accordingly
      $(this.getElement())
         .attr("width", this.getWidth() * scaleX)
         .attr("height", this.getHeight() * scaleY);

      this.setViewport(Rectangle2D.create(0, 0, this.getWidth(), this.getHeight()));
   },

   /**
    * Gets the surface context upon which all objects are drawn.
    */
   get2DContext: function() {
      if (this.context2D == null)
      {
         this.context2D = this.getSurface().getContext('2d');
      }
      return this.context2D;
   },

   /**
    * Push a transform state onto the stack.
    */
   pushTransform: function() {
      this.base();
      this.get2DContext().save();
   },

   /**
    * Pop a transform state off the stack.
    */
   popTransform: function() {
      this.base();
      this.get2DContext().restore();
   },


   //================================================================
   // Drawing functions

   /**
    * Reset the context, clearing it and preparing it for drawing.
    */
   reset: function(rect) {
      var cRect = (rect != null ? rect : this.getViewport());
		var d = cRect.get();
      this.get2DContext().clearRect(d.x, d.y, d.w, d.h);
   },

	/**
	 * Set up the world for the given time before any rendering is dont.
	 * @param time {Number} The render time
	 */
   setupWorld: function(time) {
      this.setScale(this.getWorldScale());

      if (Engine.getDebugMode()) {
         this.setLineStyle("yellow");
         this.setLineWidth(1);
         this.drawRectangle(this.getViewport());
      }

      this.base(time);
   },

   /**
    * Set the background color of the context.
    *
    * @param color {String} An HTML color
    */
   setBackgroundColor: function(color) {
      jQuery(this.getSurface()).css("background-color", color);
      this.base(color);
   },

   /**
    * Set the current transform position (translation).
    *
    * @param point {Point2D} The translation
    */
   setPosition: function(point) {
      this.get2DContext().translate(point.x, point.y);
      this.base(point);
   },

   /**
    * Set the rotation angle of the current transform
    *
    * @param angle {Number} An angle in degrees
    */
   setRotation: function(angle) {
      this.get2DContext().rotate(Math2D.degToRad(angle));
      this.base(angle);
   },

   /**
    * Set the scale of the current transform.  Specifying
    * only the first parameter implies a uniform scale.
    *
    * @param scaleX {Number} The X scaling factor, with 1 being 100%
    * @param scaleY {Number} The Y scaling factor
    */
   setScale: function(scaleX, scaleY) {
      scaleX = scaleX || 1;
      scaleY = scaleY || scaleX;
      this.get2DContext().scale(scaleX, scaleY);
      this.base(scaleX, scaleY);
   },

   /**
    * Set the transformation using a matrix.
    *
    * @param matrix {Matrix2D} The transformation matrix
    */
   setTransform: function(matrix) {
   },

   /**
    * Set the line style for the context.
    *
    * @param lineStyle {String} An HTML color or <tt>null</tt>
    */
   setLineStyle: function(lineStyle) {
      this.get2DContext().strokeStyle = lineStyle;
      this.base(lineStyle);
   },

   /**
    * Set the line width for drawing paths.
    *
    * @param [width=1] {Number} The width of lines in pixels
    */
   setLineWidth: function(width) {
      this.get2DContext().lineWidth = width * 1.0;
      this.base(width);
   },

   /**
    * Set the fill style of the context.
    *
    * @param fillStyle {String} An HTML color, or <tt>null</tt>.
    */
   setFillStyle: function(fillStyle) {
      this.get2DContext().fillStyle = fillStyle;
      this.base(fillStyle);
   },

   /**
    * Draw an un-filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    */
   drawRectangle: function(rect) {
      var rTL = rect.getTopLeft();
      var rDM = rect.getDims();
      this.get2DContext().strokeRect(rTL.x, rTL.y, rDM.x, rDM.y);
      this.base(rect);
   },

   /**
    * Draw a filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    */
   drawFilledRectangle: function(rect) {
      var rTL = rect.getTopLeft();
      var rDM = rect.getDims();
      this.get2DContext().fillRect(rTL.x, rTL.y, rDM.x, rDM.y);
      this.base(rect);
   },

   /**
    * @private
    */
   _arc: function(point, radiusX, startAngle, endAngle) {
      this.startPath();
      this.get2DContext().arc(point.x, point.y, radiusX, startAngle, endAngle, false);
      this.endPath();
   },

   /**
    * Draw an un-filled arc on the context.  Arcs are drawn in clockwise
    * order.
    *
    * @param point {Point2D} The point around which the arc will be drawn
    * @param radius {Number} The radius of the arc in pixels
    * @param startAngle {Number} The starting angle of the arc in degrees
    * @param endAngle {Number} The end angle of the arc in degrees
    */
   drawArc: function(point, radiusX, startAngle, endAngle) {
      this._arc(point, radiusX, startAngle, endAngle);
      this.strokePath();
      this.base(point, radiusX, startAngle, endAngle);
   },

   /**
    * Draw a filled arc on the context.  Arcs are drawn in clockwise
    * order.
    *
    * @param point {Point2D} The point around which the arc will be drawn
    * @param radius {Number} The radius of the arc in pixels
    * @param startAngle {Number} The starting angle of the arc in degrees
    * @param endAngle {Number} The end angle of the arc in degrees
    */
   drawFilledArc: function(point, radiusX, startAngle, endAngle) {
      this._arc(point, radiusX, startAngle, endAngle);
      this.fillPath();
      this.base(point, radiusX, startAngle, endAngle);
   },

   /**
    * Draw a line on the context.
    *
    * @param point1 {Point2D} The start of the line
    * @param point2 {Point2D} The end of the line
    */
   drawLine: function(point1, point2) {
      this.startPath();
      this.moveTo(point1);
      this.lineTo(point2);
      this.endPath();
      this.strokePath();
      this.base(point1, point2);
   },

   /**
    * Draw a point on the context.
    *
    * @param point {Point2D} The position to draw the point
    */
   drawPoint: function(point) {
      this.get2DContext().fillRect(point.x, point.y, 1.5, 1.5);
      this.base(point);
   },

   /**
    * Draw a sprite on the context.
    *
    * @param sprite {Sprite} The sprite to draw
    * @param time {Number} The current world time
    */
   drawSprite: function(sprite, time) {
      var f = sprite.getFrame(time);
      var tl = f.getTopLeft();
      var d = f.getDims();
      this.get2DContext().drawImage(sprite.getSourceImage(), tl.x, tl.y, d.x, d.y, 0, 0, d.x, d.y);
      this.base(sprite, time);
   },

   /**
    * Draw an image on the context.
    *
    * @param rect {Rectangle2D} The rectangle that specifies the position and
    *             dimensions of the image rectangle.
    * @param image {Object} The image to draw onto the context
    * @param [srcRect] {Rectangle2D} <i>[optional]</i> The source rectangle within the image, if
    *                <tt>null</tt> the entire image is used
    */
   drawImage: function(rect, image, srcRect) {
      var d = rect.get();
      if (srcRect) {
         var s = srcRect.get();
         this.get2DContext().drawImage(image,
            s.x, s.y, s.w, s.h, d.x, d.y, d.w, d.h);
      } else {
			try {
         	this.get2DContext().drawImage(image, d.x, d.y, d.w, d.h);
			}catch(ex) {
			}
      }
      this.base(rect, image);
   },

   /**
    * Capture an image from the context.
    *
    * @param rect {Rectangle2D} The area to capture
    * @returns {ImageData} Image data capture
    */
   getImage: function(rect) {
      this.base();

      // Clamp the rectangle to be within the bounds of the context
      var p = rect.getTopLeft();
      var tr = new Point2D((p.x < 0 ? 0 : (p.x > this.getWidth() ? this.getWidth() - 1 : p.x)),
                           (p.y < 0 ? 0 : (p.y > this.getHeight() ? this.getHeight() - 1 : p.y)));
      var d = rect.getDims();
      var r = p.x + d.x;
      var b = p.y + d.y;
      var wh = new Point2D((r > this.getWidth() ? this.getWidth() - tr.x : (r < 0 ? 1 : d.x)),
                           (b > this.getHeight() ? this.getHeight() - tr.y : (b < 0 ? 1 : d.y)));


      return this.get2DContext().getImageData(tr.x, tr.y, wh.x, wh.y);
   },

   /**
    * Useful method which returns a data URL which represents the
    * current state of the canvas context.  The URL can be passed to
    * an image element. <i>Note: Only works in Firefox and Opera!</i>
    *
    * @param {String} format The mime-type of the output, or <tt>null</tt> for
    *                 the PNG default. (unsupported)
    * @return {String} The data URL
    */
   getDataURL: function(format) {
      return this.getSurface().toDataURL();
   },

   /**
    * Draw an image, captured with {@link #getImage}, to
    * the context.
    *
    * @param imageData {ImageData} Image data captured
    * @param point {Point2D} The poisition at which to draw the image
    */
   putImage: function(imageData, point) {
      var x = (point.x < 0 ? 0 : (point.x > this.getWidth() ? this.getWidth() - 1 : point.x));
      var y = (point.y < 0 ? 0 : (point.y > this.getHeight() ? this.getHeight() - 1 : point.y));
      if (imageData != null)
      {
         this.get2DContext().putImageData(imageData, x, y);
      }
   },

   /**
    * Draw filled text on the context.
    *
    * @param point {Point2D} The top-left position to draw the image.
    * @param text {String} The text to draw
    */
   drawText: function(point, text) {
      this.base(point, text);
		if (!this.get2DContext().fillText) {
			return;	// Unsupported by canvas
		}
		this.get2DContext().font = this.getNormalizedFont();
		this.get2DContext().textBaseline = this.getFontBaseline();
		this.get2DContext().fillText(text, point.x, point.y);
   },
	
	/**
	 * Draw stroked (outline) text on the context.
	 * 
	 * @param point {Point2D}
	 * @param text {String} The text to draw
	 */
	strokeText: function(point, text) {
		if (!this.get2DContext().strokeText) {
			return;	// Unsupported by canvas
		}
		this.get2DContext().font = this.getNormalizedFont();
		this.get2DContext().textBaseline = this.getFontBaseline();
		this.get2DContext().strokeText(text, point.x, point.y);
	},

   /**
    * Start a path.
    */
   startPath: function() {
      this.get2DContext().beginPath();
      this.base();
   },

   /**
    * End a path.
    */
   endPath: function() {
      this.get2DContext().closePath();
      this.base();
   },

   /**
    * Stroke a path using the current line style and width.
    */
   strokePath: function() {
      this.get2DContext().stroke();
      this.base();
   },

   /**
    * Fill a path using the current fill style.
    */
   fillPath: function() {
      this.get2DContext().fill();
      this.base();
   },

   /**
    * Move the current path to the point sepcified.
    *
    * @param point {Point2D} The point to move to
    */
   moveTo: function(point) {
      this.get2DContext().moveTo(point.x, point.y);
      this.base();
   },

   /**
    * Draw a line from the current point to the point specified.
    *
    * @param point {Point2D} The point to draw a line to
    */
   lineTo: function(point) {
      this.get2DContext().lineTo(point.x, point.y);
      this.base(point);
   },

   /**
    * Draw a quadratic curve from the current point to the specified point.
    *
    * @param cPoint {Point2D} The control point
    * @param point {Point2D} The point to draw to
    */
   quadraticCurveTo: function(cPoint, point) {
      this.get2DContext().quadraticCurveTo(cPoint.x, cPoint.y, point.x, point.y);
      this.base(cPoint, point);
   },

   /**
    * Draw a bezier curve from the current point to the specified point.
    *
    * @param cPoint1 {Point2D} Control point 1
    * @param cPoint2 {Point2D} Control point 2
    * @param point {Point2D} The point to draw to
    */
   bezierCurveTo: function(cPoint1, cPoint2, point) {
      this.get2DContext().bezierCurveTo(cPoint1.x, cPoint1.y, cPoint2.x, cPoint2.y, point.x, point.y);
      this.base(cPoint1, cPoint2, point);
   },

   /**
    * Draw an arc from the current point to the specified point.
    *
    * @param point1 {Point2D} Arc point 1
    * @param point2 {Point2D} Arc point 2
    * @param radius {Number} The radius of the arc
    */
   arcTo: function(point1, point2, radius) {
      this.get2DContext().arcTo(point1.x, point1.y, point2.x, point2.y, radius);
      this.base(point1, point2, radius);
   }
}, {
   /**
    * Get the class name of this object
    *
    * @return {String} "CanvasContext"
    */
   getClassName: function() {
      return "CanvasContext";
   }
});

return CanvasContext;

});

