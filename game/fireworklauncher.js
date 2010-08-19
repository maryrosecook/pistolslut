Engine.initObject("FireworkLauncher", "Base", function() {
	var FireworkLauncher = Base.extend({
		launchTimer: null,

		constructor: function(name, field, renderContext, x, y, angle, spread, interval) {
			this.launch(name, field, renderContext, x, y, angle, spread); // initial launch
			
			// setup launch timer
			var fireworkLauncher = this;
			this.contrailTimer = Interval.create(name, interval,
				function() {
					fireworkLauncher.launch(name, field, renderContext, x, y, angle, spread);
			});
		},
		
		launch: function(name, field, renderContext, x, y, angle, spread) {
			var launchAngle = (angle - (spread / 2)) + (Math.random() * spread);
			var firework = new Firework(name, field, x, y, launchAngle);	
			renderContext.add(firework);
		},

	}, {
		
		getClassName: function() { return "FireworkLauncher"; },
	});

	return FireworkLauncher;
});