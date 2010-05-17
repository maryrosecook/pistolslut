/**
 * The Render Engine
 *
 * @fileoverview A set of objects which can be used to create a collection
 *               of objects, and to iterate over a container.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 781 $
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
Engine.include("/engine/engine.pooledobject.js");
Engine.include("/engine/engine.baseobject.js");

Engine.initObject("Iterator", "PooledObject", function() {

/**
 * @class Create an iterator over a {@link Container} instance. An
 * iterator is a convenient object to traverse the list of elements
 * within the container.  The simplest way to traverse the list is
 * as follows:
 * <pre>
 * var itr = Iterator.create(containerObj);
 * while (itr.hasNext()) {
 *    // Get the next object in the container
 *    var o = itr.next();
 *    
 *    // Do something with the object
 *    o.doSomething();
 * }
 * 
 * // Destroy the container when done
 * itr.destroy();
 * </pre>
 * The last step is important so that you're not creating a lot
 * of objects, especially if the iterator is used repeatedly.
 * Since the iterator is a pooled object, it will be reused.
 *
 * @param container {Container} The container to iterate over.
 */
var Iterator = PooledObject.extend(/** @scope Iterator.prototype */{

   idx: 0,

   c: null,

   objs: null,

   /**
    * @constructor
    * @param container {Container} The container to iterate over
    */
   constructor: function(container) {
      this.base("Iterator");
      this.idx = 0;
      this.c = container;

      // Duplicate the elements in the container
      this.objs = new Array().concat(container.getObjects());
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.idx = 0;
      this.c = null;
      this.objs = null;
   },

   /**
    * Reverse the order of the elements in the container (non-destructive) before
    * iterating over them.  You cannot call this method after you have called {@link #next}.
    */
   reverse: function() {
      Assert(this.idx == 0, "Cannot reverse Iterator after calling next()");
      this.objs.reverse();
   },

   /**
    * Get the next element from the iterator.
    * @return {Object} The next element in the iterator
    * @throws {Error} An error if called when no more elements are available
    */
   next: function() {
      if (this.idx < this.c.size())
      {
         return this.objs[this.idx++];
      }
      throw new Error("Index out of range");
   },

   /**
    * Returns <tt>true</tt> if the iterator has more elements.
    * @return {Boolean}
    */
   hasNext: function() {
      return (this.idx < this.c.size());
   }

}, { /** @scope Iterator.prototype */
   /**
    * Get the class name of this object
    *
    * @return {String} The string "Iterator"
    */
   getClassName: function() {
      return "Iterator";
   }
});

return Iterator;

});

Engine.initObject("Container", "BaseObject", function() {

/**
 * @class A container is a logical collection of objects.  A container
 *        is responsible for maintaining the list of objects within it.
 *        When a container is destroyed, all objects within the container
 *        are destroyed with it.
 *
 * @extends BaseObject
 */
var Container = BaseObject.extend(/** @scope Container.prototype */{

   objects: null,

   /**
    * @constructor
    * @param containerName {String} The name of the container
    */
   constructor: function(containerName) {
      this.base(containerName || "Container");
      this.objects = [];
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.objects = null;
   },

   /**
    * Destroy all objects contained within this object.  Calls the
    * <tt>destroy()</tt> method on each object, giving them a chance
    * to perform clean up operations.
    */
   destroy: function() {
      this.cleanUp();
      this.base();
   },

   /**
    * Returns the count of the number of objects within the
    * container.
    *
    * @return {Number} The number of objects in the container
    */
   size: function() {
      return this.objects.length;
   },

   /**
    * Add an object to the container.
    *
    * @param obj {Object} The object to add to the container.
    */
   add: function(obj) {
      this.objects.push(obj);
      if (obj.getId) {
         Console.log("Added ", obj.getId(), "[", obj, "] to ", this.getId(), "[", this, "]");
      }
   },

	/**
	 * Insert an object into the container at the given index. Asserts if the
	 * index is out of bounds for the container.  The index must be greater than
	 * or equal to zero, and less than or equal to the size of the container minus one.
	 * 
	 * @param index {Number} The index to insert the object at.
	 * @param obj {Object} The object to insert into the container
	 */
	insert: function(index, obj) {
		Assert(!(index < 0 || index > this.objects.length - 1), "Index out of range when inserting object!");
		this.objects.splice(index, 0, obj);
	},
	
	/**
	 * Replaces the given object with the new object.  If the old object is
	 * not found, no action is performed.
	 * 
	 * @param oldObj {Object} The object to replace
	 * @param newObj {Object} The object to put in place
	 */
	replace: function(oldObj, newObj) {
		this.replaceAt(EngineSupport.indexOf(this.objects, oldObj), newObj);		
	},
	
	/**
	 * Replaces the object at the given index, returning the object that was there
	 * previously. Asserts if the index is out of bounds for the container.  The index 
	 * must be greater than or equal to zero, and less than or equal to the size of the 
	 * container minus one.
	 * 
	 * @param index {Number} The index at which to replace the object
	 * @param obj {Object} The object to put in place
	 * @return {Object} The object which was replaced
	 */
	replaceAt: function(index, obj) {
		Assert(!(index < 0 || index > this.objects.length - 1), "Index out of range when inserting object!");
		return this.objects.splice(index, 1, obj);		
	},
	
   /**
    * Remove an object from the container.  The object is
    * not destroyed when it is removed from the container.
    *
    * @param obj {Object} The object to remove from the container.
    */
   remove: function(obj) {
      if (obj.getId) {
         Console.log("Removed ", obj.getId(), "[", obj, "] from ", this.getId(), "[", this, "]");
      }
      EngineSupport.arrayRemove(this.objects, obj);
   },

   /**
    * Remove an object from the container at the specified index.
    * The object is not destroyed when it is removed.
    *
    * @param idx {Number} An index between zero and the size of the container minus 1.
    * @return {Object} The object removed from the container.
    */
   removeAtIndex: function(idx) {
      Assert((idx >= 0 && idx < this.size()), "Index of out range in Container");

      var obj = this.objects[idx];

      Console.log("Removed ", obj.getId(), "[", obj, "] from ", this.getId(), "[", this, "]");
      this.objects.splice(idx, 1);

      return obj;
   },

   /**
    * Get the object at the index specified. If the container has been
    * sorted, objects might not be in the position you'd expect.
    *
    * @param idx {Number} The index of the object to get
    * @return {Object} The object at the index within the container
    * @throws {Error} Index out of bounds if the index is out of the list of objects
    */
   get: function(idx) {
      if (idx < 0 || idx > this.size()) {
         throw new Error("Index out of bounds");
      }
      
      return this.objects[idx];
   },

   /**
    * Remove all objects from the container.  None of the objects are
    * destroyed, only removed from this container.
    */
   clear: function() {
      this.objects.length = 0;
      this.objects = [];
   },

   /**
    * Remove and destroy all objects from the container.
    */
   cleanUp: function() {
      while(this.objects.length > 0)
      {
         var o = this.objects.shift();
         o.destroy();
      }
      this.clear();
   },

   /**
    * Get the array of all objects within this container.  If a filtering
    * function is provided, only objects matching the filter will be
    * returned from the object collection.
    * <p/>
    * The filter function needs to return <tt>true</tt> for each element
    * that should be contained in the filtered set.  The function will be
    * passed the following arguments:
    * <ul>
    * <li>element - The array element being operated upon</li>
    * <li>index - The index of the element in the array</li>
    * <li>array - The entire array of elements in the container</li>
    * </ul>
    * Say you wanted to filter a host objects components based on a
    * particular type.  You might do something like the following:
    * <pre>
    * var logicComponents = host.getObjects(function(el, idx) {
    *    if (el.getType() == BaseComponent.TYPE_LOGIC) {
    *       return true;
    *    }
    * });
    * </pre>
    *
    * @param filterFn {Function} A function to filter the set of
    *                 elements with.  If you pass <tt>null</tt> the
    *                 entire set of objects will be returned.
    * @return {Array} The array of filtered objects
    */
   getObjects: function(filterFn) {
      if (filterFn) {
         return EngineSupport.filter(this.objects, filterFn);
      } else {
         return this.objects;
      }
   },

   /**
    * Sort the objects within the container, using the provided function.
    * The function will be provided object A and B.  If the result of the
    * function is less than zero, A will be sorted before B.  If the result is zero,
    * A and B retain their order.  If the result is greater than zero, A will
    * be sorted after B.
    *
    * @param fn {Function} The function to sort with.
    */
   sort: function(fn) {
      Assert((fn != null), "A function must be provided to sort the Container");
      Console.log("Sorting ", this.getName(), "[" + this.getId() + "]");
      this.objects.sort(fn);
   },

   /**
    * Returns a property object with accessor methods.
    * @return {Object} The properties object
    */
   getProperties: function() {
      var self = this;
      var prop = this.base(self);
      return $.extend(prop, {
         "Contains"  : [function() { return self.objects.length; },
                        null, false]
      });
   },

   /**
    * Serializes a container to XML.
    * @return {String} The XML string
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
      xml += ">\n";

      // Dump children
      for (var o in this.objects) {
         xml += this.objects[o].toString(indent + "   ");
      }

      // Closing tag
      xml += indent + "</" + this.constructor.getClassName() + ">\n";
      return xml;
   }

}, /** @scope Container.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} The string "Container"
    */
   getClassName: function() {
      return "Container";
   }
});

return Container;

});

Engine.initObject("HashContainer", "Container", function() {

/**
 * @class A hash container is a logical collection of objects.  A hash container
 *        is a container with a backing object for faster lookups.  Objects within
 *        the container must have unique names. When a container is destroyed, all
 *        objects within the container are destroyed with it.
 * @extends Container
 */
var HashContainer = Container.extend(/** @scope HashContainer.prototype */{

   objHash: null,

   /**
    * Create an instance of a container object.
    *
    * @param containerName {String} The name of the container. Default: Container
    * @constructor
    */
   constructor: function(containerName) {
      this.base(containerName || "HashContainer");
      this.objHash = {};
   },

   /**
    * Release the object back into the object pool.
    */
   release: function() {
      this.base();
      this.objHash = null;
   },

   /**
    * Returns <tt>true</tt> if the object name is already in
    * the hash.
    *
    * @param name {String} The name of the hash to check
    * @return {Boolean}
    */
   isInHash: function(key) {
      return (this.objHash["_" + String(key)] != null);
   },

   /**
    * Add an object to the container.
    *
    * @param key {String} The name of the object to store.  Names must be unique
    *                      or the object with that name will be overwritten.
    * @param obj {BaseObject} The object to add to the container.
    */
   add: function(key, obj) {
      AssertWarn(!this.isInHash(key), "Object already exists within hash!");

      if (this.isInHash(key)) {
         // Remove the old one first
         this.removeHash(key);
      }

      // Some keys weren't being accepted (like "MOVE") so added
      // an underscore to prevent keyword collisions
      this.objHash["_" + String(key)] = obj;
      this.base(obj);
   },

   /**
    * Remove an object from the container.  The object is
    * not destroyed when it is removed from the container.
    *
    * @param obj {BaseObject} The object to remove from the container.
    */
   remove: function(obj) {
      for (var o in this.objHash)
      {
         if (this.objHash[o] === obj)
         {
            this.removeHash(o);
            break;
         }
      }

      this.base(obj);
   },

   /**
    * Remove the object with the given key name from the container.
    *
    * @param name {String} The object to remove
    * @return {Object} The object removed
    */
   removeHash: function(key) {
      var obj = this.objHash["_" + String(key)];
      EngineSupport.arrayRemove(this.objects, this.objHash["_" + String(key)]);
      delete this.objHash["_" + String(key)];
      return obj;
   },

   /**
    * Remove an object from the container at the specified index.
    * The object is not destroyed when it is removed.
    *
    * @param idx {Number} An index between zero and the size of the container minus 1.
    * @return {Object} The object removed from the container.
    */
   removeAtIndex: function(idx) {
      var obj = this.base(idx);
      for (var o in this.objHash) {
         if (this.objHash[o] === obj) {
            this.removeHash(o);
            break;
         }
      }

      return obj;
   },

   /**
    * If a number is provided, the request will be passed to the
    * base object, otherwise a name is assumed and the hash will
    * be retrieved.
    *
    * @param idx {Number/String} The index or hash of the object to get
    * @return {Object}
    */
   get: function(idx) {
      if (typeof idx == 'string')
      {
         return this.objHash["_" + String(idx)];
      }
      else
      {
         return this.base(idx);
      }
   },

   /**
    * Remove all objects from the container.  None of the objects are
    * destroyed.
    */
   clear: function() {
      this.base();
      this.objHash = {};
   },

   /**
    * Cleans up the references to the objects (destroys them) within
    * the container.
    */
   cleanUp: function() {
      this.base();
      this.clear();
   }

}, /** @scope HashContainer.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} The string "HashContainer"
    */
   getClassName: function() {
      return "HashContainer";
   }
});

return HashContainer;

});
