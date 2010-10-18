Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Furniture", "Mover", function() {
	var Furniture = Mover.extend({
		field: null,
		rect: null,

		constructor: function(spriteName, position) {
			this.base(spriteName);
			this.field = PistolSlut;

			// Add components to move and draw
			this.add(Transform2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));
			
			this.addSprite("main", this.field.spriteLoader.getSprite(spriteName, "main"));
			this.setSprite("main");
			
			this.setPosition(position);
			this.rect = new CheapRect(this);
		},

		update: function(renderContext, time) {
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},
		
		shot: function(projectile) {
			this.particleRicochet(projectile);
		},
		
		ricochetFlashSpread: 50,
		ricochetParticleCount: 10,
		ricochetParticleTTL: 300,
		particleRicochet: function(projectile) {
			var positionData = this.field.collider.pointOfImpact(projectile, this);
			if(positionData != null)
			{
				var particles = [];
				for(var x = 0; x < this.ricochetParticleCount; x++)
					particles[x] = BurnoutParticle.create(Point2D.create(positionData[0].x, positionData[0].y),
																								this.field.physics.reverseAngle(projectile, positionData[1]), // reversed angle
																								this.ricochetFlashSpread,
																								this.ricochetParticleTTL);
					
				this.field.pEngine.addParticles(particles);
			}
		},

	}, {
		getClassName: function() { return "Furniture"; },
		
	});

	return Furniture;
});