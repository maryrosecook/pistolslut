Engine.initObject("Fire", "Base", function() {
	var Fire = Base.extend({
		x: 0,
		y: 0,
		width: 0,
		
		fireTimer: null,
		fireExtinguishTimer: null,
		sparkInterval: 10,
		
		constructor: function(name, field, x, y, width) {
			this.x = x;
			this.y = y;
			this.width = width;
			var maxTTL = 250;
						
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
		
		getPosition: function() { return Point2D.create(this.x, this.y); },
		getBoundingBox: function() { return new Rectangle2D(this.x, this.y, this.width, 1); },
		
	}, {
		getClassName: function() { return "Fire"; },
		
	});

	return Fire;
});