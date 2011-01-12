Engine.initObject("CheapRect", "Base", function() {
	var CheapRect = Base.extend({

		constructor: function(obj, x, y, r, b) {
			if(obj != null)
			{
				var pos = obj.getPosition();
				var bboxDims = obj.getBoundingBox().dims;
				this.x = pos.x;
				this.y = pos.y;
				this.r = this.x + bboxDims.x;
				this.b = this.y + bboxDims.y;
			}
			else
			{
				this.x = x;
				this.y = y;
				this.r = r;
				this.b = b;
			}
		},

		isIntersecting: function(rect) {
			return !(this.r < rect.x ||
						this.x > rect.r ||
						this.y > rect.b ||
						this.b < rect.y);
		},

        get: function() { return this; },

	}, {
		getClassName: function() { return "CheapRect"; },

	});

	return CheapRect;
});