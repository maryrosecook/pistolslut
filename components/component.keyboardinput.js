/**
 * The Render Engine
 * KeyboardInputComponent
 *
 * @fileoverview An extension of the input component for dealing with the
 *               keyboard.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 693 $
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

Engine.initObject("KeyboardInputComponent", "InputComponent", function() {

/**
 * @class A component which responds to keyboard events and notifies
 * its host object by calling one of three methods.  The host object
 * should implement any of the following methods to receive the corresponding event:
 * <ul>
 * <li>onKeyDown - A key was pressed down</li>
 * <li>onKeyUp - A key was released</li>
 * <li>onKeyPress - A key was pressed and released</li>
 * </ul>
 *
 * @extends InputComponent
 */
var KeyboardInputComponent = InputComponent.extend(/** @scope KeyboardInputComponent.prototype */{

   /**
    * Create an instance of a keyboard input component.
    *
    * @param name {String} The unique name of the component.
    * @param priority {Number} The priority of the component among other input components.
    * @constructor
    */
   constructor: function(name, priority) {
      this.base(name, priority);

      var ctx = Engine.getDefaultContext();
      var self = this;

      // Add the event handlers
      ctx.addEvent(this, "keydown", function(evt) {
         return self._keyDownListener(evt);
      });
      ctx.addEvent(this, "keyup", function(evt) {
         return self._keyUpListener(evt);
      });
      ctx.addEvent(this, "keypress", function(evt) {
         return self._keyPressListener(evt);
      });
   },

   /**
    * Destroy this instance and remove all references.
    */
   destroy: function() {
      var ctx = Engine.getDefaultContext();

      // Clean up event handlers
      ctx.removeEvent(this, "keydown");
      ctx.removeEvent(this, "keyup");
      ctx.removeEvent(this, "keypress");
      this.base();
   },

   /**
    * @private
    */
   _keyDownListener: function(eventObj) {
      if (this.getHostObject().onKeyDown)
      {
         return this.getHostObject().onKeyDown(eventObj);
      }
   },

   /**
    * @private
    */
   _keyUpListener: function(eventObj) {
      if (this.getHostObject().onKeyUp)
      {
         return this.getHostObject().onKeyUp(eventObj);
      }
   },

   /**
    * @private
    */
   _keyPressListener: function(eventObj) {
      if (this.getHostObject().onKeyPress)
      {
         return this.getHostObject().onKeyPress(eventObj);
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
      return "KeyboardInputComponent";
   }
});

return KeyboardInputComponent;

});