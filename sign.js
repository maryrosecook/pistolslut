Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/textrender/text.vector.js");
Engine.include("/textrender/text.bitmap.js");
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
				this.textRenderers[i].scrollStartPosition = this.getScrollStartPosition();
				this.textRenderers[i].textBoundingBox = this.getTextBoundingBox(this.textRenderers[i]);
				renderContext.add(this.textRenderers[i]);
			}		
		
			this.resetScroll();
		},
	
		// puts all letters at start pos
		resetScroll: function() {
			var prevTextRenderer = null;
			for(var i in this.textRenderers)
			{
				var textPiecePos = null;
				if(prevTextRenderer == null)
					textPiecePos = this.textRenderers[i].scrollStartPosition;
				else // will be offset by at least one other letter
				{
					var prevTextRenderPos = prevTextRenderer.getPosition();
					textPiecePos = Point2D.create(prevTextRenderPos.x + prevTextRenderer.textBoundingBox.x + this.letterSpacing, prevTextRenderPos.y);
				}

				this.textRenderers[i].setPosition(textPiecePos);
				prevTextRenderer = this.textRenderers[i];
			}
		},
	
		getScrollStartPosition: function() {
			var scrollStartPos = Point2D.create(this.signPosition);
			scrollStartPos.setX(scrollStartPos.x + this.signWidth);
			return scrollStartPos;
		},

		isScrollComplete: function() {
			return this.textRenderers[this.textRenderers.length - 1].getPosition().x < this.signPosition.x;
		},
	
		isTextVisible: function(textRenderer) {
			var textRendererPositionX = textRenderer.getPosition().x;
			return textRendererPositionX > this.signPosition.x && textRendererPositionX + textRenderer.textBoundingBox.x < textRenderer.scrollStartPosition.x;
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
			else
			{
				renderContext.pushTransform();
				for(var i in this.textRenderers)
				{
					this.textRenderers[i].getPosition().add(this.scrollVec);
					this.textRenderers[i].drawMode = this.isTextVisible(this.textRenderers[i]) ? TextRenderer.DRAW_TEXT : TextRenderer.NO_DRAW;
					if(this.textRenderers[i].drawMode == TextRenderer.DRAW_TEXT)
						this.textRenderers[i].base(renderContext, time);
				}
				renderContext.popTransform();
		
				this.lastScrolled = time;
			}
		},

		getPosition: function() {
			return this.getComponent("move").getPosition();
		},

		getRenderPosition: function() {
			return this.getComponent("move").getRenderPosition();
		},

	}, { // Static Only

		getClassName: function() {
			return "Sign";
		},
	});

	return Sign;
});

