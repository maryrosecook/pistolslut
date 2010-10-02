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
		},

		destroy: function() {
			if (this.ModelData && this.ModelData.lastNode) {
				this.ModelData.lastNode.removeObject(this);
			}
			this.base();
		},

	  setSprite: function(spriteKey) {
			if(spriteKey != this.currentSpriteKey)
			{
				var heightAdjustment = null;
			  var newSprite = this.sprites[spriteKey];
	
				if(this.currentSpriteKey != null)
				{
					var heightAdjustment = this.getSprite().getBoundingBox().dims.y - newSprite.getBoundingBox().dims.y;
					if(heightAdjustment != 0)
						this.getPosition().setY(this.getPosition().y + heightAdjustment);
				}
			
			  this.setBoundingBox(newSprite.getBoundingBox());
			  this.getComponent("draw").setSprite(newSprite);
		
				this.currentSpriteKey = spriteKey;
				return heightAdjustment;
			}
			return null;
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
	
		release: function() {
			this.base();
			this.sprites = {};
			this.currentSpriteKey = null;
		},
	}, { // Static
		getClassName: function() { return "Mover"; },
		
	});

	return Mover;
});