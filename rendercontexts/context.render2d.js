/**
 * The Render Engine
 * RenderContext2D
 *
 * @fileoverview The base 2D render context.  This context implements a number of
 *               methods which are then standard on all contexts which extend from
 *               it.
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
Engine.include("/engine/engine.rendercontext.js");

Engine.initObject("RenderContext2D", "RenderContext", function() {

/**
 * @class All 2D contexts should extend from this to inherit the
 * methods which abstract the drawing methods.
 * @extends RenderContext
 * @constructor
 * @description Create a new instance of a 2d render context.
 * @param name {String} The name of the context
 * @param surface {HTMLElement} The element which represents the surface of the context
 */
var RenderContext2D = RenderContext.extend(/** @scope RenderContext2D.prototype */{

   width: 0,
   height: 0,
   lineStyle: null,
   fillStyle: null,
   lineWidth: 1,
   position: null,
   rotation: 0,
   scaleX: 1,
   scaleY: 1,
   wPosition: null,
   wRotation: 0,
   wScale: null,
   bBox: null,
   backgroundColor: null,
	font: "sans-serif",
	fontWeight: "normal",
	fontSize: "12px",
	fontAlign: "left",
	fontBaseline: "alphabetic",
	fontStyle: "normal",

	/**
	 * @private
	 */
   constructor: function(name, surface) {
      this.base(name || "RenderContext2D", surface);
      this.wPosition = Point2D.create(0,0);
      this.wRotation = 0;
      this.wScale = 1;
   },

   /**
    * Releases the object back into the object pool.  See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.width= 0;
      this.height= 0;
      this.lineStyle= null;
      this.fillStyle= null;
      this.lineWidth= 1;
      this.position= null;
      this.rotation= 0;
      this.scaleX= 1;
      this.scaleY= 1;
      this.bBox= null;
      this.backgroundColor= null;
      this.wPosition = null;
      this.wRotation = 0;
      this.wScale = null;
		this.font = "sans-serif";
		this.fontWeight = "normal";
		this.fontSize = "12px";
		this.fontAlign = "left";
		this.fontBaseline = "alphabetic";
		this.fontStyle = "normal";
   },

   /**
    * Set the background color of the context.
    *
    * @param color {String} An HTML color
    */
   setBackgroundColor: function(color) {
      this.backgroundColor = color;
   },

   /**
    * Get the color assigned to the context background.
    * @return {String}
    */
   getBackgroundColor: function() {
      return this.backgroundColor;
   },

   /**
    * Set the width of the context drawing area.
    *
    * @param width {Number} The width in pixels
    */
   setWidth: function(width) {
      this.width = width;
   },

   /**
    * Get the width of the context drawing area.
    * @return {Number}
    */
   getWidth: function() {
      return this.width;
   },

   /**
    * Set the height of the context drawing area
    *
    * @param height {Number} The height in pixels
    */
   setHeight: function(height) {
      this.height = height;
   },

   /**
    * Get the height of the context drawing area.
    * @render {Number}
    */
   getHeight: function() {
      return this.height;
   },

   /**
    * Get the bounding box for the rendering context.
    * @return {Rectangle2D}
    */
   getBoundingBox: function() {
      if (!this.bBox) {
         this.bBox = new Rectangle2D(0, 0, this.getWidth(), this.getHeight());
      }
      return this.bBox;
   },

   /**
    * Set the current transform position (translation).
    *
    * @param point {Point2D} The translation
    */
   setPosition: function(point) {
      this.position = point;
   },

   /**
    * Get the current transform position (translation)
    * @return {Point2D}
    */
   getPosition: function() {
      return this.position;
   },

   /**
    * Set the rotation angle of the current transform
    *
    * @param angle {Number} An angle in degrees
    */
   setRotation: function(angle) {
      this.rotation = angle;
   },

   /**
    * Get the current transform rotation.
    * @return {Number}
    */
   getRotation: function() {
      return this.rotation;
   },

   /**
    * Set the scale of the current transform.  Specifying
    * only the first parameter implies a uniform scale.
    *
    * @param scaleX {Number} The X scaling factor, with 1 being 100%
    * @param scaleY {Number} The Y scaling factor
    */
   setScale: function(scaleX, scaleY) {
      this.scaleX = scaleX;
      this.scaleY = scaleY || scaleX;
   },

   /**
    * Get the X scaling factor of the current transform.
    * @return {Number}
    */
   getScaleX: function() {
      return this.scaleX;
   },

   /**
    * Get the Y scaling factor of the current transform.
    * @return {Number}
    */
   getScaleY: function() {
      return this.scaleY;
   },

	/**
	 * Set the font to use when rendering text to the context.
	 * @param font {String} A font string similar to CSS
	 */
	setFont: function(font) {
		this.font = font;
	},
	
	/**
	 * Get the font currently being used to render text
	 * @return {String}
	 */
	getFont: function() {
		return this.font;
	},
	
	/**
	 * Get the normalized font string used to describe the style. The
	 * value includes style, weight, size, and font.
	 * @return {String}
	 */
	getNormalizedFont: function() {
		return this.getFontStyle() + " " + this.getFontWeight() + " " + this.getFontSize() + " " + this.getFont();
	},
	
	/**
	 * Set the size of the font being used to render text
	 * @param size {String} The font size string
	 */
	setFontSize: function(size) {
		this.fontSize = size + "px";	
	},
	
	/**
	 * Get the font size
	 * @return {String}
	 */
	getFontSize: function() {
		return this.fontSize;
	},
	
	/**
	 * Set the rendering weight of the font
	 * @param weight {String}
	 */
	setFontWeight: function(weight) {
		this.fontWeight = weight;	
	},
	
	/**
	 * Get the weight of the font to be rendered to the context
	 * @return {String}
	 */
	getFontWeight: function() {
		return this.fontWeight;
	},
	
	/**
	 * Set the font alignment for the context
	 * @param align {String} The font alignment
	 */
	setFontAlign: function(align) {
		this.fontAlign = align;
	},
	
	/**
	 * Get the alignment of the font
	 * @return {String}
	 */
	getFontAlign: function() {
		return this.fontAlign;
	},
	
	/**
	 * Set the baseline of the renderable font
	 * @param baseline {String} The render baseline
	 */
	setFontBaseline: function(baseline) {
		this.fontBaseline = baseline;
	},
	
	/**
	 * Get the font baseline
	 * @return {String}
	 */
	getFontBaseline: function() {
		return this.fontBaseline;
	},

	/**
	 * Set the style of the renderable font
	 * @param style {String} The font style
	 */
	setFontStyle: function(style) {
		this.fontStyle = style;
	},
	
	/**
	 * Get the renderable style of the font
	 * @return {String}
	 */
	getFontStyle: function() {
		return this.fontStyle;
	},

   /**
    * Set the transformation using a matrix.
    *
    * @param matrix {Matrix2D} The transformation matrix
    */
   setTransform: function(matrix) {
   },

   /**
    * Set the transformation of the world.
    *
    * @param position {Point2D}
    * @param rotation {Number}
    * @param scale {Number}
    */
   setRenderTransform: function(mtx3) {
   },

	/**
	 * Get the render position relative to the world
	 * @return {Point2D}
	 */
   getRenderPosition: function() {
      return Point2D.ZERO;
   },

	/**
	 * Get the render rotation relative to the world
	 * @return {Number}
	 */
   getRenderRotation: function() {
      return 0;
   },

	/**
	 * Get the render scale relative to the world
	 * @return {Number}
	 */
   getRenderScale: function() {
      return 1.0;
   },

   /**
    * Set the line style for the context.
    *
    * @param lineStyle {String} An HTML color or <tt>null</tt>
    */
   setLineStyle: function(lineStyle) {
      this.lineStyle = lineStyle;
   },

   /**
    * Get the current line style for the context.  <tt>null</tt> if
    * not set.
    * @return {String}
    */
   getLineStyle: function() {
      return this.lineStyle;
   },

   /**
    * Set the line width for drawing paths.
    *
    * @param [width=1] {Number} The width of lines in pixels
    */
   setLineWidth: function(width) {
      this.lineWidth = width;
   },

   /**
    * Get the current line width for drawing paths.
    * @return {Number}
    */
   getLineWidth: function() {
      return this.lineWidth;
   },

   /**
    * Set the fill style of the context.
    *
    * @param fillStyle {String} An HTML color, or <tt>null</tt>.
    */
   setFillStyle: function(fillStyle) {
      this.fillStyle = fillStyle;
   },

   /**
    * Get the current fill style of the context.
    * @return {String}
    */
   getFillStyle: function() {
      return this.fillStyle;
   },

   /**
    * Draw an un-filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    * @param [ref] {HostObject} A reference host object
    */
   drawRectangle: function(rect /*, ref */) {
   },

   /**
    * Draw a filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    * @param [ref] {HostObject} A reference host object
    */
   drawFilledRectangle: function(rect /*, ref */) {
   },

   /**
    * Draw an un-filled arc on the context.  Arcs are drawn in clockwise
    * order.
    *
    * @param point {Point2D} The point around which the arc will be drawn
    * @param radius {Number} The radius of the arc in pixels
    * @param startAngle {Number} The starting angle of the arc in degrees
    * @param endAngle {Number} The end angle of the arc in degrees
    * @param [ref] {HostObject} A reference host object
    */
   drawArc: function(point, radius, startAngle, endAngle /*, ref */) {
   },

   /**
    * Draw a filled arc on the context.  Arcs are drawn in clockwise
    * order.
    *
    * @param point {Point2D} The point around which the arc will be drawn
    * @param radius {Number} The radius of the arc in pixels
    * @param startAngle {Number} The starting angle of the arc in degrees
    * @param endAngle {Number} The end angle of the arc in degrees
    * @param [ref] {HostObject} A reference host object
    */
   drawFilledArc: function(point, radius, startAngle, endAngle /*, ref */) {
   },

   /**
    * Helper method to draw a circle by calling the {@link #drawArc} method
    * with predefined start and end angle of zero and 6.28 radians.
    *
    * @param point {Point2D} The point around which the circle will be drawn
    * @param radius {Number} The radius of the circle in pixels
    * @param [ref] {HostObject} A reference host object
    */
   drawCircle: function(point, radius /*, ref */) {
      this.drawArc(point, radius, 0, 6.28);
   },
   
   /**
    * Helper method to draw a filled circle by calling the {@link #drawFilledArc} method
    * with predefined start and end angle of zero and 6.28 radians.
    *
    * @param point {Point2D} The point around which the circle will be drawn
    * @param radius {Number} The radius of the circle in pixels
    * @param [ref] {HostObject} A reference host object
    */
   drawFilledCircle: function(point, radius /*, ref */) {
      this.drawFilledArc(point, radius, 0, 6.28);
   },

   /**
    * Draw a polygon or polyline using a Duff's device for
    * efficiency and loop unrolling with inversion for speed.
    *
    * @param pointArray {Array} An array of <tt>Point2D</tt> objects
    * @param closedLoop {Boolean} <tt>true</tt> to close the polygon
    * @private
    */
   _poly: function(pointArray, closedLoop) {
      this.startPath();
      this.moveTo(pointArray[0]);
      var p = 1;

      // Using Duff's device with loop inversion
      switch((pointArray.length - 1) & 0x3)
      {
         case 3:
            this.lineSeg(pointArray[p++]);
         case 2:
            this.lineSeg(pointArray[p++]);
         case 1:
            this.lineSeg(pointArray[p++]);
      }

      if (p < pointArray.length)
      {
         do
         {
            this.lineSeg(pointArray[p++]);
            this.lineSeg(pointArray[p++]);
            this.lineSeg(pointArray[p++]);
            this.lineSeg(pointArray[p++]);
         } while (p < pointArray.length);
      }

      if (closedLoop)
      {
         this.endPath();
      }
   },

   /**
    * Draw an un-filled polygon on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    * @param [ref] {HostObject} A reference host object
    */
   drawPolygon: function(pointArray /*, ref */) {
      this._poly(pointArray, true);
      this.strokePath();
      this.lineSeg.moveTo = false;
   },

   /**
    * Draw a non-closed poly line on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    * @param [ref] {HostObject} A reference host object
    */
   drawPolyline: function(pointArray /*, ref */) {
      this._poly(pointArray, false);
      this.strokePath();
      this.lineSeg.moveTo = false;
   },

   /**
    * Draw an filled polygon on the context.
    *
    * @param pointArray {Array} An array of {@link Point2D} objects
    * @param [ref] {HostObject} A reference host object
    */
   drawFilledPolygon: function(pointArray /*, ref */) {
      this._poly(pointArray, true);
      this.fillPath();
      this.lineSeg.moveTo = false;
   },

   /**
    * Draw a line on the context.
    *
    * @param point1 {Point2D} The start of the line
    * @param point2 {Point2D} The end of the line
    * @param [ref] {HostObject} A reference host object
    */
   drawLine: function(point1, point2 /*, ref */) {
   },

   /**
    * Draw a point on the context.
    *
    * @param point {Point2D} The position to draw the point
    * @param [ref] {HostObject} A reference host object
    */
   drawPoint: function(point /*, ref */) {
   },

   /**
    * Draw a sprite on the context.
    *
    * @param sprite {Sprite} The sprite to draw
    * @param time {Number} The current world time
    * @param [ref] {HostObject} A reference host object
    */
   drawSprite: function(sprite, time /*, ref */) {
   },

   /**
    * Draw an image on the context.
    *
    * @param rect {Rectangle2D} The rectangle that specifies the position and
    *             dimensions of the image rectangle.
    * @param image {Object} The image to draw onto the context
    * @param [srcRect] {Rectangle2D} <i>[optional]</i> The source rectangle within the image, if
    *                <tt>null</tt> the entire image is used
    * @param [ref] {HostObject} A reference host object
    */
   drawImage: function(rect, image, srcRect /*, ref */) {
   },

   /**
    * Capture an image from the context.
    *
    * @param rect {Rectangle2D} The area to capture
    * @return {ImageData} Image data capture
    */
   getImage: function(rect) {
   },

   /**
    * Draw an image, captured with {@link #getImage}, to
    * the context.
    *
    * @param imageData {ImageData} Image data captured
    * @param point {Point2D} The poisition at which to draw the image
    * @param [ref] {HostObject} A reference host object
    */
   putImage: function(imageData, point /*, ref */) {
   },

   /**
    * Draw text on the context.
    *
    * @param point {Point2D} The top-left position to draw the image.
    * @param text {String} The text to draw
    * @param [ref] {HostObject} A reference host object
    */
   drawText: function(point, text /*, ref */) {
   },

   /**
    * Start a path.
    */
   startPath: function() {
   },

   /**
    * End a path.
    */
   endPath: function() {
   },

   /**
    * Stroke a path using the current line style and width.
    */
   strokePath: function() {
   },

   /**
    * Fill a path using the current fill style.
    */
   fillPath: function() {
   },

   /**
    * Move the current path to the point sepcified.
    *
    * @param point {Point2D} The point to move to
    */
   moveTo: function(point) {
   },

   /**
    * Draw a line from the current point to the point specified.
    *
    * @param point {Point2D} The point to draw a line to
    */
   lineTo: function(point) {
   },

   /**
    * Used to draw line segments for polylines.  If <tt>point</tt>
    * is <tt>null</tt>, the context will move to the next point.  Otherwise,
    * it will draw a line to the point.
    *
    * @param point {Point2D} The point to draw a line to, or null.
    */
   lineSeg: function(point) {
      if (point == null) {
         this.lineSeg.moveTo = true;
         return;
      }

      if (this.lineSeg.moveTo)
      {
         // Cannot have two subsequent nulls
         Assert((point != null), "LineSeg repeated null!", this);
         this.moveTo(point);
         this.lineSeg.moveTo = false;
      }
      else
      {
         this.lineTo(point);
      }
   },

   /**
    * Draw a quadratic curve from the current point to the specified point.
    *
    * @param cPoint {Point2D} The control point
    * @param point {Point2D} The point to draw to
    */
   quadraticCurveTo: function(cPoint, point) {
   },

   /**
    * Draw a bezier curve from the current point to the specified point.
    *
    * @param cPoint1 {Point2D} Control point 1
    * @param cPoint2 {Point2D} Control point 2
    * @param point {Point2D} The point to draw to
    */
   bezierCurveTo: function(cPoint1, cPoint2, point) {
   },

   /**
    * Draw an arc from the current point to the specified point.
    *
    * @param point1 {Point2D} Arc point 1
    * @param point2 {Point2D} Arc point 2
    * @param radius {Number} The radius of the arc
    */
   arcTo: function(point1, point2, radius) {
   }
}, {
   /**
    * Get the class name of this object
    *
    * @return {String} "RenderContext2D"
    */
   getClassName: function() {
      return "RenderContext2D";
   },
	
	/**
	 * Bold text weight
	 * @type {String}
	 */
	FONT_WEIGHT_BOLD: "bold",
	
	/**
	 * Normal text weight
	 * @type {String}
	 */
	FONT_WEIGHT_NORMAL: "normal",
	
	/**
	 * Light text weight
	 * @type {String}
	 */
	FONT_WEIGHT_LIGHT: "light",
	
	/**
	 * Text align left
	 * @type {String}
	 */
	FONT_ALIGN_LEFT: "left",
	
	/**
	 * Text align right
	 * @type {String}
	 */
	FONT_ALIGN_RIGHT: "right",
	
	/**
	 * Text align center
	 * @type {String}
	 */
	FONT_ALIGN_CENTER: "center",
	
	/**
	 * Text align start of stroke
	 * @type {String}
	 */
	FONT_ALIGN_START: "start",
	
	/**
	 * Text align end of stroke
	 * @type {String}
	 */
	FONT_ALIGN_END: "end",
	
	/**
	 * Text baseline alphabetic
	 * @type {String}
	 */
	FONT_BASELINE_ALPHABETIC: "alphabetic",
	
	/**
	 * Text baseline top of em box
	 * @type {String}
	 */
	FONT_BASELINE_TOP: "top",
	
	/**
	 * Text baseline hanging ideograph
	 * @type {String}
	 */
	FONT_BASELINE_HANGING: "hanging",
	
	/**
	 * Text baseline middle of em square
	 * @memberOf RenderContext2D
	 */
	FONT_BASELINE_MIDDLE: "middle",
	
	/**
	 * Text baseline ideographic bottom
	 * @type {String}
	 */
	FONT_BASELINE_IDEOGRAPHIC: "ideographic",
	
	/**
	 * Text baseline bottom of em square
	 * @type {String}
	 */
	FONT_BASELINE_BOTTOM: "bottom",
	
	/**
	 * Text style italic
	 * @type {String}
	 */
	FONT_STYLE_ITALIC: "italic",
	
	/**
	 * Text style normal
	 * @type {String}
	 */
	FONT_STYLE_NORMAL: "normal",
	
	/**
	 * Text style oblique
	 * @type {String}
	 */
	FONT_STYLE_OBLIQUE: "oblique"
});

return RenderContext2D;

});