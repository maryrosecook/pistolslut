/**
 * The Render Engine
 * SVGContext
 *
 * @fileoverview An extension of the 2D render context using the SVG (Scalable 
 * 				  Vector Graphics) as a render context.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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
Engine.include("/rendercontexts/context.render2d.js");

Engine.initObject("SVGContext", "RenderContext2D", function() {

var SVGContext = RenderContext2D.extend({

   context2D: null,

   transformStack: null,

   currentTransform: null,

   /**
    * Create an instance of a 2D rendering context using the canvas element.
    *
    * @param contextName {String} The name of this context.  Default: CanvasContext
    * @param width {Number} The width (in pixels) of the canvas context.
    * @param height {Number} The height (in pixels) of the canvas context.
    */
   constructor: function(width, height) {
      Assert((width != null && height != null), "Width and height must be specified in CanvasContext");

      this.setWidth(width);
      this.setHeight(height);

      // Create the canvas element
      var svg = document.createElement("svg");
      svg.xmlns = "http://www.w3.org/2000/svg";
      svg.version = "1.1";
      svg.width = this.width + "px";
      svg.height = this.height + "px";
      svg.id = this.getId();

      this.transformStack = new SVGTransformList();
      this.transformStack.initialize();

      this.currentTransform = new SVGTransform();

      this.base("SVGContext", svg);
   },

   /**
    * Push a transform state onto the stack.
    */
   pushTransform: function() {
      this.base();
      this.transformList.appendItem(this.currentTransform);
   },

   /**
    * Pop a transform state off the stack.
    */
   popTransform: function() {
      this.base();
      this.currentTransform = this.transformList.removeItem(this.transformList.numberOfItems - 1);
   },

   /**
    * Get the current transform
    */
   getCurrentTransform: function() {
      return this.currentTransform;
   },

   //================================================================
   // Drawing functions

   reset: function() {
      this.get2DContext().clearRect(0,0,this.width,this.height);
   },

   setBackgroundColor: function(color) {
      jQuery(this.getSurface()).css("background-color", color);
      this.base(color);
   },

   setPosition: function(point) {
      this.currentTransform = this.currentTransform.setTranslate(point.x, point.y);
      this.base(point);
   },

   setRotation: function(angle) {
      this.currentTransform = this.currentTransform.setRotate(angle, 0, 0);
      this.base(angle);
   },

   setScale: function(scaleX, scaleY) {
      scaleX = scaleX || 1;
      scaleY = scaleY || scaleX;
      this.currentTransform = this.currentTransform.setScale(scaleX, scaleY);
      this.base(scaleX, scaleY);
   },

   setTransform: function(matrix) {
   },

   setLineStyle: function(lineStyle) {
      this.base(lineStyle);
   },

   setLineWidth: function(width) {
      this.base(width);
   },

   setFillStyle: function(fillStyle) {
      this.base(fillStyle);
   },

   drawRectangle: function(point, width, height) {
      this.base(point, width, height);
   },

   drawFilledRectangle: function(point, width, height) {
      this.base(point, width, height);
   },

   _arc: function(point, radiusX, startAngle, endAngle) {
      this.startPath();
//      this.get2DContext().arc(point.x, point.y, startAngle, endAngle, true);
      this.endPath();
   },

   drawArc: function(point, radiusX, startAngle, endAngle) {
      this.strokePath();
      this.base(point, radiusX, startAngle, endAngle);
   },

   drawFilledArc: function(point, radiusX, startAngle, endAngle) {
      this.fillPath();
      this.base(point, radiusX, startAngle, endAngle);
   },

   _poly: function(pointArray) {
      this.startPath();
      this.moveTo(pointArray[0]);
      var p = 1;

      // Using Duff's device with loop inversion
      switch((pointArray.length - 1) & 0x3)
      {
         case 3:
            this.lineTo(pointArray[p++]);
         case 2:
            this.lineTo(pointArray[p++]);
         case 1:
            this.lineTo(pointArray[p++]);
      }

      if (p < pointArray.length)
      {
         do
         {
            this.lineTo(pointArray[p++]);
            this.lineTo(pointArray[p++]);
            this.lineTo(pointArray[p++]);
            this.lineTo(pointArray[p++]);
         } while (p < pointArray.length);
      }

      this.endPath();
   },

   /**
    * Creates a render list which will make inline calls to the
    * line drawing methods instead of looping over them.  Logically
    * this method returns a function which will draw the polygon.
    *
    * @param pointArray {Array} An array of Point2D objects
    * @type Function
    */
   buildRenderList: function(pointArray) {
      var f = "arguments.callee.ctx.startPath(); arguments.callee.ctx.moveTo(arguments.callee.ptArr[0]);";
      for (var p = 1; p < pointArray.length; p++)
      {
         f += "arguments.callee.ctx.lineTo(arguments.callee.ptArr[" + p + "]);";
      }
      f += "arguments.callee.ctx.endPath();arguments.callee.ctx.strokePath();";
      var _fastPoly = new Function(f);
      _fastPoly.ctx = this;
      _fastPoly.ptArr = pointArray;
      _fastPoly.isRenderList = true;
      return _fastPoly;
   },

   drawPolygon: function(pointArray) {
      if (pointArray.isRenderList)
      {
         pointArray();
         return;
      }
      this._poly(pointArray);
      this.strokePath();
      this.base(pointArray);
   },

   drawFilledPolygon: function(pointArray) {
      if (pointArray.isRenderList)
      {
         pointArray();
      this.fillPath();
         return;
      }
      this._poly(pointArray);
      this.fillPath();
      this.base(pointArray);
   },

   drawLine: function(point1, point2) {
      this.startPath();
      this.moveTo(point1.x, point1.y);
      this.lineTo(point2.x, point2.y);
      this.endPath();
      this.strokePath();
      this.base(point1, point2);
   },

   drawPoint: function(point) {
      this.drawLine(point, point);
      this.base(point);
   },

   drawImage: function(point, resource) {
      this.base(point, resource);
   },

   drawText: function(point, text) {
      this.base(point, text);
   },

   startPath: function() {
      this.base();
   },

   endPath: function() {
      this.base();
   },

   strokePath: function() {
      this.base();
   },

   fillPath: function() {
      this.base();
   },

   moveTo: function(point) {
      this.base(point);
   },

   lineTo: function(point) {
      this.base(point);
   },

   quadraticCurveTo: function(cPoint, point) {
      this.base(cPoint, point);
   },

   bezierCurveTo: function(cPoint1, cPoint2, point) {
      this.base(cPoint1, cPoint2, point);
   },

   arcTo: function(point1, point2, radius) {
      this.base(point1, point2, radius);
   }

}, /** @scope SVGContext.prototype */{
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "SVGContext";
   }
});

return SVGContext;

});