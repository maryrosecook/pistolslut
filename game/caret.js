Engine.include("/components/component.mover2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Caret", "Object2D", function() {
	var Caret = Object2D.extend({
		meter: null,
		number: null,
		imageLoader: null,
		caretOnOff: null,
		
		constructor: function(meter, number, imageLoader, caretOnOff) {
			this.base("Caret");				
			this.meter = meter;
			this.number = number;
			this.imageLoader = imageLoader;
			
			this.add(Mover2DComponent.create("move"));
			this.add(ImageComponent.create("draw", this.imageLoader, caretOnOff));
      this.setZIndex(1000);
			
			this.getComponent("move").setCheckLag(false);
		},
		
		update: function(renderContext, time) {
      renderContext.pushTransform();
			this.setPosition(this.generatePosition());
      this.base(renderContext, time);
      renderContext.popTransform();
		},
		
		setState: function(caretOnOff) {
			if(this.caretOnOff != caretOnOff)
			{				
				this.getComponent("draw").setImage(caretOnOff);
				this.caretOnOff = caretOnOff;
			}
		},
		
		generatePosition: function() {
			var caretPosition = new Point2D(this.meter.pos);
			caretPosition.setX(caretPosition.x + (this.meter.caretSeparationX * this.number));
			return caretPosition;
		},

		getPosition: function() { return this.getComponent("move").getPosition(); },
		setPosition: function(position) { 
			this.base(position);
			return this.getComponent("move").setPosition(position);
		},
		
		setDrawMode: function(drawMode) { this.getComponent("draw").setDrawMode(drawMode); }

	}, {
		getClassName: function() { return "Caret"; },
		
		ON: "caretOn",
		OFF: "caretOff"
	});

	return Caret;
});