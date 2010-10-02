Engine.initObject("Bullet", "Ordinance", function() {
	var Bullet = Ordinance.extend({
		damage: 1,
		
		constructor: function(weapon, projectileVelocityVariability) {
			this.base("Bullet", weapon, Bullet.BASE_SPEED, projectileVelocityVariability, Bullet.SHAPE);
		},

		update: function(renderContext, time) {
			
			this.base(renderContext, time);
		},

		onCollide: function(obj) {
			if(obj instanceof Furniture) {
				if(new CheapRect(this).isIntersecting(new CheapRect(obj)))
			  {
					obj.shot(this);
					this.destroy();
					return ColliderComponent.STOP;
				}
			}
			else if(obj instanceof Human) {
				if(obj.isAlive())
				{	
					if(new CheapRect(this).isIntersecting(new CheapRect(obj)))
				  {
						this.field.notifier.post(Human.SHOT, this);
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
		
		BASE_SPEED: 15,		
		SHAPE: [ new Point2D(-1, 0), new Point2D(0, 0), new Point2D(0,  1), new Point2D(0,  1)],
	});

	return Bullet;
});