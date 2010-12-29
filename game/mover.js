Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Mover", "Object2D", function() {
	var Mover = Object2D.extend({
		field: null,

		sprites: {},
		currentSpriteKey: null,

		constructor: function(name) {
			this.base(name);
			this.field = PistolSlut;
			this.setZIndex(this.field.moverZIndex);
		},

		destroy: function() {
			if(this.ModelData && this.ModelData.lastNode)
			{
				this.ModelData.lastNode.removeObject(this);
				this.ModelData.lastNode = null;
			}
			this.base();
		},

	    setSprite: function(spriteKey) {
			if(spriteKey != this.currentSpriteKey)
			{
			    var newSprite = this.sprites[spriteKey];
				if(this.currentSpriteKey != null)
				{
					var heightAdjustment = this.getSprite().getBoundingBox().dims.y - newSprite.getBoundingBox().dims.y;
					if(heightAdjustment != 0)
						this.getPosition().setY(this.getPosition().y + heightAdjustment);
				}

			    this.setBoundingBox(newSprite.getBoundingBox());
			    this.getComponent("draw").setSprite(newSprite);

				newSprite.play(Engine.worldTime);
				this.currentSpriteKey = spriteKey;
			}
	    },

		getSprite: function() {
			return this.getComponent("draw").getSprite();
		},

		addSprite: function(name, sprite) {
			this.sprites[name] = sprite;
		},

		getPosition: function() { return this.getComponent("move").getPosition(); },
		setPosition: function(point) {
			this.base(point);
			this.getComponent("move").setPosition(point);
		},

		// moves obj back along its recent path in velocity/SWEEP_DIVISIONS increments
		sweepPosition: function() {
            var position = this.getPosition();
			if(position.x > 0 && position.y > 0)
			{
				this.getPosition().setX(position.x - (this.getVelocity().x / Mover.SWEEP_DIVISIONS));
				this.getPosition().setY(position.y - (this.getVelocity().y / Mover.SWEEP_DIVISIONS));
			}
		},

		getRenderPosition: function() { return this.getComponent("move").getRenderPosition(); },
		getLastPosition: function() { return this.getComponent("move").getLastPosition(); },

		getRotation: function() { return this.getComponent("move").getRotation(); },
		setRotation: function(angle) {
			this.base(angle);
			this.getComponent("move").setRotation(angle);
		},

		getScale: function() { return this.getComponent("move").getScale(); },
		setScale: function(scale) {
			this.base(scale);
			this.getComponent("move").setScale(scale);
		},

		getVelocity: function() { return this.getComponent("move").getVelocity(); },
		setVelocity: function(vector) { return this.getComponent("move").setVelocity(vector); },

		// holds obj at passed X
		block: function(newX) {
			if(newX != null)
				this.getPosition().setX(newX);
		},

		release: function() {
			this.base();
			this.sprites = {};
			this.currentSpriteKey = null;
		},
	}, { // Static
		getClassName: function() { return "Mover"; },

		SWEEP_DIVISIONS: 5.0,
	});

	return Mover;
});