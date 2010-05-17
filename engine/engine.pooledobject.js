/**
 * The Render Engine
 * BaseObject
 *
 * @fileoverview An object that has functionality to assist in keeping memory
 * 				  usage down and to minimize the effect of the Javascript garbage
 * 				  collector.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 779 $
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

Engine.initObject("PooledObject", null, function() {

/**
 * @class Pooled objects are created as needed, and reused from a static pool
 *        of all object types.  When an object is created, if one is not available
 *        in the pool, a new object is created.  When the object is destroyed,
 *        it is returned to the pool so it can be used again.  This has the
 *        effect of minimizing the requirement of garbage collection, reducing
 *        cycles needed to clean up dead objects.
 *
 */
var PooledObject = Base.extend(/** @scope PooledObject.prototype */{

   // The Id assigned by the engine
   id: -1,

   // The name of the object
   name: "",


   /**
    * Create an instance of this object, assigning a name to it.  An
    * object reference will be maintained by the {@link Engine} class,
    * which gives the object final responsibility for making sure the
    * object can be destroyed.
    *
    * @param name {String} The name of the object from which the Id will be generated.
    * @memberOf PooledObject
    * @constructor
    */
   constructor: function(name) {
      this.name = name;
      this.id = Engine.create(this);
   },

   /**
    * When a pooled object is destroyed, it will be released so it
    * can clean up variables before being put back into the pool.
    * the variables should be returned to an "uninitialized" state.
    * @memberOf PooledObject
    */
   release: function() {
      this.name = "";
      this.id = -1;
   },

   /**
    * Destroy this object instance (remove it from the Engine).  The object
    * is returned to the pool of objects so it can be used again.
    * @memberOf PooledObject
    */
   destroy: function() {

      PooledObject.returnToPool(this);

      // Clean up the engine reference to this object
      Engine.destroy(this);

      // Reset any variables on the object before putting
      // it back in the pool.
      this.release();
   },

   /**
    * Get the managed Id of this object within the Engine.
    *
    * @return This object's engine Id
    * @type String
    * @memberOf BaseObject
    * @memberOf BaseObject
    */
   getId: function() {
      return this.id;
   },

   /**
    * Get the original name this object was created with.
    *
    * @return The name used when creating this object
    * @type String
    * @memberOf BaseObject
    */
   getName: function() {
      return this.name;
   },

	/**
	 * Returns an object that assigns getter and setter methods
	 * for exposed properties of an object.
	 * @param {BaseObject} self The reference to the object being
	 * 					 inspected.
	 * @return {Object} An object which contains getter and setter methods.
	 */
	getProperties: function() {
		var self = this;
		var prop = {};
		return $.extend(prop, {
	  		"Id" 				: [function() { return self.getId(); },
							 		null, false],
	  		"ObjectName" 	: [function() { return self.getName(); },
							 		function(i) { self.setName(i); }, true]
		});
	},

   /**
    * Serialize the object to XML.
    * @type String
    */
   toString: function(indent) {
		indent = indent ? indent : "";
		var props = this.getProperties();
		var xml = indent + "<" + this.constructor.getClassName();
		for (var p in props) {
			// If the value should be serialized, call it's getter
			if (props[p][2]) {
				xml += " " + p + "=\"" + props[p][0]().toString() + "\"";
			}
		}

		xml += "/>\n";
		return xml;
   }

}, /** @scope PooledObject.prototype **/{

   /**
    * <tt>true</tt> for all objects within the engine.
    * @type Boolean
    */
   isRenderEngineObject: true,

   /**
    * <tt>true</tt> for all objects that are pooled.
    * @type Boolean
    */
   isPooledObject: true,

	/**
	 * Number of new objects put into the pool
	 * @type Number
	 */
   poolNew: 0,

	/**
	 * Total number of objects in the pool
	 * @type Number
	 */
   poolSize: 0,

   /**
    * Similar to a constructor, all pooled objects should implement
    * a create method which is used to either create a new instance of
    * the object, or retrieve one from the pool.
    * <p/>
    * Usage: <tt>var obj = [ObjectClass].create(arg1, arg2, arg3...);</tt>
    *
    * @memberOf PooledObject
    */
   create: function() {
      // Check the pool for the object type
      if (PooledObject.objectPool[this.getClassName()] && PooledObject.objectPool[this.getClassName()].length != 0) {
         PooledObject.poolSize--;
         Engine.addMetric("poolUse", Math.floor((PooledObject.poolSize / PooledObject.poolNew) * 100), false, "#%");
         var obj = PooledObject.objectPool[this.getClassName()].shift();
         obj.constructor.apply(obj, arguments);
         return obj;
      } else {
         PooledObject.poolNew++;
         Engine.addMetric("newObjs", PooledObject.poolNew, false, "#");
         // Any more than 10 arguments and we're pooched!
         return new this(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6],arguments[7],arguments[8],arguments[9]);
      }
   },

   /**
    * During object destruction, it needs to return itself to the
    * pool so it can be used again.  Instead of creating new instances
    * of each object, we utilize a pooled object so we don't need the
    * garbage collector to be invoked for removed objects.
    * @private
    */
   returnToPool: function(obj) {
      // If there is no pool for objects of this type, create one
      if (!PooledObject.objectPool[obj.constructor.getClassName()]) {
         PooledObject.objectPool[obj.constructor.getClassName()] = new Array;
      }

      // Push this object into the pool
      PooledObject.poolSize++;
      PooledObject.objectPool[obj.constructor.getClassName()].push(obj);
   },

   /**
    * The pool of all objects, stored by class name.
    * @type Object
    */
   objectPool: {},

   /**
    * Get the class name of this object
    *
    * @return {String}
    * @memberOf PooledObject
    */
   getClassName: function() {
      if (!this.hasOwnProperty("getClassName")) {
         Console.warn("Object is missing getClassName()");
      }
      return "PooledObject";
   }
});

return PooledObject;

});