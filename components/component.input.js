/**
 * The Render Engine
 * InputComponent
 *
 * @fileoverview The base input component.
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
Engine.include("/components/component.base.js");

Engine.initObject("InputComponent", "BaseComponent", function() {

/**
 * @class A component which can read an input device and make those inputs
 * available for usage.
 * @extends BaseComponent
 */
var InputComponent = BaseComponent.extend(/** @scope InputComponent.prototype */{

   /**
    * @constructor
    * @memberOf InputComponent
    */
   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_INPUT, priority || 1.0);
   }
}, {
   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf InputComponent
    */
   getClassName: function() {
      return "InputComponent";
   }
});

return InputComponent;

});