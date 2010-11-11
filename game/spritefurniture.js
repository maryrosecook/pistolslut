Engine.initObject("SpriteFurniture", "Furniture", function() {
	var SpriteFurniture = Furniture.extend({
		
		constructor: function(spriteName, position) {
			this.base(spriteName, position);
			this.setupGraphics(spriteName);
		},
		
		setupGraphics: function(spriteName) {
			this.add(SpriteComponent.create("draw"));
			this.addSprite("main", this.field.spriteLoader.getSprite(spriteName, "main"));
			this.setSprite("main");
		},
	}, {
		getClassName: function() { return "SpriteFurniture"; },
		
	});

	return SpriteFurniture;
});