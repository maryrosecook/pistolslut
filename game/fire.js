Engine.initObject("Fire", "Base", function() {
	var Fire = Base.extend({
		fireTimer: null,

		sparkInterval: 5,
		
		constructor: function(name, field, x, y, width) {
			var maxTTL = 250;
			this.fireTimer = Interval.create(this.name, this.sparkInterval,
				function() {
					field.pEngine.addParticle(FireParticle.create(x, y, width, maxTTL));
			});
		},
		
	}, {
		getClassName: function() { return "Fire"; },
	});

	return Fire;
});