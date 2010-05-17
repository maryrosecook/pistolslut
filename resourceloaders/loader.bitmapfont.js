/**
 * The Render Engine
 * BitmapFontLoader
 *
 * @fileoverview An extension of the image resource loader for handling bitmap
 *               fonts.
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
Engine.include("/resourceloaders/loader.image.js");

Engine.initObject("BitmapFontLoader", "ImageLoader", function() {

/**
 * @class Loads bitmap fonts and makes them available to the system.
 *
 * @constructor
 * @param name {String=BitmapFontLoader} The name of the resource loader
 * @extends ImageLoader
 */
var BitmapFontLoader = ImageLoader.extend(/** @scope BitmapFontLoader.prototype */{

   fonts: null,

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name || "BitmapFontLoader");
      this.fonts = {};
   },

   /**
    * Load a font resource from a URL.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    */
   load: function(name, url, info) {

      // The bitmap is in the same path
      var path = Engine.getEnginePath() + "/fonts/";

      if (url)
      {
         var thisObj = this;

         // Get the file from the server
         $.getScript(path + url, function(data) {
            data = BitmapFontLoader.font;
				Console.log("Acquired font info: ", data);
            thisObj.load(name, null, data);
         });
      }
      else
      {
         Console.log("Loading font: " + name + " @ " + path + info.bitmapImage);

         // Store the font info
         this.fonts[name] = info;

         // Load the bitmap file
         this.base(name, path + info.bitmapImage, info.width, info.height);
      }
   },

   /**
    * Get the font with the specified name from the cache.  The
    * object returned contains the bitmap as <tt>image</tt> and
    * the font definition as <tt>info</tt>.
    *
    * @param name {String} The name of the object to retrieve
    * @return {Object} The object representing the named font
    */
   get: function(name) {
      var bitmap = this.base(name);
      var font = {
         image: bitmap,
         info: this.fonts[name]
      };
      return font;
   },

   /**
    * The name of the resource this loader will get.
    * @return {String} The string "bitmap font"
    */
   getResourceType: function() {
      return "bitmap font";
   }
}, { /** @scope BitmapFontLoader.protoype */
   /**
    * Get the class name of this object
    * @return {String} The string "BitmapFontLoader"
    */
   getClassName: function() {
      return "BitmapFontLoader";
   }
});

return BitmapFontLoader;

});
