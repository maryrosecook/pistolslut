Engine.initObject("CheapRect", "Base", function() {
	var CheapRect = Base.extend({
		x: null,
		y: null,
		r: null,
		b: null,

		constructor: function(obj) {
			var pos = obj.getPosition();
			var bboxDims = obj.getBoundingBox().dims;
			this.x = pos.x;
			this.y = pos.y;
			this.r = this.x + bboxDims.x;
			this.b = this.y + bboxDims.y;
		},
	
		isIntersecting: function(rect) {
			return !(this.r < rect.x ||
						this.x > rect.r ||
						this.y > rect.b ||
						this.b < rect.y);
		},

	}, {

		getClassName: function() {
			return "CheapRect";
		},
	});

	return CheapRect;
});