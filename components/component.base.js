/**
 * The Render Engine
 * BaseComponent
 *
 * @fileoverview The base class from which all components extend.  A component
 * 				  is a piece of functionality used by a HostObject.
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
Engine.include("/engine/engine.baseobject.js");
Engine.include("/engine/engine.hostobject.js");

Engine.initObject("BaseComponent", "BaseObject", function() {

/**
 * @class All components extend from this object class.  A component is one
 *        part of an operating whole object (a {@link HostObject}) which is
 *        responsible for only a portion of the overall operation of an in-
 *        game object.  Components are broken down into five major categories:
 *        <ul>
 *          <li><b>TYPE_INPUT</b> - Input from controllers (keyboard, mouse, etc.)</li>
 *          <li><b>TYPE_TRANSFORM</b> - Performs transformations on the host object</li>
 *          <li><b>TYPE_LOGIC</b> - Handles logical operations that are not related to
 *              input and collision</li>
 *          <li><b>TYPE_COLLIDER</b> - Determines what this object is possibly colliding
 *              with, and reports those collisions via callbacks to the host.</li>
 *          <li><b>TYPE_RENDER</b> - Performs some sort of rendering operation to the context</li>
 *        </ul>
 *        Components are executed in the order listed.  First, all inputs are
 *        checked, then logic is performed.  Logic may be internal to a host object
 *        itself, but some components perform an object-centric type of logic that
 *        can be reused.  Next, collisions are checked.  And finally, rendering can
 *        occur.
 *        <p/>
 *        Within each component type set, components can be prioritized so that
 *        one component will execute before others.  Such an ordering allows for
 *        multiple components of each type to perform their tasks in an order
 *        that the host defines.
 *
 *
 * @extends BaseObject
 */
var BaseComponent = BaseObject.extend(/** @scope BaseComponent.prototype */{

   priority: 0,

   type: -1,

   host: null,

   /**
    * Create a new instance of a component, setting the name, type, and
    * update priority of this component compared to all other components
    * within the host.
    *
    * @param name {String} The name of the component
    * @param type {Number} The type of the component
    * @param priority {Number} A value between 0.0 and 1.0.  Default: 0.5
    */
   constructor: function(name, type, priority) {
      Assert((name != null), "You must assign a name to every Component.");
      name = name.toUpperCase();

      Assert((type != null && (type >= BaseComponent.TYPE_INPUT && type <= BaseComponent.TYPE_RENDERING)),
             "You must specify a type for BaseComponent");

      this.type = type;

      Assert((priority != null && (priority >= 0.0 && priority <= 1.0)),
             "Priority must be between 0.0 and 1.0 for BaseComponent");

      this.priority = priority || 0.5;
      this.base(name);
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.priority = 0;
      this.type = -1;
      this.host = null;
   },

   /**
    * Set the host object this component exists within.
    *
    * @param hostObject {HostObject} The object which hosts this component
    */
   setHostObject: function(hostObject) {
      this.host = hostObject;
   },

   /**
    * Get the host object this component exists within.
    *
    * @type HostObject
    */
   getHostObject: function() {
      return this.host;
   },

   /**
    * Get the type of this component.  Will be one of:
    * {@link #TYPE_INPUT}, {@link #TYPE_TRANSFORM}, {@link #TYPE_LOGIC},
    * {@link #TYPE_COLLIDER}, or {@link #TYPE_RENDERING}
    *
    * @type Number
    */
   getType: function() {
      return this.type;
   },

   /**
    * Set the execution priority of this component with
    * 1.0 being the highest priority and 0.0 being the lowest.  Components
    * within a host object are sorted by type, and then priority.
    *
    * @param priority {Number} A value between 0.0 and 1.0
    */
   setPriority: function(priority) {
      this.priority = priority;
      this.getHost().sort();
   },

   /**
    * Returns the priority of this component.
    *
    * @type Number
    */
   getPriority: function() {
      return this.priority;
   },

   /**
    * Run the component, updating its state.  Not all components will need an execute
    * method.  However, it is important to include one if you need to run calculations
    * or update the state of the component each engine cycle.
    *
    * @param renderContext {RenderContext} The context the component will render within.
    * @param time {Number} The global engine time
    * @param rendering {Boolean} <tt>true</tt> during the rendering phase
    */
   execute: function(renderContext, time, rendering) {
      // Does nothing...
   },

   /**
    * Converts the type name to a string.
    *
    * @type String
    */
   getTypeString: function() {
      var ts = "";
      switch (this.getType()) {
         case BaseComponent.TYPE_INPUT: ts = "TYPE_INPUT"; break;
         case BaseComponent.TYPE_TRANSFORM: ts = "TYPE_TRANSFORM"; break;
         case BaseComponent.TYPE_LOGIC: ts = "TYPE_LOGIC"; break;
         case BaseComponent.TYPE_COLLIDER: ts = "TYPE_COLLIDER"; break;
         case BaseComponent.TYPE_RENDERING: ts = "TYPE_RENDERING"; break;
         default: ts = "TYPE_UNKNOWN";
      }

      return ts;
   }


}, /** @scope BaseComponent.prototype */{

   /**
    * Get the class name of this object
    *
    * @return {String} The string "BaseComponent"
    */
   getClassName: function() {
      return "BaseComponent";
   },

   /**
    * An input component
    * @type Number
    */
   TYPE_INPUT:          1,

   /**
    * A transformation (move,rotate,scale) component
    * @type Number
    */
   TYPE_TRANSFORM:      2,

   /**
    * A logic component
    * @type Number
    */
   TYPE_LOGIC:          3,

   /**
    * A collider component
    * @type Number
    */
   TYPE_COLLIDER:       4,

   /**
    * A rendering component
    * @type Number
    */
   TYPE_RENDERING:      5
});

return BaseComponent;

});