/**
 * The Render Engine
 * RenderContext
 *
 * @fileoverview The base class for all render contexts.
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
Engine.include("/engine/engine.container.js");
Engine.include("/engine/engine.math2d.js");
Engine.include("/engine/engine.hostobject.js");

Engine.initObject("RenderContext", "Container", function() {

/**
 * @class A base rendering context.  Game objects are rendered to a context
 * during engine runtime.  A render context is a container of all of the objects
 * added to it so that each object is given the chance to render.
 *
 * @param contextName {String} The name of this context.  Default: RenderContext
 * @param [surface] {HTMLElement} The surface node that all objects will be rendered to.
 * @see {CanvasContext}
 * @extends Container
 * @constructor
 * @description Creates a render context
 */
var RenderContext = Container.extend(/** @scope RenderContext.prototype */{

   surface: null,
   transformStackDepth: 0,
   viewport: null,
   worldPosition: null,
   worldRotation: null,
   worldScale: null,
	staticCtx: null,

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
		this.staticCtx = false;
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
		this.staticCtx = null;
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
	 * Set the context to be static.  Setting a context to be static effectively removes 
	 * it from the automatic update when the world is updated.  The user will need to call
	 * {@link render}, passing the world time (gotten with {@link Engine#worldTime})
	 * to manually render the context.  Any objects within the context will then render
	 * to the context.
	 * 
	 * @param state {Boolean} <tt>true</tt> to set the context to static
	 */
	setStatic: function(state) {
		this.staticCtx = state;
	},
	
	/**
	 * Determine if the context is static.
	 * @return {Boolean}
	 */
	isStatic: function() {
		return this.staticCtx;
	},

   /**
    * [ABSTRACT] Set the scale of the rendering context.
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

   /**
    * Set the world rotation of the rendering context.  All objects
    * should be adjusted by this rotation when the context renders.
    * @param rotation {Number} The rotation angle
    */
   setWorldRotation: function(rotation) {
      this.worldRotation = rotation;
   },

   /**
    * Set the world position of the rendering context.  All objects
    * should be adjuest by this position when the context renders.
    * @param point {Point2D} The world position
    */
   setWorldPosition: function(point) {
      this.worldPosition.set(point);
   },

   /**
    * Gets an array representing the rendering scale of the world.
    * @return {Number[]} The first element is the X axis, the second is the Y axis
    */
   getWorldScale: function() {
      return this.worldScale;
   },

   /**
    * Gets the world rotation angle.
    * @return {Number}
    */
   getWorldRotation: function() {
      return this.worldRotation;
   },

   /**
    * Get the world render position.
    * @return {Point2D}
    */
   getWorldPosition: function() {
      return this.worldPosition;
   },

   /**
    * Set the viewport of the render context.  The viewport is a window
    * upon the world so that not all of the world is rendered at one time.
    * @param rect {Rectangle2D} A rectangle defining the viewport
    */
   setViewport: function(rect) {
      this.viewport = Rectangle2D.create(rect);
   },

   /**
    * Get the viewport of the render context.
    * @return {Rectangle2D}
    */
   getViewport: function() {
      return this.viewport;
   },

   /**
    * Add an object to the context.  Only objects
    * within the context will be rendered.  If an object declared
    * an <tt>afterAdd()</tt> method, it will be called after the object
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
    * [ABSTRACT] Clear the context and prepare it for rendering.  If you pass a
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
    * If the context isn't static, this will reset and then render the context.
    * If the context is static, you'll need to perform the reset and render yourself.
    * This allows you to updated objects in the world, skip the reset, and then
    * render yourself.  This can be an effective way to handle redrawing the world
    * only as needed.
    *
    * @param parentContext {RenderContext} A parent context, or <tt>null</tt>
    * @param time {Number} The current render time in milliseconds from the engine.
    */
   update: function(parentContext, time)
   {
		if (!this.staticCtx) {
	      // Clear and render world
	      this.reset();
	      this.render(time);
		}
   },

   /**
    * Called to render all of the objects to the context.
    *
    * @param time {Number} The current render time in milliseconds from the engine.
    */
   render: function(time) {
      // Push the world transform
      this.pushTransform();

		try {
	      this.setupWorld(time);
	
	      // Run the objects if they are visible
	      var objs = this.getObjects();
	      for (var o in objs)
	      {
	         this.renderObject(objs[o], time);
	      }
		} finally {
	      // Restore the world transform
	      this.popTransform();
		}
   },

   /**
    * Render a single object into the world for the given time.
    * @param obj {BaseObject} An object to render
    * @param time {Number} The world time, in milliseconds
    */
   renderObject: function(obj, time) {
      obj.update(this, time);
   },

   /**
    * [ABSTRACT] Gives the render context a chance to initialize the world.
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
}, /** @scope RenderContext.prototype */{ 

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
    * @return {String} "RenderContext"
    */
   getClassName: function() {
      return "RenderContext";
   }

});

return RenderContext;

});
