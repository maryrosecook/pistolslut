Engine.initObject("Meter", "Base", function() {
	var Meter = Base.extend({
		field: null,
		renderContext: null,
		caretSeparationX: 9,
		carets: null,
		reading: 0,
		max: 0,
		pos: null,

		constructor: function(field, renderContext, reading, numberOfCarets, position, onColor) {
			this.field = field;
			this.renderContext = renderContext;
			this.pos = position;

			this.carets = [];			
			for(var i = 0; i < numberOfCarets; i++)
			{
				var caret = Caret.create(this, i, onColor);
				this.carets.push(caret);
				this.renderContext.add(caret);
			}
			
			this.setReading(reading, reading);
		},

		updatePosition: function(newX) {
			this.pos.setX(newX);
			for(var i in this.carets)
				this.carets[i].updatePosition();
		},

		setReading: function(reading, max) {
			this.reading = reading;
			this.max = max;			
			for(var i = 0; i < this.carets.length; i++)
			{
				if(i < this.max)
				{
					if(i >= reading)
						this.carets[i].switchOff();
					else
						this.carets[i].switchOn();
					
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
		
		reset: function(obj) {
			if(obj instanceof Player)
				this.setReading(this.max, this.max);
		},
		
		decrement: function(obj) {
			if(this.reading > 0)
				if(obj instanceof Player || (obj instanceof Weapon && obj.owner instanceof Player))
				{
					this.reading -= 1;
					this.carets[this.reading].switchOff();
				}
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
