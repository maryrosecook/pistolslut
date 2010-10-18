Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Parallax", "Mover", function() {
	// a parallax scrolling facade in the level.
	var Parallax = Mover.extend({

		name: null,
		field: null,
		scrollAttenuation: null,
		
		constructor: function(name, field, zIndex, scrollAttenuation, x, y) {
			this.base(name);
			this.field = field;
			this.setZIndex(zIndex);
			this.scrollAttenuation = scrollAttenuation;

			// Add components to move and draw
			this.add(Transform2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));
			
			this.addSprite("main", this.field.spriteLoader.getSprite(name, "main"));
			this.setSprite("main");
			
			this.setPosition(Point2D.create(x,y));
		},

		update: function(renderContext, time) {
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},

	}, {
		getClassName: function() { return "Parallax"; },
		
		START_Z_INDEX: 3,
	});

	return Parallax;
});