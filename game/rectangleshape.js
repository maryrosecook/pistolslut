Engine.include("/components/component.mover2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("RectangleShape", "Mover", function() {
	var RectangleShape = Mover.extend({
		
		constructor: function(color, width, height, position, zIndex) {
			this.base("Shape");				
      
			this.add(Mover2DComponent.create("move"));
			this.add(Vector2DComponent.create("draw"));

			this.setPosition(Point2D.create(position));
			this.setZIndex(zIndex);
			this.setDimensions(width, height);
			this.getComponent("draw").setLineStyle("#000");
			this.getComponent("draw").setFillStyle(color);
			this.getComponent("move").setCheckLag(false);
		},
		
		setDimensions: function(width, height) {
			this.getComponent("draw").setPoints([new Point2D(0, 0),
																					 new Point2D(width, 0),
																					 new Point2D(width, height),
																					 new Point2D(0, height)]);
		},
		
		update: function(renderContext, time) {
      renderContext.pushTransform();
      this.base(renderContext, time);
      renderContext.popTransform();
		},
	}, {
		getClassName: function() { return "RectangleShape"; },
		
	});

	return RectangleShape;
});