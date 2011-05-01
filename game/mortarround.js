Engine.initObject("MortarRound", "Ordinance", function() {
	var MortarRound = Ordinance.extend({
		damage: 20, // direct hit means dead
		safeDistance: 40,

		constructor: function(weapon) {
			this.base(weapon);
            this.field.notifier.post(AIComponent.SOUND, this);
		},

		update: function(renderContext, time) {
			this.field.applyGravity(this);
			this.base(renderContext, time);
		},

		setupGraphics: function() {
			this.add(Vector2DComponent.create("draw"));
			var c_draw = this.getComponent("draw");
			c_draw.setPoints(MortarRound.SHAPE);
			c_draw.setLineStyle("white");
			c_draw.setFillStyle("white");
		},

		onCollide: function(obj) {
			if(obj instanceof Furniture) {
				if(this.field.collider.objsColliding(this, obj))
			  {
					this.explode(obj);
					return ColliderComponent.STOP;
				}
			}
			else if(obj instanceof Human) {
				if(obj.isAlive())
				{
					if(this.field.collider.objsColliding(this, obj))
				    {
                        obj.shot(this);
						this.explode(obj);
						return ColliderComponent.STOP;
					}
				}
			}
			return ColliderComponent.CONTINUE;
		},

		shrapnelCount: 20,
		shrapnelTTL: 500,
		explode: function(objHit) {
			var positionData = this.field.collider.pointOfImpact(this, objHit);
			var explosionEpicenter = null;
			if(positionData != null)
            {
				var explosionEpicenter = Point2D.create(positionData[0].x, positionData[0].y);
                var spread = 180;
                var a = this.field.physics.getSurfaceNormalAngle(positionData[1]);
            }

			for(var x = 0; x < this.shrapnelCount; x++)
				this.field.renderContext.add(Shrapnel.create(this.field, this.shooter, explosionEpicenter, this.shrapnelTTL, Shrapnel.NO_BOUNCE, spread, a));

			this.destroy();
		},

	}, {
		getClassName: function() { return "MortarRound"; },

		SHAPE: [ new Point2D(0, 0), new Point2D(1, 0), new Point2D(1,  1), new Point2D(0,  1)],
	});

	return MortarRound;
});