Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Furniture", "Mover", function() {

	/**
	 * @class A piece of furniture in the level.
	 */
	var Furniture = Mover.extend({
		name: null,
		field: null,

		constructor: function(name, position) {
			this.base(name);
			this.field = PistolSlut;

			// Add components to move and draw
			this.add(Transform2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));
			
			this.addSprite("main", this.field.spriteLoader.getSprite(name, "main"));
			this.setSprite("main");
			
			this.setPosition(position);
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
			var position = null;
			if(positionData != null)
				var position = Point2D.create(positionData[0].x, positionData[0].y)

			if(position)
			{
				var particles = [];
				
				var sideHit = positionData[1];
				var reversedAngle = this.field.physics.reverseAngle(projectile, sideHit);
				for(var x = 0; x < this.ricochetParticleCount; x++)
				{
					particles[x] = BurnoutParticle.create(position, reversedAngle, this.ricochetFlashSpread, this.ricochetParticleTTL);
				}
					
				this.field.pEngine.addParticles(particles);
			}
		},

	}, {
		getClassName: function() { return "Furniture"; },
		
	});

	return Furniture;
});