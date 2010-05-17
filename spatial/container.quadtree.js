/**
 * The Render Engine
 * Quadtree
 *
 * @fileoverview A generalized representation of a spatial quadtree.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
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
Engine.include("/engine/engine.spatialcontainer.js");

Engine.initObject("QuadtreeNode", "SpatialNode", function() {

/**
 * @class A single node within a quadtree.  Contains references to sub-nodes.
 *
 * @param rect {Rectangle2D} The rectangle which defines the area of this node
 * @extends SpatialNode
 */
var QuadtreeNode = SpatialNode.extend(/** @scope QuadtreeNode.prototype */{

   rect: null,

   quads: null,

   constructor: function(rect)
   {
      this.base();
      this.rect = rect;
      this.quads = [null, null, null, null];
   },

   /**
    * Get the rectangle which defines this node.
    * @type Rectangle2D
    */
   getRect: function() {
      return this.rect
   },

   /**
    * Get the array of quads within this node.
    * @type Array
    */
   getQuads: function() {
      return this.quads;
   },

   /**
    * Get the class name of this object
    *
    * @type String
    * @memberOf Container
    */
   getClassName: function() {
      return "QuadtreeNode";
   }

});

return QuadtreeNode;

});

Engine.initObject("Quadtree", "SpatialContainer", function() {

/**
 * @class A quadtree which divides up a space into smaller and smaller
 *        divisions to quickly locate objects within that space.
 *
 * @param width {Number} The width of the area
 * @param height {Number} The height of the area
 * @param divisions {Number} The number of divisions determines the smallest node size
 * @extends SpatialContainer
 */
var Quadtree = SpatialContainer.extend(/** @scope QuadTree.prototype */{

   /*
    * Build a quadtree which can be used to quickly locate objects
    * within a defined space.
    */
   constructor: function(width, height, divisions) {

      this.base("QuadTree", width, height);
      var smWidth = Math.floor(width / divisions);

      function subdivNode(node, rect) {
         var hW = Math.floor(width / 2);
         var hH = Math.floor(height / 2);

         if (hW < smWidth)
         {
            return;
         }

         // This node
         node = new QuadtreeNode(rect);
         var curTopLeft = rect.getTopLeft();

         // Top-left
         var n;
         var r = new Rectangle2D(curTopLeft.x, curTopLeft.y, hW, hH);
         node.getQuads()[0] = subdivNode({}, r);

         // Top-right
         r = new Rectangle2D(curTopLeft.x + hW, curTopLeft.y, hW, hH);
         node.getQuads()[1] = subdivNode({}, r);

         // Bottom-left
         r = new Rectangle2D(curTopLeft.x, curTopLeft.y + hH, hW, hH);
         node.getQuads()[2] = subdivNode({}, r);

         // Bottom-right
         r = new Rectangle2D(curTopLeft.x + hW, curTopLeft.y + hH, hW, hH);
         node.getQuads()[3] = subdivNode({}, r);

         return node;
      }

      // Build the spatial quadtree
      subdivNode(this.getRoot(), new Rectangle2D(0, 0, width, height));
   },

   /**
    * Find the quadtree node which contains the point specified.
    *
    * @param point {Point2D} The point to locate
    * @param node {QuadtreeNode} The node to start the search at
    * @type QuadtreeNode
    */
   findNodePoint: function(point, node) {
      var fNode = node;
      if (node.rect.containsPoint(point) && node.getQuads()[0] != null)
      {
         // Check to see if any of the quads contain the point
         var p = 0;
         while (fNode == node && p < 4)
         {
            fNode = this.findNodePoint(point, node.getQuads()[p++]);
         }
      }
      return fNode;
   },

   /**
    * Find the smallest quadtree node which contains the rectangle specified.
    *
    * @param rect {Rectangle2D} The rectangle to locate
    * @param node {QuadtreeNode} The node to start the search at
    * @type QuadtreeNode
    */
   findNodeRect: function(rect, node) {
      var fNode = node;
      if (node.rect.containsRect(rect) && node.getQuads()[0] != null)
      {
         // Check to see if any of the quads contain the rect
         var p = 0;
         while (fNode == node && p < 4)
         {
            fNode = this.findNodeRect(rect, node.getQuads()[p++]);
         }
      }
      return fNode;
   },

   /**
    * Returns a potential collision list of objects that are contained
    * within the defined sub-space of the container.
    *
    * @param node {QuadtreeNode} The node to search against
    * @type HashContainer
    */
   getPCL: function(node) {

   }
}, {
   /**
    * Get the class name of this object
    *
    * @type String
    */
   getClassName: function() {
      return "Quadtree";
   }

});

return Quadtree;

});