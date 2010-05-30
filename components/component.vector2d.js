/**
 * The Render Engine
 * VectorDrawComponent
 *
 * @fileoverview An extension of the render component which draws 2D
 * 				  wireframe (vector) models to the render context.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 615 $
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
Engine.include("/engine/engine.math2d.js");
Engine.include("/components/component.render.js");

Engine.initObject("Vector2DComponent", "RenderComponent", function() {

/**
 * @class A render component that renders its contents from a set of points.
 * @extends BaseComponent
 */
var Vector2DComponent = RenderComponent.extend(/** @scope Vector2DComponent.prototype */{

   strokeStyle: "#ffffff",     // Default to white lines

   lineWidth: 1,

   fillStyle: null,          // Default to none

   points: null,

   fullBox: null,

   closedManifold: null,

   /**
    * @constructor
    * @memberOf Vector2DComponent
    */
   constructor: function(name, priority) {
      this.base(name, priority || 0.1);
      this.closedManifold = true;
   },

   release: function() {
      this.base();
      this.strokeStyle = "#ffffff";
      this.lineWidth = 1;
      this.fillStyle = null;
      this.points = null;
      this.fullBox = null;
      this.closedManifold = null;
   },

   /**
    * Calculate the bounding box from the set of
    * points which comprise the shape to be rendered.
    * @private
    */
   calculateBoundingBox: function() {
      var x1 = 0;
      var x2 = 0;
      var y1 = 0;
      var y2 = 0;
      for (var p = 0; p < this.points.length; p++)
      {
         var pt = this.points[p];

         if (pt.x < x1)
         {
            x1 = pt.x;
         }
         if (pt.x > x2)
         {
            x2 = pt.x;
         }
         if (pt.y < y1)
         {
            y1 = pt.y;
         }
         if (pt.y > y2)
         {
            y2 = pt.y;
         }
      }

      var bbox = new Rectangle2D(x1, y1, Math.abs(x1) + x2, Math.abs(y1) + y2);
      this.getHostObject().setBoundingBox(bbox);

      // Figure out longest axis
      if (bbox.len_x() > bbox.len_y)
      {
         this.fullBox = new Rectangle2D(x1,x1,Math.abs(x1) + x2,Math.abs(x1) + x2);
      }
      else
      {
         this.fullBox = new Rectangle2D(y1,y1,Math.abs(y1) + y2,Math.abs(y1) + y2);
      }
   },

   /**
    * Set the points which comprise the shape of the object to
    * be rendered to the context.
    *
    * @param pointArray {Array} An array of <tt>Point2D</tt> instances
    */
   setPoints: function(pointArray) {
      this.points = pointArray;
      this.renderState = null;
      this.calculateBoundingBox();
   },

   /**
    * Set the color of the lines to be drawn for this shape.
    *
    * @param strokeStyle {String} The HTML color of the stroke (lines) of the shape
    */
   setLineStyle: function(strokeStyle) {
      this.strokeStyle = strokeStyle;
   },

   /**
    * Returns the line style that will be used to draw this shape.
    * @type String
    */
   getLineStyle: function() {
      return this.strokeStyle;
   },

   /**
    * Set the width of lines used to draw this shape.
    *
    * @param lineWidth {Number} The width of lines in the shape
    */
   setLineWidth: function(lineWidth) {
      this.lineWidth = lineWidth;
   },

   /**
    * Returns the width of the lines used to draw the shape.
    * @type Number
    */
   getLineWidth: function() {
      return this.lineWidth;
   },

   /**
    * Set the color used to fill the shape.
    *
    * @param fillStyle {String} The HTML color used to fill the shape.
    */
   setFillStyle: function(fillStyle) {
      this.fillStyle = fillStyle;
   },

   /**
    * @memberOf Vector2DComponent
    */
   getFillStyle: function() {
      return this.fillStyle;
   },

   /**
    * Set whether or not we draw a polygon or polyline.  <tt>true</tt>
    * to draw a polygon (the path formed by the points is a closed loop.
    *
    * @param closed {Boolean}
    */
   setClosed: function(closed) {
      this.closedManifold = closed;
   },

   /**
    * Draw the shape, defined by the points, to the rendering context
    * using the specified line style and fill style.
    *
    * @param renderContext {RenderContext} The context to render to
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {
      if (!(this.points && this.base(renderContext, time)))
      {
         return;
      }

      // Set the stroke and fill styles
      if (this.getLineStyle() != null)
      {
         renderContext.setLineStyle(this.strokeStyle);
      }

      renderContext.setLineWidth(this.lineWidth);

      if (this.getFillStyle() != null)
      {
         renderContext.setFillStyle(this.fillStyle);
      }

      // Render out the points
      if (this.closedManifold)
      {
         renderContext.drawPolygon(this.points);
      }
      else
      {
         renderContext.drawPolyline(this.points);
      }

      if (this.fillStyle)
      {
         renderContext.drawFilledPolygon(this.points);
      }
   }
}, {
   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf Vector2DComponent
    */
   getClassName: function() {
      return "Vector2DComponent";
   }
});

return Vector2DComponent;

});