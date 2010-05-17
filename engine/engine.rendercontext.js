/**
 * The Render Engine
 * RenderContext
 *
 * @fileoverview The base class for all render contexts.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 780 $
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
Engine.include("/engine/engine.container.js");
Engine.include("/engine/engine.math2d.js");
Engine.include("/engine/engine.hostobject.js");

Engine.initObject("RenderContext", "Container", function() {

/**
 * @class A base rendering context.  Game objects are rendered to a context
 * during engine runtime.  A render context is a container of all of the objects
 * added to it so that each object is given the chance to render.
 *
 * @constructor
 * @param contextName {String} The name of this context.  Default: RenderContext
 * @param [surface] {HTMLElement} The surface node that all objects will be rendered to.
 * @see CanvasContext
 * @see DocumentContext
 * @extends Container
 */
var RenderContext = Container.extend(/** @scope RenderContext.prototype */{

   surface: null,
   transformStackDepth: 0,
   viewport: null,
   worldPosition: null,
   worldRotation: null,
   worldScale: null,

   /**
    * @private
    */
   constructor: function(contextName, surface) {
      this.base(contextName || "RenderContext");
      this.surface = surface;
      this.setElement(surface);
      this.worldScale = 1;
      this.worldPosition = Point2D.create(0, 0);
      this.worldRotation = 0;
      this.viewport = Rectangle2D.create(0, 0, 100, 100);
   },

   /**
    * @private
    */
   release: function() {
      this.base();
      this.surface = null;
      this.transformStackDepth = 0;
      this.worldScale = null;
      this.worldPosition = null;
      this.worldRotation = null;
   },

   /**
    * Destroy the rendering context, and detach the surface from its
    * parent container.
    */
   destroy: function() {
      this.base();
      this.surface = null;
   },

   /**
    * Set the surface element that objects will be rendered to.
    *
    * @param element {HTMLElement} The document node that all objects will be rendered to.
    */
   setSurface: function(element) {
      this.surface = element;
      this.setElement(element);
   },

   /**
    * Get the surface node that all objects will be rendered to.
    * @return {HTMLElement} The document node that represents the rendering surface
    */
   getSurface: function() {
      return this.surface;
   },

   /**
    * Set the scale of the rendering context.
    *
    * @param scaleX {Number} The scale along the X dimension
    * @param scaleY {Number} The scale along the Y dimension
    */
   setScale: function(scaleX, scaleY) {
   },

   /**
    * Set the world scale of the rendering context.  All objects should
    * be adjusted by this scale when the context renders.
    *
    * @param scale {Number} The uniform scale of the world
    */
   setWorldScale: function(scale) {
      this.worldScale = scale;
   },

   setWorldRotation: function(rotation) {
      this.worldRotation = rotation;
   },

   setWorldPosition: function(point) {
      this.worldPosition.set(point);
   },

   /**
    * Gets an array representing the rendering scale of the world.
    * @return {Array} The first element is the X axis, the second is the Y axis
    */
   getWorldScale: function() {
      return this.worldScale;
   },

   getWorldRotation: function() {
      return this.worldRotation;
   },

   getWorldPosition: function() {
      return this.worldPosition;
   },

   setViewport: function(rect) {
      this.viewport = Rectangle2D.create(rect);
   },

   getViewport: function() {
      return this.viewport;
   },

   /**
    * Add an object to the render list.  Only objects
    * within the render list will be rendered.  If an object declared
    * an <tt>afterAdd</tt> method, it will be called after the object
    * has been added to the context.
    *
    * @param obj {BaseObject} The object to add to the render list
    */
   add: function(obj) {
      this.base(obj);
      if (obj instanceof HostObject)
      {
         obj.setRenderContext(this);
         this.sort();

         // Create a structure to hold information that is related to
         // the render context that keeps it separate from the rest of the object.
         obj.RenderContext = {};
      }

      if (obj.afterAdd) {
         // If the object being added to the render context has
         // an "afterAdd" method, call it (canvas uses this for IE emulation)
         obj.afterAdd(this);
      }
   },

   /**
    * Returns the structure that contains information held about
    * the rendering context.  This object allows a context to store
    * extra information on an object that an object wouldn't know about.
    * @return {Object} An object with data used by the context
    */
   getContextData: function(obj) {
      return obj.RenderContext;
   },

   /**
    * Sort the render context's objects by their respective Z-index value.
    */
   sort: function() {
      this.base(RenderContext.sortFn);
   },

   /**
    * Clear the context and prepare it for rendering.  If you pass a
    * rectangle, only that portion of the world will be cleared.  If
    * you don't pass a rectangle, the entire context is cleared.
    *
    * @param rect {Rectangle2D} The area to clear in the context, or
    *             <tt>null</tt> to clear the entire context.
    */
   reset: function(rect) {
   },

   /**
    * Update the render context before rendering the objects to the surface.
    *
    * @param parentContext {RenderContext} A parent context, or <tt>null</tt>
    * @param time {Number} The current render time in milliseconds from the engine.
    */
   update: function(parentContext, time)
   {
      this.render(time);
   },

   /**
    * Called after the update to render all of the objects to the context.
    *
    * @param time {Number} The current render time in milliseconds from the engine.
    */
   render: function(time) {
      // Setup the world
      this.reset();

      // Push the world transform
      this.pushTransform();
      this.setupWorld(time);

      // Run the objects if they are visible
      var objs = this.getObjects();
      for (var o in objs)
      {
         this.renderObject(objs[o], time);
      }

      // Restore the world transform
      this.popTransform();
   },

   renderObject: function(obj, time) {
      obj.update(this, time);
   },

   /**
    * Gives the render context a chance to initialize the world.
    * Use this method to change the world position, rotation, scale, etc.
    *
    * @param time {Number} The current world time
    */
   setupWorld: function(time) {
   },

   /**
    * Increment the transform stack counter.
    */
   pushTransform: function() {
      this.transformStackDepth++;
   },

   /**
    * Decrement the transform stack counter and ensure that the stack
    * is not unbalanced.  An unbalanced stack can be indicative of
    * objects that do not reset the state after rendering themselves.
    */
   popTransform: function() {
      this.transformStackDepth--;
      Assert((this.transformStackDepth >= 0), "Unbalanced transform stack!");
   },

   /**
    * This is a potentially expensive call, and can lead to rendering
    * errors.  It is recommended against calling this method!
    */
   resetTransformStack: function() {
      while (this.transformStackDepth > 0)
      {
         this.popTransform();
      }
   }
}, { /** @scope RenderContext.prototype */

   /**
    * Sort the objects to draw from objects with the lowest
    * z-index to the highest z-index.
    * @static
    */
   sortFn: function(obj1, obj2) {
      if (obj1 instanceof HostObject ||
          obj2 instanceof HostObject)
      {
         return 0;
      }

      return obj1.getZIndex() - obj2.getZIndex();
   },

   /**
    * Get the class name of this object
    * @return {String} The string "RenderContext"
    */
   getClassName: function() {
      return "RenderContext";
   }

});

return RenderContext;

});
