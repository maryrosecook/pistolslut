/**
 * The Render Engine
 * BitmapText
 *
 * @fileoverview A bitmap font renderer for render contexts that don't
 * 				  support fonts natively.
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

// Includes
Engine.include("/engine/engine.math2d.js");
Engine.include("/textrender/text.abstractrender.js");

Engine.initObject("BitmapText", "AbstractTextRenderer", function() {

/**
 * @class A text renderer which draws text from a bitmap font file.  This type of text
 * 		 renderer is only supported by the {@link CanvasContext}.  For an {@link HTMLElementContext}
 * 		 or a derivative, use the {@link ContextText} renderer.
 *
 * @constructor
 * @param font {Font} A resource obtained by calling {@link FontResourceLoader#get}
 * @extends AbstractTextRenderer
 * @see FontResourceLoader
 */
var BitmapText = AbstractTextRenderer.extend(/** @scope BitmapText.prototype */{

   font: null,

   spacing: 0,

	/**
	 * @private
	 */
   constructor: function(font) {
      this.base();
      this.font = font;
   },

	/**
	 * @private
	 */
   release: function() {
      this.base();
      this.font = null;
      this.spacing = 0;
   },

   /**
    * Calculate the bounding box for the text and set it on the host object.
    * @private
    */
   calculateBoundingBox: function() {
      return;

      var x1 = 0;
      var x2 = 0;
      var y1 = 0;
      var y2 = 0;
      for (var p = 0; p < this.rText.length; p++)
      {
         var pt = this.rText[p];

         if (pt.x < x1)
         {
            x1 = pt.x;
         }
         if (pt.x > x2)
         {
            x2 = pt.x;
         }
         if (pt.y < y1)
         {
            y1 = pt.y;
         }
         if (pt.y > y2)
         {
            y2 = pt.y;
         }
      }

      this.getHostObject().setBoundingBox(new Rectangle2D(x1, y1, Math.abs(x1) + x2, Math.abs(y1) + y2));
   },

   /**
    * Set the text to render.
    *
    * @param text {String} The text to render
    */
   setText: function(text) {
      // If the font only supports uppercase letters
      text = (this.font.upperCaseOnly ? String(text).toUpperCase() : text);

      // Replace special chars
      text = text.replace(/&copy;/gi,"(C)").replace(/&reg;/gi,"(R)");

      this.base(text);

      this.calculateBoundingBox();
   },

   /**
    * @private
    */
   execute: function(renderContext, time) {

      if (this.getText().length == 0)
      {
         return;
      }

      var text = this.getText();
      var lCount = text.length;
      var align = this.getTextAlignment();
      var letter = (align == AbstractTextRenderer.ALIGN_RIGHT ? text.length - 1 : 0);
      var kern = (align == AbstractTextRenderer.ALIGN_RIGHT ? -this.font.info.kerning : this.font.info.kerning);
      var space = new Point2D((align == AbstractTextRenderer.ALIGN_RIGHT ? -this.font.info.space : this.font.info.space), 0);
      var cW, cH = this.font.info.height;
      var cS = 0;

      // Render the text
      var pc = new Point2D(0,0);

      // 1st pass: The text
      pc = new Point2D(0,0);
      letter = (align == AbstractTextRenderer.ALIGN_RIGHT ? text.length - 1 : 0);
      lCount = text.length;

		if (renderContext.get2DContext) {
	      renderContext.get2DContext().globalCompositeOperation = "source-over";
		}

      while (lCount-- > 0)
      {
         var glyph = text.charCodeAt(letter) - 32;
         if (glyph == 0)
         {
            // A space
            pc.add(space);
         }
         else
         {
            // Draw the text
            cS = this.font.info.letters[glyph - 1];
            cW = this.font.info.letters[glyph] - cS;
            //debugger;
				var sRect = Rectangle2D.create(cS, 0, cW, cH);
				var rect = Rectangle2D.create(pc.x, pc.y, cW, cH);
            renderContext.drawImage(null, rect, this.font.image, sRect);
            pc.add(new Point2D(cW, 0).mul(kern));
         }

         letter += (align == AbstractTextRenderer.ALIGN_RIGHT ? -1 : 1);
      }

      // 2nd pass: The color
		if (renderContext.get2DContext) {
	      renderContext.get2DContext().globalCompositeOperation = "source-atop";
	      lCount = text.length;
	      pc = new Point2D(0,0);
	      letter = (align == AbstractTextRenderer.ALIGN_RIGHT ? text.length - 1 : 0);
	      while (lCount-- > 0)
	      {
	         var glyph = text.charCodeAt(letter) - 32;
	         if (glyph == 0)
	         {
	            // A space
	            pc.add(space);
	         }
	         else
	         {
	            // Draw a box the color we want and the size of the character
	            cS = this.font.info.letters[glyph - 1];
	            cW = this.font.info.letters[glyph] - cS;
	            var r = new Rectangle2D(pc.x, pc.y, cW, cH);
	            renderContext.setFillStyle(this.getColor());
	            renderContext.drawFilledRectangle(r);
	            pc.add(new Point2D(cW, 0).mul(kern));
	         }
	
	         letter += (align == AbstractTextRenderer.ALIGN_RIGHT ? -1 : 1);
	      }
	
	
	      // Reset the composition operation
	      renderContext.get2DContext().globalCompositeOperation = "source-over";
		}
   }
}, /** @scope BitmapText.prototype */{
   /**
    * Get the class name of this object
    * @return {String} The string "BitmapText"
    */
   getClassName: function() {
      return "BitmapText";
   }
});

return BitmapText;

});
