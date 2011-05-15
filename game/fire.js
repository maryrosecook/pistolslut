Engine.initObject("Fire", "Launcher", function() {
	var Fire = Launcher.extend({
        width: null,

		constructor: function(name, field, x, y, width) {
            this.base(name, field, Fire.INTERVAL, x, y, width);
            this.width = width;
        },

        launch: function() {
            this.field.pEngine.addParticle(FireParticle.create(this.staticRect.x, this.staticRect.y, this.width, Fire.FIRE_PARTICLE_TTL));
        },
	}, {
		getClassName: function() { return "Fire"; },

        FIRE_PARTICLE_TTL: 250,
        INTERVAL: 10,
	});

	return Fire;
});