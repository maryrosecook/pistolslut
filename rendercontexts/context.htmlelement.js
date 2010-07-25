/**
 * The Render Engine
 * HTMLElementContext
 *
 * @fileoverview A render context which wraps a specified HTML node.
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
Engine.include("/rendercontexts/context.render2d.js");

Engine.initObject("HTMLElementContext", "RenderContext2D", function() {

/**
 * @class A wrapper for any HTML element to convert it into a targetable render context.
 *        The {@link DocumentContext} and {@link HTMLDivContext} use this as their base
 *        class.
 *
 * @extends RenderContext2D
 * @constructor
 * @description Create an instance of an HTML element rendering context.  This context
 * represents any HTML element.
 * @param name {String} The name of the context
 * @param element {Number} The element which is the surface of the context.
 * @see DocumentContext
 */
var HTMLElementContext = RenderContext2D.extend(/** @scope HTMLElementContext.prototype */{

   transformStack: null,
   
   cursorPos: null,
   
   jQObj: null,

   /**
    * @private
    */
   constructor: function(name, element) {
      this.base(name || "HTMLElementContext", element);
      element.id = this.getId();
      this.cursorPos = Point2D.create(0,0);
      this.transformStack = [];
      this.pushTransform();
      this.jQObj = null;
      this.setViewport(Rectangle2D.create(0, 0, this.jQ().width(), this.jQ().height()));
   },

   /**
    * Eliminate the elements from container element.
    */
   destroy: function() {
      
      // If the objects in the context are elements in
      // the DOM, remove them from the DOM
      var objs = this.getObjects();
      for (var o in objs)
      {
         var e = objs[o].getElement();
         if (e && e.nodeName && e != document.body) {
            
            this.getSurface().removeChild(e);
         }
      }
      this.cursorPos.destroy();
      this.getViewport().destroy();
      this.base();
   },

   /**
    * Retrieve the jQuery object which represents the element.
    * @return {jQuery} Object
    */
   jQ: function() {
      if (this.jQObj == null) {
         this.jQObj = $(this.getSurface());
      }
      return this.jQObj;
   },

   /**
    * Add an object to the context, or create an element to represent the object.
    * @param obj {HTMLElement} The element, or <tt>null</tt>
    */
   add: function(obj) {
      if (!obj.getElement())
      {
         // Create an element for the object
         obj.setElement($("<div>").css("position", "absolute"));
      }
      this.jQ().append(obj.getElement());
      this.base(obj);
   },

   /**
    * Remove an object from the context.
    * @param obj {HTMLElement} The object to remove
    */
   remove: function(obj) {
      if (obj.getElement())
      {
         this.jQ().remove(obj.getElement());
      }
      this.base(obj);
   },
   
   /**
    * Push a transform state onto the stack.
    */
   pushTransform: function() {
      this.base();
      this.transformStack.push(this.cursorPos); 
   },
   
   /**
    * Pop a transform state off the stack.
    */
   popTransform: function() {
      this.base();
      this.cursorPos = this.transformStack.pop();
   },

   //================================================================
   // Drawing functions

   /**
    * Set the background color of the context.
    *
    * @param color {String} An HTML color
    */
   setBackgroundColor: function(color) {
      this.base(color);
      this.jQ().css("background-color", color);
   },

   /**
    * Set the current transform position (translation).
    *
    * @param point {Point2D} The translation
    */
   setPosition: function(point) {
      this.cursorPos.set(point);
      this.base(point);
   },

  /**
    * Set the width of the context drawing area.
    *
    * @param width {Number} The width in pixels
    */
   setWidth: function(width) {
      this.base(width);
      this.jQ().width(width);
   },

   /**
    * Set the height of the context drawing area
    *
    * @param height {Number} The height in pixels
    */
   setHeight: function(height) {
      this.base(height);
      this.jQ().height(height);
   },

   /**
    * Draw an un-filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    * @param ref {HostObject} A reference host object
    */
   drawRectangle: function(rect, ref) {
      var rD = rect.getDims();
      var d = $("<div>").css({
         borderWidth: this.getLineWidth(),
         borderColor: this.getLineStyle(),
         left: rD.l,
         top: rD.t,
         width: rD.w,
         height: rD.h,
         position: "absolute"
      });
      this.jQ().append(d);
      return d;
   },

   /**
    * Draw a filled rectangle on the context.
    *
    * @param rect {Rectangle2D} The rectangle to draw
    * @param ref {HostObject} A reference host object
    */
   drawFilledRectangle: function(rect, ref) {
      var rD = rect.getDims();
      var d = $("<div>").css({
         borderWidth: this.getLineWidth(),
         borderColor: this.getLineStyle(),
         backgroundColor: this.getFillStyle(),
         left: rD.l,
         top: rD.t,
         width: rD.w,
         height: rD.h,
         position: "absolute"
      });
      this.jQ().append(d);
      return d;
   },

   /**
    * Draw a point on the context.
    *
    * @param point {Point2D} The position to draw the point
    * @param ref {HostObject} A reference host object
    */
   drawPoint: function(point, ref) {
      return this.drawFilledRectangle(Rectangle2D.creat(point.x, point.y, 1, 1), ref);
   },

   /**
    * Draw a sprite on the context.
    *
    * @param sprite {Sprite} The sprite to draw
    * @param time {Number} The current world time
    * @param ref {HostObject} A reference host object
    */
   drawSprite: function(sprite, time, ref) {
      var f = sprite.getFrame(time);
      var tl = f.getTopLeft();
      var rD = f.getDims();

      // The reference object is a host object it
      // will give us a reference to the HTML element which we can then
      // just modify the displayed image for.
      if (ref && (ref instanceof HostObject) && ref.jQ()) {
         ref.jQ().css({
            top: this.cursorPos.y,
            left: this.cursorPos.x,
            width: rD.w,
            height: rD.h,
            backgroundPosition: -tl.x + "px " + tl.y + "px"
         });
      }
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
   drawImage: function(rect, image, srcRect, ref) {
      var rD = rect.getDims();
      srcRect = (srcRect instanceof Rectangle2D ? srcRect : null);
      var sD = srcRect ? srcRect.getDims() : rect.getDims();
      ref = (srcRect instanceof HostObject ? srcRect : ref);

      // The reference object is a host object it
      // will give us a reference to the HTML element which we can then
      // just modify the displayed image for.
      if (ref && (ref instanceof HostObject) && ref.jQ()) {
         ref.jQ().css({
            top: rD.t,
            left: rD.l,
            width: rD.w,
            height: rD.h});
         // Only modify the source, width, and height if they change it
         if (ref.jQ().attr("src") != image.src) {
            ref.jQ().attr("src", image.src);
         }
         if (ref.jQ().attr("width") != rD.w) {
            ref.jQ().attr("width", rD.w)
         }
         if (ref.jQ().attr("height") != rD.h) {
            ref.jQ().attr("height", rD.h)
         }
      }
   },

   /**
    * Draw text on the context.
    *
    * @param point {Point2D} The top-left position to draw the image.
    * @param text {String} The text to draw
    * @param ref {HostObject} A reference host object
    */
   drawText: function(point, text, ref) {
      this.base(point, text);
      // The reference object is a host object it
      // will give us a reference to the HTML element which we can then
      // just modify the displayed image for.
      if (ref && (ref instanceof HostObject) && ref.jQ()) {
         ref.jQ().css({
            font: this.getNormalizedFont(),
            color: this.getFillStyle(),
            left: this.cursorPos.x + point.x,
            top: this.cursorPos.y + point.y,
            position: "absolute"
         }).text(text);
      }
   }

}, /** @scope HTMLElementContext.prototype */{

   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "HTMLElementContext";
   },
   
   /**
    * When the HTMLElementContext's dependencies are resolved, check the browser
    * type and load a specific object which handles specific processing.
    */
   resolved: function() {
      var version = parseFloat(EngineSupport.sysInfo().version);
      switch (EngineSupport.sysInfo().browser) {
         case "safari" :
               if (version >= 3) {
                  // Load support for webkit transforms
                  Engine.include("/rendercontexts/support/context.htmlelement.safari.js");
               }
            break;
         case "mozilla" :
               if (version >= 1.9) {
                  // Load support for gecko transforms
                  Engine.include("/rendercontexts/support/context.htmlelement.gecko.js");
               }
            break;
         default:
            break;
      };
      
   }
});

return HTMLElementContext;

});
