Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Lift", "Mover", function() {
	var Lift = Mover.extend({
		field: null,

		speed: null,
		startPosition: null,
		distance: null,
		moving: false,

		constructor: function(field, startPosition, distance, width) {
			this.base("Lift");
			this.field = field;
			this.startPosition = startPosition;
			this.distance = distance;

			// Add components to move and draw
			this.add(Mover2DComponent.create("move"));
			this.add(Vector2DComponent.create("draw"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));

			var drawer = this.getComponent("draw");
		    var shape = [new Point2D(0, 0), new Point2D(width, 0), new Point2D(width, 10), new Point2D(0, 10)];
			drawer.setPoints(shape);
			drawer.setFillStyle("#000");
			drawer.setLineStyle("#000");

			var mover = this.getComponent("move");
			mover.setPosition(startPosition);
			mover.setVelocity(Vector2D.create(0, 0));
			mover.setCheckLag(false);

			this.startMoving();
		},

		update: function(renderContext, time) {
            if(!this.field.inView(this))
                return;

		    if(this.moving == true)
			    this.handlePossibleChangeOfDirection();

			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},

		handlePossibleChangeOfDirection: function() {
			if(this.getPosition().y <= this.startPosition.y - this.distance) // at top
			{
				this.getPosition().setY(this.startPosition.y - this.distance);
				this.getVelocity().setY(Lift.SPEED); // going down
			}
			else if(this.getPosition().y >= this.startPosition.y) // at bottom
			{
				this.getPosition().setY(this.startPosition.y);
				this.getVelocity().setY(-Lift.SPEED); // going up
			}
		},

		startMoving: function() { this.moving = true; },
		stopMoving: function() { this.moving = false; },

		onCollide: function(obj) {
			if(obj instanceof Human || obj instanceof Barrel) {
					if(this.field.collider.objsColliding(this, obj))
				    {
						if(this.field.collider.aFallingThroughB(obj, this))
							obj.setOnLift(this);

						return ColliderComponent.STOP;
					}
			}
			return ColliderComponent.CONTINUE;
		},

		getStandY: function(obj) { return this.getPosition().y - obj.getBoundingBox().dims.y; },
	}, {
		getClassName: function() { return "Lift"; },

		SPEED: 3,
	});

	return Lift;
});