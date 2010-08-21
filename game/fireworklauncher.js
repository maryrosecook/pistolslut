Engine.initObject("FireworkLauncher", "Base", function() {
	var FireworkLauncher = Base.extend({
		launchTimer: null,
		x: 0,
		y: 0,

		constructor: function(name, field, renderContext, x, y, angle, spread, interval) {
			this.x = x;
			this.y = y;
			this.launch(name, field, renderContext, x, y, angle, spread); // initial launch
			
			// setup launch timer
			var fireworkLauncher = this;
			this.contrailTimer = Interval.create(name, interval,
				function() {
					if(field.inView(fireworkLauncher))
						fireworkLauncher.launch(name, field, renderContext, x, y, angle, spread);
			});
		},
		
		launch: function(name, field, renderContext, x, y, angle, spread) {
			var launchAngle = (angle - (spread / 2)) + (Math.random() * spread);
			var firework = new Firework(name, field, x, y, launchAngle);	
			renderContext.add(firework);
		},
		
		getPosition: function() { return Point2D.create(this.x, this.y); },
		getBoundingBox: function() { return new Rectangle2D(this.x, this.y, 1, 1); },
		
	}, {
		
		getClassName: function() { return "FireworkLauncher"; },
	});

	return FireworkLauncher;
});