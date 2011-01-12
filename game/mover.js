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
            this.oldVelocity = null;
		},

	    setSprite: function(spriteKey) {
			if(spriteKey != this.currentSpriteKey)
			{
                //console.log(spriteKey)
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
        oldVelocity: null,
		sweepPosition: function() {
            var position = this.getPosition();
			if(position.x > 0 && position.y > 0)
			{
                if(!this.isSweeping())
                {
                    this.oldVelocity = Vector2D.create(this.getVelocity());
                    this.setVelocity(Vector2D.create(0,0));
                }

				this.getPosition().setX(position.x - (this.oldVelocity.x / Mover.SWEEP_DIVISIONS));
				this.getPosition().setY(position.y - (this.oldVelocity.y / Mover.SWEEP_DIVISIONS));
			}
		},

        isSweeping: function() { return this.oldVelocity !== null; },
        stopSweeping: function() {
            if(this.isSweeping())
            {
                this.setVelocity(this.oldVelocity);
                this.oldVelocity = null;
            }
        },

		getRenderPosition: function() { return this.getComponent("move").getRenderPosition(); },
		getLastPosition: function() { return this.getComponent("move").getLastPosition(); },
        setLastPosition: function(point) { this.getComponent("move").lastPosition.set(point); },

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

		SWEEP_DIVISIONS: 5,
	});

	return Mover;
});