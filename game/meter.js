Engine.initObject("Meter", "Base", function() {
	var Meter = Base.extend({
		field: null,
		renderContext: null,
		caretSeparationX: 7,
		carets: null,
		reading: 0,
		max: 0,

		constructor: function(field, renderContext, reading, numberOfCarets, position) {
			this.field = field;
			this.renderContext = renderContext;
			this.pos = position;

			this.carets = [];			
			for(var i = 0; i < numberOfCarets; i++)
			{
				var caret = Caret.create(this, i, this.field.imageLoader, Caret.OFF);
				caret.setDrawMode(RenderComponent.NO_DRAW);
				this.carets.push(caret);
				this.renderContext.add(caret);
			}
			
			this.setReading(reading, reading);
		},

		setReading: function(reading, max) {
			this.reading = reading;
			this.max = max;
			
			for(var i = 0; i < this.carets.length; i++)
			{
				if(i < this.max)
				{
					if(i >= reading)
						this.carets[i].setState(Caret.OFF);
					else
						this.carets[i].setState(Caret.ON);
						
					this.carets[i].setDrawMode(RenderComponent.DRAW);
				}
				else
					this.carets[i].setDrawMode(RenderComponent.NO_DRAW);
			}
			
			// set other carets that aren't needed for this meter to not draw
			for(var i = this.max; i < this.carets.length; i++)
				this.carets[i].setDrawMode(RenderComponent.NO_DRAW);
		},
		
		notifyReadingUpdate: function(obj) {
			var meterReading = obj.getMeterReading();
			if(meterReading != null)
				this.setReading(obj.getMeterReading(), obj.getMeterMax());
		},
		
		reset: function() {
			this.setReading(this.max, this.max);
		},
		
		decrement: function() {
			if(this.reading > 0)
				this.setReading(this.reading - 1, this.max);
		},

		getPosition: function() { return this.pos; },

		release: function() {
			this.base();
		},

	}, {

		getClassName: function() {
			return "Meter";
		},
	});

	return Meter;
});
