Engine.include("/components/component.mover2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Caret", "Mover", function() {
	var Caret = Mover.extend({
		meter: null,
		number: null,
		color: null,
		onColor: null,
		
		constructor: function(meter, number, onColor) {
			this.base("Caret");				
			this.meter = meter;
			this.number = number;
			this.onColor = onColor;
			
			this.add(Mover2DComponent.create("move"));
			this.add(Vector2DComponent.create("draw"));
			
			this.getComponent("draw").setPoints(Caret.SHAPE);
			this.setDrawMode(RenderComponent.NO_DRAW);
			this.updatePosition();
			
      this.setZIndex(1000);
			
			this.getComponent("move").setCheckLag(false);
		},
		
		update: function(renderContext, time) {
      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();
		},
		
		updatePosition: function() {
			this.setPosition(Point2D.create(this.meter.pos.x + (this.meter.caretSeparationX * this.number), this.meter.pos.y));
		},
		
		switchOn: function() { this.setState(this.onColor); },
		switchOff: function() { this.setState(Caret.COLOR_OFF); }, 
		setState: function(color) {
			if(this.color != color)
			{
				this.color = color;				
				this.getComponent("draw").setLineStyle(this.color);
				this.getComponent("draw").setFillStyle(this.color);
			}
		},
		
		setDrawMode: function(drawMode) { this.getComponent("draw").setDrawMode(drawMode); }

	}, {
		getClassName: function() { return "Caret"; },
		
		SHAPE: [ new Point2D(0, 0), 
						 new Point2D(3, 0),
						 new Point2D(3, 10),
						 new Point2D(0, 10),

					 ],
		COLOR_OFF: "#000",
	});

	return Caret;
});