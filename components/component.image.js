/**
 * The Render Engine
 * ImageComponent
 *
 * @fileoverview An extension of the render component which handles
 *               image resource rendering.
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
Engine.include("/engine/engine.math2d.js");
Engine.include("/components/component.render.js");

Engine.initObject("ImageComponent", "RenderComponent", function() {

/**
 * @class A render component that renders an image.
 *
 * @param name {String} The name of the component
 * @param [priority=0.1] {Number} The render priority
 * @param imageLoader {ImageLoader} The image loader to get images from
 * @param [imageName] {String} The name of the image resource from the loader
 * @extends RenderComponent
 * @constructor
 * @description Creates a component which renders images from an {@link ImageLoader}.
 */
var ImageComponent = RenderComponent.extend(/** @scope ImageComponent.prototype */{

   currentImage: null,
   bbox: null,
   imageLoader: null,

   /**
    * @private
    */
   constructor: function(name, priority, imageLoader, imageName) {
      if (priority instanceof ImageLoader) {
         imageName = imageLoader;
         imageLoader = priority;
         priority = 0.1;
      }
      this.base(name, priority);
      this.imageLoader = imageLoader;
      if (imageName != null) {
         this.currentImage = imageLoader.get(imageName);
         var dims = imageLoader.getDimensions(imageName);
         this.bbox = Rectangle2D.create(0,0,dims.x,dims.y);
      }
   },

   /**
    * Releases the component back into the object pool. See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.currentImage = null;
      this.bbox = null;
   },

   /**
    * Calculates the bounding box which encloses the image.
    * @private
    */
   calculateBoundingBox: function() {
      return this.bbox;
    },

   /**
    * Set the image the component will render from the {@link ImageLoader}
    * specified when creating the component.  This allows the user to change
    * the image on the fly.
    *
    * @param imageName {String} The image to render
    */
   setImage: function(imageName) {
      this.currentImage = this.imageLoader.get(imageName);
      var dims = this.imageLoader.getDimensions(imageName);
      this.bbox.setWidth(dims.x);
      this.bbox.setHeight(dims.y);
   },

   /**
    * Get the image the component is rendering.
    * @return {HTMLImage}
    */
   getImage: function() {
      return this.currentImage;
   },

   /**
    * Draw the image to the render context.
    *
    * @param renderContext {RenderContext} The context to render to
    * @param time {Number} The engine time in milliseconds
    */
   execute: function(renderContext, time) {

      if (!this.base(renderContext, time))
      {
         return;
      }

      if (this.currentImage) {
         renderContext.drawImage(this.bbox, this.currentImage, null, this.getHostObject());
      }
   }
}, /** @scope ImageComponent.prototype */{
   /**
    * Get the class name of this object
    * @return {String} "ImageComponent"
    */
   getClassName: function() {
      return "ImageComponent";
   }
});

return ImageComponent;

});
