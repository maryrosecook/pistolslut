Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/textrender/text.vector.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/engine/engine.timers.js");

Engine.initObject("Speech", "Object2D", function() {
	var Speech = Object2D.extend({
		
		field: null,
		textRenderers: [],
		speechPosition: null,
		speechWidth: null,
	
		constructor: function(field, text, color, position, speechWidth) {
			this.base("Speech");
			this.field = field;
			this.speechPosition = position;
			this.speechWidth = speechWidth;
			this.setupTextRenderers(text, color)
		},
	
		// splits up text so each line is handled by a different TextRenderer
		setupTextRenderers: function(text, color) {
			var words = text.split(" ");
			for(var i in textPieces) 
			{
				this.textRenderers[i] = TextRenderer.create(VectorText.create(), textPieces[i], 1);
		    this.textRenderers[i].setColor(color);
				this.textRenderers[i].textBoundingBox = this.getTextBoundingBox(this.textRenderers[i]);
				this.field.renderContext.add(this.textRenderers[i]);
			}	
		},
		
		getTextWidth: function(text) {
			for(var i in text.split(""))
				VectorText.charSet[]
		},
		
		getGlyph: function(letter) { return VectorText.charSet[letter - 32]; },
	
		getTextBoundingBox: function(textRenderer) { return textRenderer.renderer.getHostObject().getBoundingBox().dims; },

		release: function() {
			this.base();
			this.textRenderers = [];
			this.speechPosition = null;
			this.speechWidth = null;
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

		getPosition: function() { return this.getComponent("move").getPosition(); },
		getRenderPosition: function() { return this.getComponent("move").getRenderPosition(); },

	}, {
		getClassName: function() { return "Speech"; },

	});

	return Speech;
});

