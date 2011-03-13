Engine.initObject("FireworkLauncher", "Base", function() {
	var FireworkLauncher = Base.extend({
		launchTimer: null,
        staticRect: null,

		constructor: function(name, field, renderContext, x, y, angle, spread, interval) {
            this.staticRect = new CheapRect(null, x, y, x + 1, y + 1);

			this.launch(name, field, renderContext, x, y, angle, spread); // initial launch

			// setup launch timer
			var fireworkLauncher = this;
			this.contrailTimer = Interval.create(name, interval,
				function() {
					if(field.inView(fireworkLauncher))
						fireworkLauncher.launch(name + "firework", field, renderContext, x, y, angle, spread);
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