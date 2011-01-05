Engine.initObject("Meter", "Base", function() {
	var Meter = Base.extend({
		field: null,
		renderContext: null,
		reading: 0,
		max: 0,
        parts: null,
		pos: null,
        color: null,

		constructor: function(name, field, renderContext, reading, position) {
            this.name = name;
			this.field = field;
			this.renderContext = renderContext;
            this.parts = {};
			this.pos = position;

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
		constructor: function(name, field, renderContext, reading, position, color) {
            this.color = color;
            this.base(name, field, renderContext, reading, position);
		},

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

Engine.initObject("ImageMeter", "Meter", function() {
	var ImageMeter = Meter.extend({
        imageName: null,
        caretSpacing: null,
        onCarets: null,
        offCarets: null,

		constructor: function(name, field, renderContext, reading, position, imageName, caretSpacing) {
            this.imageName = imageName;
            this.caretSpacing = caretSpacing;
            this.base(name, field, renderContext, reading, position);
		},

        setupVisuals: function() {
            this.onCarets = [];
            this.offCarets = [];

            for(var i = 0; i < this.max; i++)
            {
                this.onCarets[i] = this.createCaret("on", i);
                this.offCarets[i] = this.createCaret("off", i);
                this.parts[i] = this.onCarets[i];
                this.parts[i].getDrawComponent().setDrawMode(RenderComponent.DRAW);
            }
        },

        createCaret: function(onState, i) {
            var position = Point2D.create(this.pos.x + (i * this.caretSpacing), this.pos.y);
            var imageCaret = ImageCaret.create(this.field, position, this.imageName + onState);
            this.renderContext.add(imageCaret);
            return imageCaret;
        },

        updateVisuals: function() {
            for(var i = 0; i < this.max; i++)
            {
                var requiredImage = this.onCarets[i];
                if(i >= this.reading)
                    requiredImage = this.offCarets[i];

                if(this.parts[i].id != requiredImage.id)
                {
                    this.parts[i].getDrawComponent().setDrawMode(RenderComponent.NO_DRAW);
                    this.parts[i] = requiredImage;
                    this.parts[i].getDrawComponent().setDrawMode(RenderComponent.DRAW);
                }
            }
        },
	}, {
		getClassName: function() { return "ImageMeter"; },

	});

	return ImageMeter;
});

Engine.initObject("Caret", "Mover", function() {
	var Caret = Mover.extend({
		field: null,

		constructor: function(field, position) {
			this.base("Caret");
			this.field = field;

			this.add(Mover2DComponent.create("move"));
			this.setZIndex(Meter.Z_INDEX);

			var c_mover = this.getComponent("move");
			c_mover.setPosition(position);
			c_mover.setCheckLag(false);
		},

		update: function(renderContext, time) {
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},

        getDrawComponent: function() { return this.getComponent("draw"); },

	}, {
		getClassName: function() { return "Caret"; },

	});

	return Caret;
});

Engine.initObject("ImageCaret", "Caret", function() {
	var ImageCaret = Caret.extend({
		field: null,
        imageName: null,

		constructor: function(field, position, imageName) {
            this.imageName = imageName;
			this.base(field, position);

            this.add(ImageComponent.create("draw", null, this.field.imageLoader, imageName));
            this.getDrawComponent().setImage(imageName);
            this.getDrawComponent().setDrawMode(RenderComponent.NO_DRAW);
		},
	}, {
		getClassName: function() { return "ImageCaret"; },

	});

	return ImageCaret;
});