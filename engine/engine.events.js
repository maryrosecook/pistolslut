/**
 * The Render Engine
 * Events
 *
 * @fileoverview Methods for handling events (adding & removing) and keycodes for
 * 				  keys like the arrows and function keys.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 642 $
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

Engine.initObject("EventEngine", null, function() {

/**
 * @class A static object for unformly handling events within all browser
 * 		 platforms.  The event engine is an abstraction of the jQuery event
 * 		 system.  Methods are provided for adding and removing events in
 * 		 a programmatic way.  Additionally the engine has key codes for
 * 		 common keys which aren't part of the letters or numbers.
 * 		 <p/>
 * 		 While the engine provides a low-level way to attach events, when
 * 		 working with game objects methods are provided to manage events
 * 		 better than with the engine itself.
 * 		 <p/>
 * 		 Adding an event:
 * <pre>
 * var t = $(".myElement");
 * EventEngine.setHandler(t, "click", function(event) {
 *    MyObject.evtHandler();
 * });
 * </pre>
 * @see BaseObject#addEvent
 * @see BaseObject#removeEvent
 */
var EventEngine = Base.extend(/** @scope EventEngine.prototype */{

   constructor: null,

   /**
    * Set an event handler on a target.  The handler function will
    * be called whenever the event occurs.
    *
    * @param target {String/jQuery} The target for the event.  This should either be a
    *                               CSS selector, or a jQuery object.
    * @param [data] {Array} Optional data to pass to the handler when it is invoked.
    * @param name {String} The event to handle.  ie: "click" or "mouseover"
    * @param handler {Function} The handler function to assign to the target
    */
   setHandler: function(target, data, name, handler) {
      if (typeof data == "string")
      {
         handler = name;
         name = data;
         data = null;
      }

      if (target == document.body) {
			target = document;
		}

      jQuery(target).bind(name, data || handler, handler);
   },

   /**
    * Clear an event handler that was previously assigned to the target.  If no
    * specific handler is assigned, all event handlers will be removed from the target.
    *
    * @param target {String/jQuery} The target for the event.  This should either be a
    *                               CSS selector, or a jQuery object.
    * @param name {String} The event to handle.  ie: "click" or "mouseover"
    * @param handler {Function} The handler function to unassign from the target
    */
   clearHandler: function(target, name, handler) {
      if (target == document.body) {
			target = document;
		}
      jQuery(target).unbind(name, handler);
   },


   //====================================================================================================================
   // MOUSE BUTTON CONSTANTS

   /** No mouse button pressed. */
   MOUSE_NO_BUTTON: 0,

   /** Left mouse button. */
   MOUSE_LEFT_BUTTON: 1,

   /** Right mouse button. */
   MOUSE_RIGHT_BUTTON: 3,

   /** Middle mouse button. */
   MOUSE_MIDDLE_BUTTON: 2,

   //====================================================================================================================
   // KEY CODE CONSTANTS

   /** Constant for the "Tab" key */
   KEYCODE_TAB: 9,

   /** Constant for the "Enter" key */
   KEYCODE_ENTER: 13,

   /** Constant for the "Delete" key */
   KEYCODE_DELETE: 46,

   /** Constant for the "Space" key */
   KEYCODE_SPACE: 32,

   /** Constant for the "Backspace" */
   KEYCODE_BACKSPACE: 8,

   /** Constant for the "Up" key  */
   KEYCODE_UP_ARROW: 38,

   /** Constant for the "Down" key */
   KEYCODE_DOWN_ARROW: 40,

   /** Constant for the "Left" key */
   KEYCODE_LEFT_ARROW: 37,

   /** Constant for the "RIGHT" key */
   KEYCODE_RIGHT_ARROW: 39,

   /** Constant for the "Plus" key */
   KEYCODE_KEYPAD_PLUS: 61,

   /** Constant for the "Minus" key */
   KEYCODE_KEYPAD_MINUS: 109,

   /** Constant for the "Home" key */
   KEYCODE_HOME: 36,

   /** Constant for the "End" key */
   KEYCODE_END: 35,

   /** Constant for the "F1" key */
   KEYCODE_F1: 112,

   /** Constant for the "F2" key */
   KEYCODE_F2: 113,

   /** Constant for the "F3" key */
   KEYCODE_F3: 114,

   /** Constant for the "F4" key */
   KEYCODE_F4: 115,

   /** Constant for the "F5" key */
   KEYCODE_F5: 116,

   /** Constant for the "F6" key */
   KEYCODE_F6: 117,

   /** Constant for the "F7" key */
   KEYCODE_F7: 118,

   /** Constant for the "F8" key */
   KEYCODE_F8: 119,

   /** Constant for the "F9" key */
   KEYCODE_F9: 120,

   /** Constant for the "F10" key */
   KEYCODE_F10: 121,

   /** Constant for the "F11" key */
   KEYCODE_F11: 122,

   /** Constant for the "F12" key */
   KEYCODE_F12: 123,

   /** Constant for the "Context Menu" key (Windows) */
   KEYCODE_MENU: 93,

   /** Constant for the "Windows" key (Windows) */
   KEYCODE_WINDOW: 91

});

return EventEngine;

});