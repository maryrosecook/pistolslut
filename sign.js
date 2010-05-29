/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * The asteroid object
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 692 $
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

Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/engine/engine.timers.js");

Engine.initObject("Sign", "Object2D", function() {

var Sign = Object2D.extend({
	
	textRenderers: null,
	scrollVec: Vector2D.create(-2.5, 0),
	signPosition: null,
	signWidth: null,
	signColor: null,
	
	constructor: function(renderContext, text, color, position, signWidth, letterSpacing) {
		this.base("Sign");
		this.signPosition = position;
		this.signWidth = signWidth;
		this.textRenderers = [];
		this.signColor = color;
		this.letterSpacing = letterSpacing;

		this.add(Mover2DComponent.create("move"));

		this.setupTextRenderers(renderContext, text);
	},
	
	// splits up text so each letter is handled by a different TextRenderer
	setupTextRenderers: function(renderContext, text) {
		var textPieces = text.split(""); // set each letter in its own renderer
		for(var i in textPieces) 
		{
			this.textRenderers[i] = TextRenderer.create(VectorText.create(), textPieces[i], 1);
	    this.textRenderers[i].setTextWeight(1);
	    this.textRenderers[i].setColor(this.signColor);
			renderContext.add(this.textRenderers[i]);
		}		
		
		this.resetScroll();
	},
	
	// puts all letters at start pos
	resetScroll: function() {
		var prevTextRenderer = null;
		for(var i in this.textRenderers)
		{
			var textPiecePos = this.getScrollStartPosition();
			if(prevTextRenderer != null) // will be offset by at least one other letter
			{
				textPiecePos = Point2D.create(prevTextRenderer.getPosition());
				var prevLetterWidthAndSpacing = this.getTextBoundingBox(prevTextRenderer).x + this.letterSpacing;
				textPiecePos = textPiecePos.add(Vector2D.create(prevLetterWidthAndSpacing, 0));
			}

			this.textRenderers[i].setPosition(textPiecePos);
			prevTextRenderer = this.textRenderers[i];
		}
	},
	
	getScrollStartPosition: function() {
		return Point2D.create(this.signPosition).add(Vector2D.create(this.signWidth, 0));
	},

	isScrollComplete: function() {
		return this.textRenderers[this.textRenderers.length - 1].getPosition().x < this.signPosition.x;
	},
	
	isTextVisible: function(textRenderer) {
		return textRenderer.getPosition().x > this.signPosition.x && textRenderer.getPosition().x + this.getTextBoundingBox(textRenderer).x < this.getScrollStartPosition().x;
	},
	
	getTextBoundingBox: function(textRenderer) {
		return textRenderer.renderer.getHostObject().getBoundingBox().dims;
	},

	release: function() {
		this.base();
		this.textRenderers = null;
		this.signPosition = null;
		this.signWidth = null;
		this.signColor = null;
	},

	update: function(renderContext, time) {
		if(this.isScrollComplete())
			this.resetScroll();
		else if(this.timeToScroll())
		{
			var c_mover = this.getComponent("move");
			renderContext.pushTransform();
			for(var i in this.textRenderers)
			{
				this.textRenderers[i].setPosition(this.textRenderers[i].getPosition().add(this.scrollVec));
				this.textRenderers[i].base(renderContext, time);
				this.textRenderers[i].drawMode = this.isTextVisible(this.textRenderers[i]) ? TextRenderer.DRAW_TEXT : TextRenderer.NO_DRAW;
			}
			renderContext.popTransform();
			
			this.lastScrolled = new Date().getTime();
		}
	},
	
	scrollInterval: 10,
	lastScrolled: 0,
	timeToScroll: function() {
		return (this.lastScrolled + this.scrollInterval < new Date().getTime());
	},

	getPosition: function() {
		return this.getComponent("move").getPosition();
	},

	getRenderPosition: function() {
		return this.getComponent("move").getRenderPosition();
	},

	setup: function() {

	},

}, { // Static Only

	/**
	 * Get the class name of this object
	 *
	 * @type String
	 */
	getClassName: function() {
		return "Sign";
	},
});

return Sign;

});

