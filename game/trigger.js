Engine.initObject("Trigger", "Base", function() {
	var Trigger = Base.extend({
		obj: null,
		triggerFunctionName: null,
		
		constructor: function(triggerFunctionName, obj) {
			this.triggerFunctionName = triggerFunctionName;
			this.obj = obj;
		},

		trigger: function() {
			var f = this.obj[this.triggerFunctionName];
			f.call(this.obj); // call specified trigger function on this trigger's obj
		},

	}, {
		getClassName: function() { return "Trigger"; },
		
	});

	return Trigger;
});