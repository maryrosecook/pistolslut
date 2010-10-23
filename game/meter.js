Engine.initObject("Meter", "Base", function() {
	var Meter = Base.extend({
		field: null,
		renderContext: null,
		reading: 0,
		max: 0,
		fullShape: null,
		emptyShape: null,
		pos: null,

		constructor: function(field, renderContext, reading, position, color) {
			this.field = field;
			this.renderContext = renderContext;
			this.pos = position;

 			// width, height, position will get updated in a bit
			this.fullShape = RectangleShape.create(color, 0, 0, position, Meter.SHAPE_Z_INDEX);
			this.emptyShape = RectangleShape.create("#000", 0, 0, position, Meter.SHAPE_Z_INDEX + 1);
			renderContext.add(this.fullShape);
			renderContext.add(this.emptyShape);
			this.setReading(reading, reading);
		},
				
		updatePosition: function(moveX)
 		{
			this.fullShape.getPosition().setX(this.fullShape.getPosition().x + moveX);
			this.emptyShape.getPosition().setX(this.emptyShape.getPosition().x + moveX);
		},
		
		setReading: function(reading, max) {
			this.reading = reading;
			this.max = max;

			var fullWidth = Meter.INT_WIDTH * this.reading;
			var emptyWidth = (Meter.INT_WIDTH * this.max) - fullWidth;

			this.fullShape.setDimensions(fullWidth, Meter.HEIGHT);
			this.emptyShape.setDimensions(emptyWidth, Meter.HEIGHT);			
			this.emptyShape.getPosition().setX(this.fullShape.getPosition().x + fullWidth);
		},
		
		notifyReadingUpdate: function(obj) {
			var meterReading = obj.getMeterReading();
			if(meterReading != null)
				this.setReading(obj.getMeterReading(), obj.getMeterMax());
		},
		
		reset: function(obj) {
			if(obj instanceof Player)
				if(obj instanceof Player || (obj instanceof Weapon && obj.owner instanceof Player))
					this.setReading(this.max, this.max);
		},
		
		decrement: function(obj) {
			if(this.reading > 0)
				if(obj instanceof Player || (obj instanceof Weapon && obj.owner instanceof Player))
					this.setReading(this.reading - 1, this.max);
		},

		getPosition: function() { return this.pos; },

		release: function() {
			this.base();
		},

	}, {
		getClassName: function() { return "Meter"; },
		
		INT_WIDTH: 9,
		HEIGHT: 3,
		SHAPE_Z_INDEX: 1000,
	});

	return Meter;
});