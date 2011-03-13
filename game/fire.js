Engine.initObject("Fire", "Base", function() {
	var Fire = Base.extend({
		fireTimer: null,
		fireExtinguishTimer: null,
		sparkInterval: 10,
        staticRect: null,

		constructor: function(name, field, x, y, width) {
            this.staticRect = new CheapRect(null, x, y, x + width, y + 1);
			var maxTTL = Fire.FIRE_PARTICLE_TTL;

			this.fireTimer = Interval.create(this.name, this.sparkInterval,
				function() {
					field.pEngine.addParticle(FireParticle.create(x, y, width, maxTTL));
			});

			var fire = this;
			this.fireExtinguishTimer = Interval.create(this.name + "Extinguish", 2000,
				function() {
					if(!field.inView(fire))
					{
						fire.fireTimer.cancel();
						fire.fireExtinguishTimer.cancel();
					}
			});
		},
	}, {
		getClassName: function() { return "Fire"; },

        FIRE_PARTICLE_TTL: 250,
	});

	return Fire;
});