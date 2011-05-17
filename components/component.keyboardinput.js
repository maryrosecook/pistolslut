/**
 * The Render Engine
 * KeyboardInputComponent
 *
 * @fileoverview An extension of the input component for dealing with the
 *               keyboard.
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
 * Each function should take up to six arguments.  The first argument is the character
 * code, a number which represents the key that was pressed. The second argument is the
 * <tt>keyCode</tt>, a number which represents special keys that were pressed, such as
 * the arrow keys and function keys.  See the
 * {@link EventEngine} for key codes of the non-alphabetic keys. The third argument
 * is a boolean indicating if the Control key was pressed.  The fourth argument is a
 * boolean indicating if the Alt key was pressed.  The fifth argument is a boolean
 * indicating if the Shift key was pressed.  The sixth and final argument is the
 * actual event object itself.
 *
 * @param name {String} The unique name of the component.
 * @param priority {Number} The priority of the component among other input components.
 * @extends InputComponent
 * @constructor
 * @description Create an instance of a keyboard input component. 
 */
var KeyboardInputComponent = InputComponent.extend(/** @scope KeyboardInputComponent.prototype */{

   /**
    * @private
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
    * @private
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
	playEvent: function(e) {
		var evt = document.createEvent("KeyboardEvent");
		evt.initKeyEvent(e.type, true, false, null, e.ctrlKey, false, e.shiftKey, false, e.keyCode, 0);
		this.getHostObject().getRenderContext().getSurface().dispatchEvent(evt);
	},

   /**
    * @private
    */
   _keyDownListener: function(eventObj) {
      if (this.getHostObject().onKeyDown) {
			this.record(eventObj,KeyboardInputComponent.RECORD_PART);
         return this.getHostObject().onKeyDown(eventObj.which, eventObj.keyCode, eventObj.ctrlKey, eventObj.altKey, eventObj.shiftKey, eventObj);
      }
   },

   /**
    * @private
    */
   _keyUpListener: function(eventObj) {
      if (this.getHostObject().onKeyUp) {
			this.record(eventObj,KeyboardInputComponent.RECORD_PART);
         return this.getHostObject().onKeyUp(eventObj.which, eventObj.keyCode, eventObj.ctrlKey, eventObj.altKey, eventObj.shiftKey, eventObj);
      }
   },

   /**
    * @private
    */
   _keyPressListener: function(eventObj) {
      if (this.getHostObject().onKeyPress) {
			this.record(eventObj,KeyboardInputComponent.RECORD_PART);
         return this.getHostObject().onKeyPress(eventObj.which, eventObj.keyCode, eventObj.ctrlKey, eventObj.altKey, eventObj.shiftKey, eventObj);
      }
   }

}, /** @scope KeyboardInputComponent.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "KeyboardInputComponent"
    */
   getClassName: function() {
      return "KeyboardInputComponent";
   },
	
	RECORD_PART: ["shiftKey","ctrlKey","altKey","keyCode"]
});

return KeyboardInputComponent;

});
