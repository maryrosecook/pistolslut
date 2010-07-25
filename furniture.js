Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Furniture", "Object2D", function() {

	/**
	 * @class A piece of furniture in the level.
	 */
	var Furniture = Object2D.extend({

		name: null,
		field: null,
		sprite: null,

		constructor: function(name, position) {
			this.base(name);
			this.field = PistolSlut;

			// Add components to move and draw
			this.add(Transform2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));
			
			this.sprite = this.field.spriteLoader.getSprite(name, "main");
			this.setSprite(this.sprite);
			
			this.setPosition(position);
		},

	  setSprite: function(sprite) {
		  this.setBoundingBox(sprite.getBoundingBox());
		  this.getComponent("draw").setSprite(sprite);
	  },

		release: function() {
			this.base();
		},

		getPosition: function() {
			return this.getComponent("move").getPosition();
		},

		setPosition: function(point) {
			this.base(point);
			this.getComponent("move").setPosition(point);
		},

		getRenderPosition: function() {
			return this.getComponent("move").getRenderPosition();
		},

		getLastPosition: function() {
			return this.getComponent("move").getLastPosition();
		},

		update: function(renderContext, time) {
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},
		
		shot: function(bullet) {
			this.particleRicochet(bullet);
		},	
		
		ricochetFlashSpread: 15,
		ricochetParticleCount: 10,
		ricochetParticleTTL: 500,
		particleRicochet: function(bullet) {
			var position = this.field.collider.pointOfImpact(bullet, this)[0];
			var angle = this.field.collider.angleOfImpact(bullet);
			if(position && angle)
				for(var x = 0; x < this.ricochetParticleCount; x++)
					this.field.pEngine.addParticle(RicochetParticle.create(position, angle, this.ricochetFlashSpread, this.ricochetParticleTTL));
		},

	}, {

		getClassName: function() {
			return "Furniture";
		},
	});

	return Furniture;
});