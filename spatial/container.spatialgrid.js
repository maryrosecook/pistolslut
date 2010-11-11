/**
 * The Render Engine
 * SpatialGrid
 *
 * @fileoverview A simple collision model which divides a finite space up into 
 *               a coarse grid to assist in quickly finding objects within that
 *               space.
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
Engine.include("/engine/engine.spatialcontainer.js");
Engine.include("/engine/engine.math2d.js");

Engine.initObject("GridNode", "SpatialNode", function() {

/**
 * @class A single node within a SpatialGrid.  When the collision model is
 *        updated, the nodes within the grid will be updated to reflect the
 *        objects within it.  A node defines a single rectangle within the
 *        entire {@link SpatialGrid}
 *
 * @extends SpatialNode
 * @constructor
 * @description Create an instance of a SpatialNode for use within a {@link SpatialGrid}
 * @param rect {Rectangle2D} The rectangle which defines this node.
 */
var GridNode = SpatialNode.extend(/** @scope GridNode.prototype */{

   rect: null,

   /**
    * @private
    */
   constructor: function(rect) {
      this.base();
      this.rect = rect;
   },

   /**
    * Get the rectangle which defines this node.
    * @return {Rectangle2D}
    */
   getRect: function() {
      return this.rect
   },

   /**
    * Get the class name of this object
    *
    * @return {String} "GridNode"
    */
   getClassName: function() {
      return "GridNode";
   }

});

return GridNode;

});

Engine.initObject("SpatialGrid", "SpatialContainer", function() {

/**
 * @class A structure which divides a finite space up into a more
 *        coarse grid to assist in quickly finding objects within that
 *        space.
 *
 * @constructor
 * @description Create an instance of a spatial grid model
 * @param width {Number} The width of the area
 * @param height {Number} The height of the area
 * @param divisions {Number} The number of divisions along both axis
 * @extends SpatialContainer
 */
var SpatialGrid = SpatialContainer.extend(/** @scope SpatialGrid.prototype */{

   divisions: 1,

   xLocator: 1,
   yLocator: 1,
   
   accuracy: 1,

   /**
    * @private
    */
   constructor: function(width, height, divisions) {
      this.base("SpatialGrid", width, height);

      // Divide the space up into a grid
      var gX = Math.floor(width / divisions);
      var gY = Math.floor(height / divisions);
      this.divisions = divisions;
      this.xLocator = 1 / gX;
      this.yLocator = 1 / gY;

      var grid = [];
      this.setRoot(grid);

      for (var y = 0; y < this.divisions; y++)
      {
         for (var x = 0; x < this.divisions; x++)
         {
            var rect = new Rectangle2D(x * gX, y * gY, gX, gY);
            grid[x + (y * this.divisions)] = new GridNode(rect);
         }
      }
   },

   /**
    * Releases the object back into the object pool.  See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.divisions = 1;
      this.xLocator = 1;
      this.yLocator = 1;
   },

   /**
    * Set the accuracy of the collision checks to either {@link SpatialGrid#GOOD_ACCURACY} or
    * {@link SpatialGrid#BEST_ACCURACY}.
    * 
    * @param accuracy {Number} The level of accuracy during PCL generation
    */
   setAccuracy: function(accuracy) {
      this.accuracy = (accuracy > SpatialGrid.BEST_ACCURACY || accuracy < SpatialGrid.GOOD_ACCURACY) ? 
         SpatialGrid.BEST_ACCURACY : accuracy;
   },
   
   /**
    * Get the accuracy level of collision checks.
    * @return {Number} The accuracy level
    */
   getAccuracy: function() {
      return this.accuracy;
   },

   /**
    * Find the node that contains the specified point.
    *
    * @param point {Point2D} The point to locate the node for
    * @return {SpatialNode}
    */
   findNodePoint: function(point) {
      return this.getRoot()[Math.floor(point.x * this.xLocator) + (Math.floor(point.y * this.yLocator) * this.divisions)];
   },

   /**
    * Get the node within the grid.
    * @param x {Number} The virtual X coordinate in our grid
    * @param y {Number} The virtual Y coordinate in our grid
    * @return {Number}
    * @private
    */
   getNode: function(x, y) {
      return this.getRoot()[x + (y * this.divisions)];
   },

   /**
    * Get the list of objects with respect to the point given.  Objects will
    * be returned from the cross that makes up the grid node containing
    * the point, and the four adjacent points.  For example, if you had a
    * 3x3 grid with the object in the center node, the nodes marked with
    * asterisks below would be included in the result set:
    * <pre>
    *  +---+---+---+
    *  |   | * |   |
    *  +---+---+---+
    *  | * | * | * |
    *  +---+---+---+
    *  |   | * |   |
    *  +---+---+---+
    * </pre>
    *
    * @param point {Point2D} The point to begin the search at.
    * @return {Array} An array of objects found within the cross
    */
   getPCL: function(point) {

      // The origin node
      var x = Math.floor(point.x * this.xLocator);
      var y = Math.floor(point.y * this.yLocator);

      // build the node set
      var nodes = [];
      nodes.push(this.getNode(x, y));
     
      // if our borders cross the margin, we can drop up to two nodes
      if (this.accuracy == SpatialGrid.BEST_ACCURACY) {
         if (x > 0) { nodes.push(this.getNode(x - 1, y)); }
         if (x < this.divisions) { nodes.push(this.getNode(x + 1, y)); }
         if (y > 0) { nodes.push(this.getNode(x, y - 1)); }
         if (y < this.divisions) { nodes.push(this.getNode(x, y + 1)); }
      }

      var o = [];
      if (nodes.length > 0)
      {
         for (var n = 0; n < nodes.length; n++)
         {
            if (nodes[n])
            {
               o = o.concat(nodes[n].getObjects());
            }
         }
      }

      return o;
   },
   
   /**
    * Returns all objects within every node of the spatial grid.
    * @return {Array} An array of all objects in the spatial grid
    */
   getObjects: function() {
      var objs = [];
      EngineSupport.forEach(this.getRoot(), function(node) {
         objs = objs.concat(node.getObjects());
      });
      return objs;
   }

}, /** @scope SpatialGrid.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "SpatialGrid"
    */
   getClassName: function() {
      return "SpatialGrid";
   },
   
   /**
    * Collision checks are limited to the exact node where the
    * object being tested resides.
    * @type {Number}
    */
   GOOD_ACCURACY: 0,
   
   /**
    * Collision checks are performed in the node where the object
    * being tested resides, and in the four surrounding polar nodes.
    * @type {Number}
    */
   BEST_ACCURACY: 1
});

return SpatialGrid;

});