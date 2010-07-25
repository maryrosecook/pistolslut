/**
 * The Render Engine
 * SpatialContainer
 *
 * @fileoverview Spatial containers maintain a collection of objects and can report
 *               on potential objects within a defined space of that container.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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
Engine.include("/engine/engine.container.js");

/**
 * An index assigned to a node.
 * @private
 */
Engine.NodeIndex = 1;

Engine.initObject("SpatialNode", null, function() {

/**
 * @class A single node within a spatial container.  Has an index for fast node
 *        comparisons, and a list of objects contained within the node.
 *
 * @constructor
 * @description Creates a spatial node
 */
var SpatialNode = Base.extend(/** @scope SpatialNode.prototype */{

   idx: 0,

   objects: null,

   /**
    * @private
    */
   constructor: function() {
      this.idx = Engine.NodeIndex++;
      this.objects = [];
   },

   /**
    * Get the unique index of this node.
    * @return {Number} The index of this node
    */
   getIndex: function() {
      return this.idx;
   },

   /**
    * Get an array of objects within this node.
    * @return {BaseObject[]} Objects in the node
    */
   getObjects: function() {
      return this.objects;
   },

   /**
    * Add an object to this node.
    *
    * @param obj {BaseObject} The object to add to this node.
    */
   addObject: function(objId) {
      this.objects.push(objId);
   },

   /**
    * Remove an object from this node
    *
    * @param obj {BaseObject} The object to remove from this node
    */
   removeObject: function(obj) {
      EngineSupport.arrayRemove(this.objects, obj);
   }
}, /** @scope SpatialNode.prototype */{ 

   /**
    * Get the class name of this object
    *
    * @return {String} "SpatialNode"
    */
   getClassName: function() {
      return "SpatialNode";
   }

});

return SpatialNode;

});

Engine.initObject("SpatialContainer", "BaseObject", function() {

/**
 * @class An abstract class to represent spatial containers.  Spatial containers
 *        contain game-world objects and can report on potential objects within a defined
 *        space of that container.
 *
 * @param name {String} The name of the container
 * @param width {Number} The width of the container
 * @param height {Number} The height of the container
 * @extends BaseObject
 * @constructor
 * @description Create a spatial container
 */
var SpatialContainer = BaseObject.extend(/** @scope SpatialContainer.prototype */{

   root: null,

   width: 0,

   height: 0,

   /**
    * @private
    */
   constructor: function(name, width, height) {
      this.base(name || "SpatialContainer");
      this.width = width;
      this.height = height;
   },

   /**
    * @private
    */
   release: function() {
      this.base();
      this.root = null;
      this.width = 0;
      this.height = 0;
   },

   /**
    * Get the width of the container.
    * @return {Number} The width
    */
   getWidth: function() {
      return this.width;
   },

   /**
    * Get the height of the container.
    * @return {Number} The height
    */
   getHeight: function() {
      return this.height;
   },

   /**
    * Get the root of the container.
    * @return {Object} The root
    */
   getRoot: function() {
      return this.root;
   },

   /**
    * Set the root of the container.
    *
    * @param root {Object} The root object of this container
    */
   setRoot: function(root) {
      this.root = root;
   },

   /**
    * Returns a potential collision list of objects that are contained
    * within the defined sub-space of the container.
    *
    * @param point {Point2D} The point to build with
    * @return {HashContainer} The PCL
    */
   getPCL: function(point) {
      return new HashContainer();
   },

   /**
    * Returns all objects within the spatial container.
    * @return {Array} An array of all objects in the container
    */
   getObjects: function() {
      return [];
   },
   
   /**
    * Returns all objects within the spatial container of a particular
    * class type.
    * @return {Array} An array of objects in the container, filtered by class
    */
   getObjectsOfType: function(clazz) {
      return EngineSupport.filter(this.getObjects(), function(obj) {
         return clazz.isInstance(obj);
      }, this);
   }

}, /** @scope SpatialContainer.prototype */{ 
   /**
    * Get the class name of this object
    *
    * @return {String} "SpatialContainer"
    */
   getClassName: function() {
      return "SpatialContainer";
   }

});

return SpatialContainer;

});