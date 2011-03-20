// makes sky lighten and darken
Engine.initObject("Sky", "Base", function() {
	var Sky = Base.extend({
		dayNightCycleTimer: null,
		stage: 0,
		hue: 0,
		currentColor: null,

		transformations: null,
		hueStep: 1,
		dayNightCycleInterval: 1000,

		constructor: function(startColor, transformations, renderContext) {
			this.currentColor = [startColor.substring(0, 1), startColor.substring(2, 3), startColor.substring(4, 5)];
			this.transformations = transformations;

			if(this.transformations != null)
			{
				this.hue = this.transformations[this.stage].start; // get starting hue of starting stage
				var sky = this;
				this.dayNightCycleTimer = Interval.create("dayNightCycle", this.dayNightCycleInterval,
					function() {
						sky.updateSkyColor();
						renderContext.setBackgroundColor(sky.getSkyColor());
				});
			}
		},

		updateSkyColor: function() {
			if(this.hue == this.transformations[this.stage].end) // maybe move to next stage
			{
				if(this.stage == this.transformations.length - 1)
					this.stage = 0;
				else
					this.stage += 1;

				this.hue = this.transformations[this.stage].start;
			}
			else
			{
				for(var i = 0; i < 3; i++)
				{
					if(this.transformations[this.stage].parts.indexOf(i) > -1) // this part of hex is changing
						this.currentColor[i] = this.hue.toString(16);
					else // this part of hex is staying the same
						this.currentColor[i] = this.currentColor[i];
				}

				if(this.transformations[this.stage].start < this.transformations[this.stage].end)
					this.hue += this.hueStep;
				else
					this.hue -= this.hueStep;
			}
		},

		getSkyColor: function() {
			return "#" + this.currentColor[0] + this.currentColor[1] + this.currentColor[2];
		},

	}, {
		getClassName: function() { return "Sky"; },

	});

	return Sky;
});

