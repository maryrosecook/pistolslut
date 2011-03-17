Engine.initObject("ImageDisplay", "Mover", function() {
	var ImageDisplay = Mover.extend({
		field: null,

		constructor: function(field, position, spriteNames) {
			this.base("ImageDisplay");
			this.field = field;

			this.add(Mover2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));

            this.setZIndex(Meter.Z_INDEX);

            for(var i in spriteNames)
                this.addSprite(spriteNames[i], this.field.spriteLoader.getSprite(spriteNames[i], "main"));

			this.setSprite(spriteNames[0]);

			this.getComponent("move").setPosition(position);
			this.getComponent("move").setCheckLag(false);
		},

		update: function(renderContext, time) {
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},

	}, {
		getClassName: function() { return "ImageDisplay"; },
	});

	return ImageDisplay;
});