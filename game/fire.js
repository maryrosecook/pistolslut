Engine.initObject("Fire", "Base", function() {
	var Fire = Base.extend({
		x: 0,
		y: 0,
		width: 0,
		
		fireTimer: null,
		sparkInterval: 5,
		
		constructor: function(name, field, x, y, width) {
			this.x = x;
			this.y = y;
			this.width = width;
			var maxTTL = 250;
			
			var fire = this;
			this.fireTimer = Interval.create(this.name, this.sparkInterval,
				function() {
					if(field.inView(fire))
						field.pEngine.addParticle(FireParticle.create(x, y, width, maxTTL));
			});
		},
		
		getPosition: function() { return Point2D.create(this.x, this.y); },
		getBoundingBox: function() { return new Rectangle2D(this.x, this.y, this.width, 1); },
		
	}, {
		getClassName: function() { return "Fire"; },
	});

	return Fire;
});