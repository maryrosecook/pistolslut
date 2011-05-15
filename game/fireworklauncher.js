Engine.initObject("FireworkLauncher", "Launcher", function() {
	var FireworkLauncher = Launcher.extend({
		launchTimer: null,
        renderContext: null,

		constructor: function(name, field, renderContext, x, y) {
            this.base(name, field, FireworkLauncher.INTERVAL, x, y, 1);
            this.renderContext = renderContext;
        },

		launch: function() {
			var launchAngle = (FireworkLauncher.ANGLE - (FireworkLauncher.SPREAD / 2)) + (Math.random() * FireworkLauncher.SPREAD);
			var firework = new Firework("firework", this.field, this.staticRect.x, this.staticRect.y, launchAngle);
			this.renderContext.add(firework);
		},

	}, {
		getClassName: function() { return "FireworkLauncher"; },

        INTERVAL: 3000,
        ANGLE: 0,
        SPREAD: 20,
	});

	return FireworkLauncher;
});