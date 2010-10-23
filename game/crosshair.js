Engine.include("/components/component.mover2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Crosshair", "Mover", function() {
	var Crosshair = Mover.extend({
		field: null,
		shooter: null,
		projectileSpeed: null,
		groundY: null,
		
		constructor: function(field, shooter, projectileSpeed, groundY) {
			this.base("Crosshair");
			this.field = field;
			this.shooter = shooter;
			this.projectileSpeed = projectileSpeed;
			this.groundY = groundY;

			this.add(Mover2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));
			
			this.setZIndex(Crosshair.Z_INDEX);
			
			this.addSprite("main", this.field.spriteLoader.getSprite("crosshair.gif", "main"));
			this.setSprite("main");
			
			c_mover.setCheckLag(false);
		},

		started: null,
		startCross: function() {
			this.started = new Date().getTime();
			this.setDrawMode(RenderComponent.DRAW);
		},
		
		stopCross: function() {
			this.started = null;
			this.setDrawMode(RenderComponent.NO_DRAW);
		},

		update: function(renderContext, time) {
			var angle = this.calculateCurrentAngle();
			if(distanceFromShooter > Crosshair.MAX_RANGE)
				this.stopCross();
			else
			{
				renderContext.pushTransform();
				this.setPosition(this.generatePosition(distanceFromShooter));
				this.base(renderContext, time);
				renderContext.popTransform();
			}
		},
		
		generatePosition: function(distanceFromShooter) {
			if(this.shooter.direction == Human.LEFT)
				return Point2D.create(this.shooter.getPosition().x - distanceFromShooter, Crosshair.Y);
			else
				return Point2D.create(this.shooter.getPosition().x + distanceFromShooter, Crosshair.Y);
		},

		calculateCurrentAngle: function() {
			var now = new Date().getTime();
			var startAndEnd = Crosshair.COORDINATES[this.shooter.direction];
			return startAndEnd["a"] + (startAndEnd["a"] - startAndEnd["b"] * (now - this.started / 100));
		},
		
		angleToVector: function(angle) { return Math2D.getDirectionVector(Point2D.ZERO, Crosshair.TIP, angle); },
		calculateCurrentVector: function(angle) { return this.angleToVector(angle).mul(this.projectileSpeed); },
				
		calculateDistanceFromShooter: function() {
			var currentVector = this.calculateCurrentVector();
			var testPos = Point2D.create(this.shooter.getPosition());
			while(testPos.y < this.groundY)
			{
				currentVector.add(this.field.gravityVector)
				testPos.add(currentVector);
			}
				
			return testPos.x;
		},
		
	}, {
		getClassName: function() { return "Crosshair"; },

		Z_INDEX: 1000,
		Y: 395,
		TIP: new Point2D(0, -1),
		COORDINATES: {
			"Left": { "a": 330, "b": 300},
			"Right": { "a": 30, "b": 60},
		},
	});

	return Crosshair;
});