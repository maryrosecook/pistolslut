/**
 * The Render Engine
 * LevelLoader
 *
 * @fileoverview An extension of the image resource loader for loading 2D levels
 * 				  with an associated collision map and object placement.  Includes
 * 				  a class for working with loaded levels.
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
Engine.include("/engine/engine.math2d.js");
Engine.include("/engine/engine.pooledobject.js");
Engine.include("/resourceloaders/loader.image.js");

Engine.initObject("LevelLoader", "ImageLoader", function() {

/**
 * @class Loads levels and makes them available to the system.  Levels are defined
 *        by a specific type of resource file.  A level is comprised of its bitmap
 *        file, a collision map, and objects that make up the level with their
 *        constructor states.
 * <pre>
 * {
 *    // A level file
 *    bitmapImage: "level1.png",
 *    bitmapWidth: 6768,
 *    bitmapHeight: 448,
 *    collisionMap: [
 *       [0, 400, 6768, 48]
 *    ],
 *    objects: {}
 * }
 * </pre>
 *
 * @constructor
 * @param name {String=LevelLoader} The name of the resource loader
 * @extends ImageLoader
 */
var LevelLoader = ImageLoader.extend(/** @scope LevelLoader.prototype */{

   levels: null,

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name || "LevelLoader");
      this.levels = {};
   },

   /**
    * Load a level resource from a URL.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    */
   load: function(name, url, info, path) {

      if (url)
      {
         var loc = window.location;
         if (url.indexOf(loc.protocol) != -1 && url.indexOf(loc.host) == -1) {
            Assert(false, "Levels must be located on this server");
         }

         var thisObj = this;

         // Get the file from the server
         $.get(url, function(data) {
            var levelInfo = EngineSupport.evalJSON(data);

            // get the path to the resource file
            var path = url.substring(0, url.lastIndexOf("/"));
            thisObj.load(name, null, levelInfo, path + "/");
         });
      }
      else
      {
         info.bitmapImage = path + info.bitmapImage;
         Console.log("Loading level: " + name + " @ " + info.bitmapImage);

         // Load the level image file
         this.base(name, info.bitmapImage, info.bitmapWidth, info.bitmapHeight);

         // Store the level info
         this.levels[name] = info;
      }
   },

   /**
    * Get the level resource with the specified name from the cache.  The
    * object returned contains the bitmap as <tt>image</tt> and
    * the level definition as <tt>info</tt>.
    *
    * @param name {String} The name of the object to retrieve
    * @return {Object} The level resource specified by the name
    */
   get: function(name) {
      var bitmap = this.base(name);
      var level = {
         image: bitmap,
         info: this.levels[name]
      };
      return level;
   },

   /**
    * Creates a {@link Level} object representing the named level.
    *
    * @param level {String} A loaded level name
    * @returns {Level} A {@link Level} object
    */
   getLevel: function(level) {
      return Level.create(level, this.get(level));
   },

   /**
    * The name of the resource this loader will get.
    * @returns {String} The string "level"
    */
   getResourceType: function() {
      return "level";
   }

}, /** @scope LevelLoader.prototype */{
   /**
    * Get the class name of this object.
    * @return {String} The string "LevelLoader"
    */
   getClassName: function() {
      return "LevelLoader";
   }
});

return LevelLoader;

});

Engine.initObject("Level", "PooledObject", function() {

/**
 * @class Creates an instance of a Level object.
 *
 * @constructor
 * @param name {String} The name of the object
 * @param levelResource {Object} The level resource loaded by the LevelLoader
 * @extends PooledObject
 */
var Level = PooledObject.extend(/** @scope Level.prototype */{

   // The level resource
   levelResource: null,

   // The level frame
   frame: null,

   // The map of all collision rects defined for the level
   collisionMap: null,

   /**
    * @private
    */
   constructor: function(name, levelResource) {

      this.levelResource = levelResource;
      this.collisionMap = [];

      // Run through the collision map to recreate
      // the collision rectangles
      for (var r in levelResource.info.collisionMap) {
         var rA = levelResource.info.collisionMap[r];
         this.collisionMap.push(Rectangle2D.create(rA[0], rA[1], rA[2], rA[3]));
      }

      return this.base(name);
   },

   /**
    * @private
    */
   release: function() {
      this.base();
      this.levelResource = null;
      this.frame = null;
      this.collisionMap = null;
   },

   /**
    * Gets a potential collision list (PCL) for the point and radius specified.
    * This routine, and the entire collision mechanism for levels, could be optimized for speed
    * using a BSP tree, or other structure.
    *
    * @param point {Point2D} The position to check for a collision
    * @param radius {Number} The distance from the point to check for collisions
    * @return {Array} An array of {@link Rectangle2D} instances which might be possible collisions
    */
   getPCL: function(point, radius) {
      // Create a rectangle which represents the position and radius
      var cRect = Rectangle2D.create(point.x - radius, point.y - radius, radius * 2, radius * 2);

      // Check the collision map for possible collisions
      var pcl = [];
      for (var r in this.collisionMap) {
         if (this.collisionMap[r].isIntersecting(cRect)) {
            pcl.push(this.collisionMap[r]);
         }
      }

      return pcl;
   },

   /**
    * Get the width of the level image.
    * @return {Number} The width of the level in pixels
    */
   getWidth: function() {
      return this.levelResource.info.bitmapWidth;
   },

   /**
    * Get the height of the level image.
    * @return {Number} The height of the level in pixels
    */
   getHeight: function() {
      return this.levelResource.info.bitmapHeight;
   },

   /**
    * Get a {@link Rectangle2D} which encloses this level.
    * @return {Rectangle2D} A {@link Rectangle2D} which encloses the level
    */
   getFrame: function() {
      if (!this.frame) {
         this.frame = Rectangle2D.create(0, 0, this.getWidth(), this.getHeight());
      }

      return this.frame;
   },

   /**
    * The source image loaded by the {@link LevelLoader} when the level was
    * created.
    * @return {HTMLImage} The source image of the level
    */
   getSourceImage: function() {
      return this.levelResource.image;
   }

}, /** @scope Level.prototype */{
   /**
    * Gets the class name of this object.
    * @return {String} The string "Level"
    */
   getClassName: function() {
      return "Level";
   }
});

return Level;

});
