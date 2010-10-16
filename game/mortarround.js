Engine.initObject("MortarRound", "Ordinance", function() {
	var MortarRound = Ordinance.extend({
		damage: 0,
		
		constructor: function(weapon, projectileBaseSpeed, projectileVelocityVariability) {
			this.base("MortarRound", weapon, projectileBaseSpeed, projectileVelocityVariability, MortarRound.SHAPE);
		},

		update: function(renderContext, time) {
			this.field.applyGravity(this);
			this.base(renderContext, time);
		},

		onCollide: function(obj) {
			if(obj instanceof Furniture) {
				if(new CheapRect(this).isIntersecting(new CheapRect(obj)))
			  {
					this.explode(obj);
					return ColliderComponent.STOP;
				}
			}
			else if(obj instanceof Human) {
				if(obj.isAlive())
				{	
					if(new CheapRect(this).isIntersecting(new CheapRect(obj)))
				  {
						this.field.notifier.post(Human.SHOT, this);
						this.explode(obj);
						return ColliderComponent.STOP;
					}
				}
			}
			return ColliderComponent.CONTINUE;
		},
		
		shrapnelCount: 30,
		shrapnelTTL: 500,
		explode: function(objHit) {
			var positionData = this.field.collider.pointOfImpact(this, objHit);
			var explosionEpicenter = null;
			if(positionData != null)
				var explosionEpicenter = Point2D.create(positionData[0].x, positionData[0].y)

			for(var x = 0; x < this.shrapnelCount; x++)
				this.field.renderContext.add(Shrapnel.create(this.field, this.shooter, explosionEpicenter, this.shrapnelTTL));

			this.destroy();
		},

	}, {
		getClassName: function() { return "MortarRound"; },
		
		SHAPE: [ new Point2D(-1, -1), new Point2D(1, -1), new Point2D(-1,  1), new Point2D(1,  1)],
	});

	return MortarRound;
});