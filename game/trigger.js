Engine.initObject("Trigger", "Base", function() {
	var Trigger = Base.extend({
		level: null,
		obj: null,
		triggerFunctionName: null,
		xStart: null,
		xEnd: null,
		oneTime: null,

		constructor: function(level, triggerFunctionName, obj, xStart, width, oneTime) {
			this.level = level;
			this.triggerFunctionName = triggerFunctionName;
			this.obj = obj;
			this.xStart = xStart;
			this.xEnd = xStart + width;
			this.oneTime = oneTime;
 		},

		check: function(x) {
			if(x >= this.xStart && x <= this.xEnd)
				this.trigger();
		},

		trigger: function() {
			this.obj[this.triggerFunctionName].call(this.obj); // call specified trigger function on this trigger's obj
			if(this.oneTime == true)
				this.level.removeTrigger(this);
		},

	}, {
		getClassName: function() { return "Trigger"; },

	});

	return Trigger;
});