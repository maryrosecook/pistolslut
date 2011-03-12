Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Physics", "Base", function() {
	var Physics = Base.extend({
		field: null,

		constructor: function(field) {
			this.field = field;
		},

		handleBounce: function(bouncer, obj, count) {
            if(count == null)
                count = 0;
			if(this.field.collider.objsColliding(bouncer, obj) == true)
			{
                var sideHit = this.field.collider.sideHit(bouncer, obj);
				if(sideHit !== null)
				{
                    this.field.collider.moveToEdge(bouncer, obj, sideHit);
                    bouncer.stopSweeping();
					bouncer.setVelocity(this.bounce(bouncer.getVelocity(), bouncer.bounciness, sideHit));
                    return ColliderComponent.STOP;
				}
				else if(count > 100)
                    return ColliderComponent.CONTINUE;
                else
				{
                    count += 1;
					bouncer.sweepPosition();
					return this.handleBounce(bouncer, obj);
				}
			}

			return ColliderComponent.CONTINUE;
		},

		// bounce a grenade
		bounce: function(vector, bounciness, sideHit) {
			if(sideHit == Collider.TOP || sideHit == Collider.BOTTOM) return Vector2D.create(vector.x * bounciness, -vector.y * bounciness);
			if(sideHit == Collider.LEFT || sideHit == Collider.RIGHT) return Vector2D.create(-vector.x * bounciness, vector.y * bounciness);
		},

		// take moving object and return angle of movement in opposite direction
		reverseAngle: function(movingObj, sideHit) {
			var vector = movingObj.getVelocity().normalize();
			var surfaceNormal = this.getSurfaceNormal(sideHit);
			var d = vector.angleBetween(surfaceNormal);
			return this.adjustForSide(d, sideHit);
		},

		speed: function(velocity) {
			if(velocity.x > 0 || velocity.y > 0)
				return Math.sqrt((velocity.x * velocity.x) + (velocity.y * velocity.y));
			else
				return 0;
		},

		getSurfaceNormal: function(side) {
			if(side == Collider.LEFT)
				return Vector2D.create(-1, 0);
			else if(side == Collider.RIGHT)
				return Vector2D.create(1, 0);
			else if(side == Collider.TOP)
				return Vector2D.create(0, -1);
			else if(side == Collider.BOTTOM)
				return Vector2D.create(0, 1);
		},

		adjustForSide: function(angleBetween, sideHit) {
			if(sideHit == Collider.LEFT)
				return angleBetween + 90;
			else if(sideHit == Collider.RIGHT)
				return angleBetween - 90;
			else if(sideHit == Collider.TOP)
				return angleBetween + 180;
			else if(sideHit == Collider.BOTTOM)
				return angleBetween;
		},

	}, {

		getClassName: function() { return "Physics"; },
	});

	return Physics;
});