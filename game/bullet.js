Engine.initObject("Bullet", "Ordinance", function() {
	var Bullet = Ordinance.extend({
		damage: 1,
		safeDistance: 30,

		constructor: function(weapon) {
			this.base(weapon);
            this.field.notifier.post(AIComponent.SOUND, this);
		},

		setupGraphics: function() {
			this.add(Vector2DComponent.create("draw"));
			var c_draw = this.getComponent("draw");
			c_draw.setPoints(Bullet.SHAPE);
			c_draw.setLineStyle("white");
			c_draw.setFillStyle("white");
		},

		update: function(renderContext, time) {
			this.base(renderContext, time);
		},

		onCollide: function(obj) {
			if(obj instanceof Furniture) {
				if(this.field.collider.objsColliding(this, obj))
			  {
					obj.shot(this);
					this.destroy();
					return ColliderComponent.STOP;
				}
			}
			else if(obj instanceof Human) {
				if(obj.isAlive() || obj.isDying())
				{
					if(this.field.collider.objsColliding(this, obj))
				    {
						obj.shot(this);
						this.destroy();
						return ColliderComponent.STOP;
					}
				}
			}
			return ColliderComponent.CONTINUE;
		},
	}, {
		getClassName: function() { return "Bullet"; },

		SHAPE: [ new Point2D(0, 0), new Point2D(1, 0), new Point2D(0,  1), new Point2D(1,  1)],
	});

	return Bullet;
});