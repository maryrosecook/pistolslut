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
	
		constructor: function(field, text, lineSpacing, x, b, width, color) {
			this.base("Speech");
			this.field = field;
			this.setup(text, lineSpacing, x, b, width, color)
		},
	
		setup: function(text, lineSpacing, x, b, width, color) {
			var lines = this.splitTextIntoLines(text, width);
			this.speechPosition = this.calculateSpeechPosition(lines.length, lineSpacing, x, b);
			
			for(var i in lines)
			{
				this.textRenderers[i] = TextRenderer.create(VectorText.create(), lines[i], 1);
		    this.textRenderers[i].setColor(color);
				this.textRenderers[i].setPosition(this.calculateTextRendererPosition(i, lineSpacing, x, b));
				this.textRenderers[i].setDrawMode(TextRenderer.NO_DRAW);
				this.field.renderContext.add(this.textRenderers[i]);
			}
		},
	
		calculateSpeechPosition: function(totalLines, lineSpacing, x, b) {
			var y = b - (totalLines * (lineSpacing + TextRenderer.create(VectorText.create(), "a", 1).getBoundingBox().dims.y));
			return Point2D.create(x, y);
		},
	
		calculateTextRendererPosition: function(lineNumber, lineSpacing, x, b) {
			var y = this.speechPosition.y + (lineNumber * (lineSpacing + TextRenderer.create(VectorText.create(), "a", 1).getBoundingBox().dims.y));
			return Point2D.create(x, y);
		},
	
		release: function() {
			this.base();
			this.textRenderers = [];
			this.speechPosition = null;
		},

		// update: function(renderContext, time) {
		// 
		// },
		
		show: function() {
			for(var i in this.textRenderers)
				this.textRenderers[i].drawMode = TextRenderer.DRAW_TEXT;
		},
		
		hide: function() {
			for(var i in this.textRenderers)
				this.textRenderers[i].drawMode = TextRenderer.NO_DRAW;
		},

		// split up each speech into lines of right width in readiness for display later
		splitTextIntoLines: function(text, lineWidth) {
			var lines = [];
			var currentLine = "";
			var cumulativeLineWidth = 0; // pixels
			var words = text.split(" ");
			for(var j in words)
			{
				var word = words[j] + " ";
				var wordWidth = TextRenderer.create(VectorText.create(), word, 1).getBoundingBox().dims.x;
				if(cumulativeLineWidth + wordWidth > lineWidth)
				{
					lines.push(currentLine);
					currentLine = "";
					cumulativeLineWidth = 0;
				}
				
				cumulativeLineWidth += wordWidth;
				currentLine += word;
			}
			
			if(currentLine != "")
				lines.push(currentLine);
						
			return lines;	
		},

		getPosition: function() { return this.getComponent("move").getPosition(); },
		getRenderPosition: function() { return this.getComponent("move").getRenderPosition(); },

	}, {
		getClassName: function() { return "Speech"; },

	});

	return Speech;
});

