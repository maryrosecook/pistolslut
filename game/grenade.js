Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Grenade", "Ordinance", function() {
	var Grenade = Ordinance.extend({
		timeThrown: null,
		pinTimer: 3000, // how long the grande takes to explode
		safeDistance: 40,

		constructor: function(weapon) {
			this.base(weapon);
			this.timeThrown = new Date().getTime();
		},

		setupGraphics: function() {
			this.add(SpriteComponent.create("draw"));
			this.addSprite("main", this.field.spriteLoader.getSprite("grenade.gif", "main"));
			this.setSprite("main");
		},

		release: function() {
			this.base();
			this.shooter = null;
			this.timeThrown = null;
		},

		update: function(renderContext, time) {
			if(this.timeThrown + this.pinTimer < new Date().getTime())
			{
				this.explode();
				return;
			}

			this.field.applyGravity(this);
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},

		onCollide: function(obj) {
			if(obj instanceof Furniture || obj instanceof Lift)
				return this.handleBounce(obj);

			return ColliderComponent.CONTINUE;
		},

		getCenter: function(obj) {
			var objCentre = Point2D.create(obj.getPosition());
			objCentre.setX(objCentre.x + (obj.getBoundingBox().dims.x / 2));
			objCentre.setY(objCentre.y + (obj.getBoundingBox().dims.y / 2));
			return objCentre;
		},

		// bounce the grenade
		bounciness: 0.5,
		handleBounce: function(obj) {
			if(this.field.collider.objsColliding(this, obj) == true)
			{
				var pointOfImpactData = this.field.collider.pointOfImpact(this, obj);
				if(pointOfImpactData != null)
				{
					var sideHit = pointOfImpactData[1];
					var collisionPoint = pointOfImpactData[0];
					this.field.collider.moveToEdge(this, collisionPoint, sideHit);
					this.setVelocity(this.field.physics.bounce(this.getVelocity(), this.bounciness, sideHit));

					return ColliderComponent.STOP;
				}
				else
				{
					this.sweepPosition();
					return this.handleBounce(obj);
				}
			}

			return ColliderComponent.CONTINUE;
		},

		shrapnelCount: 30,
		shrapnelTTL: 500,
		explode: function() {
			for(var x = 0; x < this.shrapnelCount; x++)
				this.field.renderContext.add(Shrapnel.create(this.field, this.shooter, this.getPosition(), this.shrapnelTTL));

			this.destroy();
		},
	}, {
		getClassName: function() { return "Grenade"; },

		tip: new Point2D(0, -1),
	});

	return Grenade;
});