Engine.initObject("Meter", "Base", function() {
	var Meter = Base.extend({
		field: null,
		renderContext: null,
		reading: 0,
		max: 0,
        parts: null,
		pos: null,

		constructor: function(field, renderContext, reading, position) {
			this.field = field;
			this.renderContext = renderContext;
            this.parts = {};
			this.pos = position;

            this.reading = reading;
            this.max = reading;
            this.finalConstructor();
		},

        finalConstructor: function() {
            this.setupCarets();
			this.setReading(this.reading, this.reading);
        },

		setReading: function(reading, max) {
            if(reading !== null)
			    this.reading = reading;

            if(max !== null)
			    this.max = max;

            this.updateCarets();
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
		getClassName: function() { return "Meter"; },

		Z_INDEX: 1000,
	});

	return Meter;
});

// Engine.initObject("BarMeter", "Meter", function() {
// 	BarMeter = Meter.extend({
//         color: null,

// 		constructor: function(field, renderContext, reading, position, color) {
//             this.color = color;
//             this.base(field, renderContext, reading, position);
// 		},

//         setupVisuals: function() {
// 			this.parts["fullShape"] = RectangleShape.create(this.color, 0, 0, this.pos, Meter.Z_INDEX);
// 			this.parts["emptyShape"] = RectangleShape.create("#000", 0, 0, this.pos, Meter.Z_INDEX + 1);
// 			this.renderContext.add(this.parts["fullShape"]);
// 			this.renderContext.add(this.parts["emptyShape"]);
//         },

//         updateVisuals: function() {
// 			var fullWidth = BarMeter.INT_WIDTH * this.reading;
// 			var emptyWidth = (BarMeter.INT_WIDTH * this.max) - fullWidth;

// 			this.parts["fullShape"].setDimensions(fullWidth, BarMeter.HEIGHT);
// 			this.parts["emptyShape"].setDimensions(emptyWidth, BarMeter.HEIGHT);
// 			this.parts["emptyShape"].getPosition().setX(this.parts["fullShape"].getPosition().x + fullWidth);
//         },
// 	}, {
// 		getClassName: function() { return "BarMeter"; },

//         HEIGHT: 3,
//         INT_WIDTH: 9,
// 	});

// 	return BarMeter;
// });

Engine.initObject("CaretMeter", "Meter", function() {
	var CaretMeter = Meter.extend({
		field: null,
        caretSpacing: null,
        highestMax: null,
        onCarets: null,
        offCarets: null,

		constructor: function(field, renderContext, reading, position, caretSpacing, highestMax) {
            this.caretSpacing = caretSpacing;
            this.highestMax = highestMax;
			this.base(field, renderContext, reading, position);
			this.field = field;
		},

        setupCarets: function() {
            this.onCarets = [];
            this.offCarets = [];

            for(var i = 0; i < this.highestMax; i++)
            {
                this.onCarets[i] = this.createCaret("on", i);
                this.offCarets[i] = this.createCaret("off", i);
                this.offCarets[i].getDrawComponent().setDrawMode(RenderComponent.NO_DRAW);

                this.parts[i] = this.onCarets[i];
                this.parts[i].getDrawComponent().setDrawMode(RenderComponent.DRAW);
            }
        },

        updateCarets: function() {
            for(var i = 0; i < this.highestMax; i++)
            {
                var requiredCaret = this.onCarets[i];
                if(i >= this.reading)
                    requiredCaret = this.offCarets[i];

                if(this.parts[i].id != requiredCaret.id)
                {
                    this.parts[i].getDrawComponent().setDrawMode(RenderComponent.NO_DRAW);
                    this.parts[i] = requiredCaret;
                    this.parts[i].getDrawComponent().setDrawMode(RenderComponent.DRAW);
                }
            }
        },

        updatePosition: function(moveX) {
            for(var i in this.onCarets)
            {
			    this.onCarets[i].getPosition().setX(this.onCarets[i].getPosition().x + moveX);
                this.offCarets[i].getPosition().setX(this.offCarets[i].getPosition().x + moveX);
            }
        },
	}, {
		getClassName: function() { return "CaretMeter"; },

	});

	return CaretMeter;
});

Engine.initObject("ImageCaretMeter", "CaretMeter", function() {
	var ImageCaretMeter = CaretMeter.extend({
        imageName: null,

		constructor: function(field, renderContext, reading, position, imageName, caretSpacing, highestMax) {
            this.imageName = imageName;
            this.base(field, renderContext, reading, position, caretSpacing, highestMax);
		},

        createCaret: function(onState, i) {
            var p = Point2D.create(this.pos.x + (i * this.caretSpacing), this.pos.y);
            var imageCaret = ImageCaret.create(this.field, p, this.imageName + onState);
            this.renderContext.add(imageCaret);
            return imageCaret;
        },
	}, {
		getClassName: function() { return "ImageCaretMeter"; },

	});

	return ImageCaretMeter;
});

Engine.initObject("VectorCaretMeter", "CaretMeter", function() {
	var VectorCaretMeter = CaretMeter.extend({
        onColor: null,
        offColor: null,

		constructor: function(field, renderContext, reading, position, caretSpacing, highestMax, onColor, offColor) {
            this.onColor = onColor;
            this.offColor = offColor;
            this.base(field, renderContext, reading, position, caretSpacing, highestMax);
		},

        createCaret: function(onState, i) {
            var p = Point2D.create(this.pos.x + (i * this.caretSpacing), this.pos.y);

            var color = this.onColor;
            if(onState == "off")
                color = this.offColor;

            var caret = VectorCaret.create(this.field, p, color);
            this.renderContext.add(caret);
            return caret;
        },
	}, {
		getClassName: function() { return "VectorCaretMeter"; },

	});

	return VectorCaretMeter;
});

Engine.initObject("Caret", "Mover", function() {
	var Caret = Mover.extend({
		field: null,

		constructor: function(field, position) {
			this.base("Caret");

			this.add(Mover2DComponent.create("move"));
			this.setZIndex(Meter.Z_INDEX);

			this.setPosition(position);
			this.getComponent("move").setCheckLag(false);
            this.setupGraphics();
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
		},

        setupGraphics: function() {
            this.add(ImageComponent.create("draw", null, this.field.imageLoader, this.imageName));
            this.getDrawComponent().setImage(this.imageName);
            this.getDrawComponent().setDrawMode(RenderComponent.NO_DRAW);
        },
	}, {
		getClassName: function() { return "ImageCaret"; },

	});

	return ImageCaret;
});

Engine.initObject("VectorCaret", "Caret", function() {
	var VectorCaret = Caret.extend({
		field: null,
        color: null,

		constructor: function(field, position, color) {
            this.color = color;
			this.base(field, position);
		},

        setupGraphics: function() {
        	this.add(Vector2DComponent.create("draw"));
			var shape = [ new Point2D(0, 0), new Point2D(0, VectorCaret.HEIGHT), new Point2D(VectorCaret.WIDTH, VectorCaret.HEIGHT), new Point2D(VectorCaret.WIDTH, 0)];
			this.getComponent("draw").setPoints(shape);

			this.getComponent("draw").setLineStyle("black");
			this.getComponent("draw").setFillStyle(this.color);
        },
	}, {
		getClassName: function() { return "VectorCaret"; },

        WIDTH: 3,
        HEIGHT: 20,
	});

	return VectorCaret;
});