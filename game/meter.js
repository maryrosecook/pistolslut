Engine.initObject("Meter", "Base", function() {
	var Meter = Base.extend({
		field: null,
		renderContext: null,
		reading: 0,
		max: 0,
        parts: null,
		pos: null,
        color: null,

		constructor: function(name, field, renderContext, reading, position, color) {
            this.name = name;
			this.field = field;
			this.renderContext = renderContext;
            this.parts = {};
			this.pos = position;
            this.color = color;

            this.reading = reading;
            this.max = reading;
            this.finalConstructor();
		},

        finalConstructor: function() {
            this.setupVisuals();
			this.setReading(this.reading, this.reading);
        },

		updatePosition: function(moveX)
 		{
            for(var i in this.parts)
			    this.parts[i].getPosition().setX(this.parts[i].getPosition().x + moveX);
		},

		setReading: function(reading, max) {
			this.reading = reading;
			this.max = max;
            this.updateVisuals();
		},

		notifyReadingUpdate: function(obj) {
			var meterReading = obj.getMeterReading(this);
			if(meterReading != null)
				this.setReading(obj.getMeterReading(this), obj.getMeterMax(this));
		},

		reset: function(obj) {
			if(obj instanceof Player || obj.owner instanceof Player)
				this.setReading(this.max, this.max);
		},

		decrement: function(obj) {
			if(this.reading > 0)
				if(obj instanceof Player || obj.owner instanceof Player)
					this.setReading(this.reading - 1, this.max);
		},

		getPosition: function() { return this.pos; },

		release: function() {
			this.base();
		},

	}, {
		getClassName: function() { return "Meter"; },

		Z_INDEX: 1000,
	});

	return Meter;
});

Engine.initObject("BarMeter", "Meter", function() {
	BarMeter = Meter.extend({
        setupVisuals: function() {
			this.parts["fullShape"] = RectangleShape.create(this.color, 0, 0, this.pos, Meter.Z_INDEX);
			this.parts["emptyShape"] = RectangleShape.create("#000", 0, 0, this.pos, Meter.Z_INDEX + 1);
			this.renderContext.add(this.parts["fullShape"]);
			this.renderContext.add(this.parts["emptyShape"]);
        },

        updateVisuals: function() {
			var fullWidth = BarMeter.INT_WIDTH * this.reading;
			var emptyWidth = (BarMeter.INT_WIDTH * this.max) - fullWidth;

			this.parts["fullShape"].setDimensions(fullWidth, BarMeter.HEIGHT);
			this.parts["emptyShape"].setDimensions(emptyWidth, BarMeter.HEIGHT);
			this.parts["emptyShape"].getPosition().setX(this.parts["fullShape"].getPosition().x + fullWidth);
        },
	}, {
		getClassName: function() { return "BarMeter"; },

        HEIGHT: 3,
        INT_WIDTH: 9,
	});

	return BarMeter;
});

Engine.initObject("NumberMeter", "Meter", function() {
	var NumberMeter = Meter.extend({
        lastWidth: 0,

        setupVisuals: function() {
			this.parts["number"] = TextRenderer.create(VectorText.create(), this.reading, 1);
            this.parts["number"].setPosition(this.pos);
			this.parts["number"].setDrawMode(TextRenderer.DRAW_TEXT);
		    this.parts["number"].setTextWeight(1);
		    this.parts["number"].setColor(this.color);
            this.parts["number"].setText(this.reading);
			this.renderContext.add(this.parts["number"]);
            this.updateLastWidth();
            this.updateVisuals();
        },

        getTextBoundingBox: function(textRenderer) { return textRenderer.renderer.getHostObject().getBoundingBox().dims; },

        updateVisuals: function() {
            this.parts["number"].setText(this.reading);
            this.pos.setX(this.pos.x + this.lastWidth - this.getTextBoundingBox(this.parts["number"]).x);

            this.parts["number"].setPosition(this.pos);
            this.updateLastWidth();
        },

        updateLastWidth: function() {
            this.lastWidth = this.getTextBoundingBox(this.parts["number"]).x;
        },
	}, {
		getClassName: function() { return "NumberMeter"; },

	});

	return NumberMeter;
});

Engine.initObject("ImageMeter", "Meter", function() {
	var ImageMeter = Meter.extend({
        lastWidth: 0,

		constructor: function(field, renderContext, reading, position, color, onImage, offImage) {
            this.base(field, renderContext, reading, position, color);

            this.reading = reading;
            this.max = reading;
            this.setupVisuals();
			this.setReading(reading, reading);
		},

        setupVisuals: function() {
            for(var i = 0; i < this.max; i++)
                this.parts.push();
            this.updateVisuals();
        },

        updateVisuals: function() {
            this.parts["number"].setText(this.reading);
            this.pos.setX(this.pos.x + this.lastWidth - this.getTextBoundingBox(this.parts["number"]).x);

            this.parts["number"].setPosition(this.pos);
            this.updateLastWidth();
        },
	}, {
		getClassName: function() { return "ImageMeter"; },

	});

	return ImageMeter;
});