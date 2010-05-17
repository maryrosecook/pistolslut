/**
 * The Render Engine
 * BitmapText
 *
 * @fileoverview A native context font renderer.  Uses the context's font rendering
 * 				  mechanism to generate textual output.
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
Engine.include("/textrender/text.abstractrender.js");

Engine.initObject("ContextText", "AbstractTextRenderer", function() {

/**
 * @class A text renderer which draws text from a bitmap font file.
 *
 * @constructor
 * @extends AbstractTextRenderer
 */
var ContextText = AbstractTextRenderer.extend(/** @scope ContextText.prototype */{

	/**
	 * @private
	 */
   constructor: function() {
      this.base();
		this.tInit();
   },

	/**
	 * Initialize some basics
	 */
	tInit: function() {
		this.setTextAlignment(RenderContext2D.FONT_ALIGN_LEFT);
		this.setTextWeight(RenderContext2D.FONT_WEIGHT_NORMAL);
		this.setTextFont("sans-serif");
		this.setTextStyle(RenderContext2D.FONT_STYLE_NORMAL);
	},

	/**
	 * @private
	 */
   release: function() {
      this.base();
		this.tInit();
   },

   /**
    * Calculate the bounding box for the text and set it on the host object.
    * @private
    */
   calculateBoundingBox: function() {
      return;
   },

   /**
    * @private
    */
   execute: function(renderContext, time) {

      if (this.getText().length == 0)
      {
         return;
      }

		renderContext.setFontStyle(this.getTextStyle());
		renderContext.setFontAlign(this.getTextAlignment());
		renderContext.setFontWeight(this.getTextWeight());
		renderContext.setFont(this.getTextFont());
		
		renderContext.setFillStyle(this.getColor());
      renderContext.drawText(Point2D.ZERO, this.getText());
   }
	
}, /** @scope BitmapText.prototype */{
   /**
    * Get the class name of this object
    * @return {String} The string "BitmapText"
    */
   getClassName: function() {
      return "ContextText";
   }
});

return ContextText;

});
