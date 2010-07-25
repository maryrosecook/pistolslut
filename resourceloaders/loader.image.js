/**
 * The Render Engine
 * ImageLoader
 *
 * @fileoverview A resource loader for images.
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
Engine.include("/resourceloaders/loader.remote.js");
Engine.include("/engine/engine.timers.js");

Engine.initObject("ImageLoader", "RemoteLoader", function() {

/**
 * @class Loads images and stores the reference to those images.
 *
 * @constructor
 * @param name {String=ImageLoader} The name of the resource loader
 * @extends RemoteLoader
 */
var ImageLoader = RemoteLoader.extend(/** @scope ImageLoader.prototype */{

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name || "ImageLoader");
   },

   /**
    * Load an image resource from a URL.  Images are cached within the page
    * in an invisible object for fast retrieval.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    * @param width {Number} The width of this resource, in pixels
    * @param height {Number} The height of this resource, in pixels
    */
   load: function(name, url, width, height) {

      // Create the area if it doesn't exist which will
      // be used to load the images from their URL
      if (this.getElement() == null)
      {
         var div = jQuery("<div/>")
            .css({ background: "black", display: "none" });

         this.setElement(div[0]);

         // Add it to the default context so it can be cleaned up
         Engine.getDefaultContext().add(this);
      }

      // Create an image element
      var imageInfo = null;
      if (url != null) {
         imageInfo = this.loadImageResource(name, url, width, height);
      }

      this.base(name, imageInfo);
   },

   /**
    * Lazy loads an image resource when the information for it becomes available.  It
    * is best to specify the width and height of the resource, but it isn't necessary
    * to load the image.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    * @param width {Number} The width of this resource, in pixels, or <tt>null</tt>
    * @param height {Number} The height of this resource, in pixels, or <tt>null</tt>
    * @return {HTMLImage} The image loaded
    */
   loadImageResource: function(name, url, width, height) {
      var image = null;
      if (width && height) {
         image = $("<img/>").attr("src", url).attr("width", width).attr("height", height);
      } else {
         image = $("<img/>").attr("src", url);
      }
      
      var thisObj = this;
      if (!$.browser.Wii) {
         image.bind("load", function() {
            thisObj.setReady(name, true);
         });
      } else {
         // Calculate an approximate wait time based on dimensions
         OneShotTimeout.create("readyImg", (width * height) * ImageLoader.loadAdjust, function() {
            thisObj.setReady(name, true); 
         });
      }

      // Append it to the container so it can load the image
      $(this.getElement()).append(image);
      var info = {
         width: width,
         height: height,
         image: image
      };
      return info;
   },

   /**
    * Get the image from the resource stored with the specified name, or <tt>null</tt>
    * if no such image exists.
    *
    * @param name {String} The name of the image resource
    * @return {HTMLImage} The image
    */
   get: function(name) {
      var imgInfo = this.base(name);
      return imgInfo ? imgInfo.image[0] : null;
   },
   
   /**
    * Get the dimensions of an image from the resource stored with 
    * the specified name, or <tt>null</tt> if no such image exists.
    *
    * @param name {String} The name of the image resource
    * @return {Point2D} A point which represents the width and height of the image
    */
   getDimensions: function(name) {
      var imgInfo = this.getCachedObjects()[name] ? this.getCachedObjects()[name].data : null;
      return imgInfo ? Point2D.create(imgInfo.width, imgInfo.height) : null;
   },

   /**
    * The name of the resource this loader will get.
    * @return {String} The string "image"
    */
   getResourceType: function() {
      return "image";
   }
}, /** @scope ImageLoader.prototype */{
   /**
    * Get the class name of this object
    * @return {String} The string "ImageLoader"
    */
   getClassName: function() {
      return "ImageLoader";
   },
   
   /**
    * The ratio by which to scale image load times when loading on the Wii
    */
   loadAdjust: 0.05
});

return ImageLoader;

});