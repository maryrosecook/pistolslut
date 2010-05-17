/**
 * The Render Engine
 * KeyboardInputComponent
 *
 * @fileoverview An extension of the input component which handles
 * 				  mouse input.
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
Engine.include("/engine/engine.events.js");
Engine.include("/components/component.input.js");

Engine.initObject("MouseInputComponent", "InputComponent", function() {

/**
 * @class A component which responds to mouse events and notifies
 * the host object when one of the events occurs.  The host object should implement
 * any of the five methods listed below to be notified of the corresponding event:
 * <ul>
 * <li>onMouseOver - The mouse moved over the host object, or the object moved under the mouse</li>
 * <li>onMouseOut - The mouse moved out of the host object (after being over it)</li>
 * <li>onMouseDown - A mouse button was depressed over the host object</li>
 * <li>onMouseUp - A mouse button was released over the host object</li>
 * <li>onMouseMove - The mouse was moved</li>
 * </ul>
 *
 * @extends InputComponent
 */
var MouseInputComponent = InputComponent.extend(/** @scope MouseInputComponent.prototype */{

   /**
    * Create an instance of a mouse input component.
    *
    * @param name {String} The unique name of the component.
    * @param priority {Number} The priority of the component among other input components.
    * @constructor
    */
   constructor: function(name, priority) {
      this.base(name, priority);

   },

   /**
    * Set the host object this component exists within.  Additionally, this component
    * sets some readable flags on the host object and establishes (if not already set)
    * a mouse listener on the render context.
    *
    * @param hostObject {HostObject} The object which hosts the component
    */
   setHostObject: function(hostObject) {
      this.base(hostObject);

      // Set some flags we can check
      this.getHostObject().MouseInputComponent_mouseOver = false;
      this.getHostObject().MouseInputComponent_mouseDown = false;

      // Assign handlers to the context, making sure to only add
      // one handler.  This way we don't have hundreds of mouse move
      // handlers taking up precious milliseconds
      var context = this.getHostObject().getRenderContext();
      if (!context.MouseInputComponent_mouseInfo)
      {
         context.MouseInputComponent_mouseInfo = {
            position: new Point2D(0,0),
            lastPosition: new Point2D(0,0),
            button: EventEngine.MOUSE_NO_BUTTON,
            lastOver: null
         };

         EventEngine.setHandler(context, {owner: this}, "mousemove", function(eventObj) {
            var mouseInfo = eventObj.data.owner.MouseInputComponent_mouseInfo;
            mouseInfo.position.set(event.pageX, event.pageY);
            mouseInfo.button = event.which || EventEngine.MOUSE_NO_BUTTON;
         });

         EventEngine.setHandler(context, {owner: this}, "mousedown", function(eventObj) {
            var mouseInfo = eventObj.data.owner.MouseInputComponent_mouseInfo;
            mouseInfo.button = event.which;
         });

         EventEngine.setHandler(context, {owner: this}, "mouseup", function(eventObj) {
            var mouseInfo = eventObj.data.owner.MouseInputComponent_mouseInfo;
            mouseInfo.button = EventEngine.MOUSE_NO_BUTTON;
         });

      }
   },

   /**
    * Perform the checks on the mouse info object, and also perform
    * intersection tests to be able to call mouse events.
    *
    * @private
    */
   execute: function(renderContext, time) {
      // Objects may be in motion.  If so, we need to call the mouse
      // methods for just such a case.
      var mouseInfo = this.getHostObject().getRenderContext().MouseInputComponent_mouseInfo;
      var bBox = this.getHostObject().getBoundingBox();
      var pos = this.getHostObject().getPosition();
      var mouseOver = false;
      if (this.getHostObject().onMouseOver ||
          this.getHostObject().onMouseOut ||
          this.getHostObject().onMouseDown ||
          this.getHostObject().onMouseUp)
      {
         mouseOver = Math2D.boxPointCollision(bBox, pos, mouseInfo.position);
      }

      // Mouse position changed
      if (this.getHostObject().onMouseMove && !mouseInfo.position.equals(mouseInfo.lastPosition))
      {
         this.getHostObject().onMouseMove(mouseInfo);
         mouseInfo.lastPosition.set(mouseInfo.position);
      }

      // Mouse is over object
      if (this.getHostObject().onMouseOver && mouseOver)
      {
         this.getHostObject().MouseInputComponent_mouseOver = true;
         this.getHostObject().onMouseOver(mouseInfo);
      }

      // Mouse was over object
      if (this.getHostObject().onMouseOut && !mouseOver &&
          this.getHostObject().MouseInputComponent_mouseOver == true)
      {
         this.getHostObject().MouseInputComponent_mouseOver = false;
         this.getHostObject().onMouseOut(mouseInfo);
      }

      // Mouse button clicked and mouse over object
      if (this.getHostObject().onMouseDown && mouseOver && (mouseInfo.button != EventEngine.MOUSE_NO_BUTTON))
      {
         this.getHostObject().MouseInputComponent_mouseDown = true;
         this.getHostObject().onMouseDown(mouseInfo);
      }

      // Mouse button released (and mouse was down over this object)
      if (this.getHostObject().onMouseUp && this.getHostObject().MouseInputComponent_mouseDown  &&
          (mouseInfo.button == EventEngine.MOUSE_NO_BUTTON))
      {
         this.getHostObject().MouseInputComponent_mouseDown = false;
         this.getHostObject().onMouseUp(mouseInfo);
      }
   }
}, {
   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf KeyboardInputComponent
    */
   getClassName: function() {
      return "MouseInputComponent";
   }
});

return MouseInputComponent;

});