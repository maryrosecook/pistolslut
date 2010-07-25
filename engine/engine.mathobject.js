/**
 * The Render Engine
 * MathObject
 *
 * @fileoverview The object from which all math objects will be derived.
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
Engine.include("/engine/engine.pooledobject.js");

Engine.initObject("MathObject", "PooledObject", function() {

/**
 * @class The base object class which represents a math object within
 * the engine.  All math objects should extend from this class mainly due to
 * the fact that the engine can switch between pooling the object and running
 * transiently.
 * <p/>
 * Google's Chrome browser seems to operate better with transient objects while
 * other browsers appear to run better with pooled objects.
 * <p/>
 * 
 * @param name {String} The name of the object
 * @extends PooledObject
 * @constructor
 * @description Create a math object. 
 */
var MathObject = PooledObject.extend(/** @scope MathObject.prototype */{

   constructor: function(name) {
      if (!MathObject.isTransient) {
         this.base(name);
      }
   },

   /**
    * Destroy this object instance (remove it from the Engine).  The object's release
    * method is called after destruction so it will be returned to the pool of objects 
    * to be used again.
    */
   destroy: function() {
      if (!MathObject.isTransient) {
         this.base();
      }
   }

 }, /** @scope BaseObject.prototype */{

   /**
    * Similar to a constructor, all pooled objects implement this method.
    * The <tt>create()</tt> method will either create a new instance, if no object of the object's
    * class exists within the pool, or will reuse an existing pooled instance of
    * the object.  Either way, the constructor for the object instance is called so that
    * instance creation can be maintained in the constructor.
    * <p/>
    * Usage: <tt>var obj = [ObjectClass].create(arg1, arg2, arg3...);</tt>
    *
    * @memberOf PooledObject
    */
   create: function() {
      if (MathObject.isTransient) {
         return new this(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],
                         arguments[5],arguments[6],arguments[7],arguments[8],arguments[9],
                         arguments[10],arguments[11],arguments[12],arguments[13],arguments[14]);
      } else {
         return PooledObject.create.apply(this, arguments);
      }
   },

   /**
    * Get the class name of this object
    *
    * @return {String} "BaseObject"
    */
   getClassName: function() {
      return "MathObject";
   },
   
   // Transient math objects aren't pooled
   isTransient: false

});

// On certain browsers, we want to let math objects die and not pool them
switch (EngineSupport.sysInfo().browser) {
   case "chrome" : MathObject.isTransient = true;
                   break;
   case "mozilla" : if (EngineSupport.sysInfo().version.indexOf("1.9") == 0) MathObject.isTransient = true;
                   break;
}

return MathObject;

});
