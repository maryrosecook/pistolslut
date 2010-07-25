/**
 * The Render Engine
 * ResourceLoader
 *
 * @fileoverview The base class for all resource loaders.  It has the functionality
 *               for managing a local cache of loaded objects.
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
Engine.include("/engine/engine.baseobject.js");

Engine.initObject("ResourceLoader", "BaseObject", function() {

/**
 * @class  A resource loader is a generalized interface used by all resource
 *         loaders.  It is designed to provide a common set of routines for
 *         loading resources (fonts, images, game data, etc...) from some
 *         location.
 *
 * @param [name=ResourceLoader] {String} The name of the resource loader.
 * @constructor
 * @extends BaseObject
 * @description Create a resource loader
 */
var ResourceLoader = BaseObject.extend(/** @scope ResourceLoader.prototype */{

   cache: null,

   length: 0,

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name || "ResourceLoader");
      this.cache = {};
   },

   /**
    * @private
    */
   release: function() {
      this.base();
      this.cache = null;
      this.length = 0;
   },

   /**
    * @private
    */
   destroy: function() {
      this.clear();
      this.base();
   },

   /**
    * Load an object via this resource loader, and add it to the cache.
    *
    * @param name {String} The name to refer to the loaded object
    * @param data {Object} The data to store in the cache
    * @param isReady {Boolean} A flag that states whether or not a resource
    *                          is ready to use.
    */
   load: function(name, data, isReady) {
      var obj = { data: data, ready: isReady || false};
      this.cache[name] = obj;
      this.length++;
      Console.log("Loading " + this.getResourceType() + ": " + name);
   },

   /**
    * Set the "ready" state of the resource.  When a resource has been completely
    * loaded, set the resource "ready" state to <tt>true</tt> to allow objects
    * waiting for those resources to utilize them.
    *
    * @param name {String} The name of the resource
    * @param isReady {Boolean} <tt>true</tt> to set the resource to "ready for use"
    */
   setReady: function(name, isReady) {
      this.cache[name].isReady = isReady;
      if (isReady) {
         Console.log(this.getResourceType() + " " + name + " ready...");
      }
   },

   /**
    * Check to see if a named resource is "ready for use".
    * @param name {String} The name of the resource to check ready status for,
    *             or <tt>null</tt> for all resources in loader.
    * @return {Boolean} <tt>true</tt> if the resource is loaded and ready to use
    */
   isReady: function(name) {
      if (name) {
         return this.cache[name] ? this.cache[name].isReady : false;
      } else {
         // Check the status of all loader elements
         var rList = this.getResources();
         if (rList.length == 0) {
            // Early out, no resources to load
            return true;
         }
         for (var r in rList) {
            if (!this.isReady(rList[r])) {
               return false;
            }
         }
         return true;
      }
   },

   /**
    * Unload an object from this resource loader.  Removes the object
    * from the cache.
    *
    * @param name {String} The name of the object to remove
    */
   unload: function(name) {
      if (this.cache[name].data.destroy) {
         // Make sure that cached objects have a chance to clean up
         this.cache[name].data.destroy();
      }

      this.cache[name] = null;
      delete this.cache[name];
      this.length--;
   },

   /**
    * Get the object with the specified name from the cache.
    *
    * @param name {String} The name of the object to retrieve
    * @return {Object} The object stored within the cache
    */
   get: function(name) {
      if (this.cache[name]) {
         return this.cache[name].data;
      } else {
         return null;
      }
   },
   
   /**
    * Set the data associated with the name.  The ready state is set
    * to <tt>false</tt>, so it will be up to the developer to call
    * {@link #setReady} on the object if the object is truly ready for use.
    * @param name {String} The name of the cache record
    * @param data {Object} Data to store
    */
   set: function(name, data) {
      var obj = { data: data, ready: false};
      this.cache[name] = obj;
   },

   /**
    * Returns the cache.  You should not manipulate the cache directly.
    * instead, call methods to update the cache.
    * @return {Object} The cache
    */
   getCachedObjects: function() {
      return this.cache;
   },

   /**
    * Clear the objects contained in the cache.
    */
   clear: function() {
      for (var o in this.cache) {
         this.cache[o] = null;
      }

      this.cache = {};
      this.length = 0;
   },

   /**
    * Get the names of all the resources available in this resource loader.
    * @return {Array} An array of resource names
    */
   getResources: function() {
      var n = [];
      for (var i in this.cache) {
         n.push(i);
      }
      return n;
   },

   /**
    * The name of the resource this loader will get.
    * @return {String} The string "default"
    */
   getResourceType: function() {
      return "default";
   }
}, /** @scope ResourceLoader.prototype */{ 

   /**
    * Get the class name of this object
    * @return {String} "ResourceLoader"
    */
   getClassName: function() {
      return "ResourceLoader";
   }

});

return ResourceLoader;

});
