Engine.initObject("Launcher", "Base", function() {
	var Launcher = Base.extend({
        id: null,
        name: null,
		timer: null,
        staticRect: null,
        field: null,

		constructor: function(name, field, interval, x, y, width) {
            this.name = name;
            this.field = field;
            this.id = Engine.create(this);
            this.setStaticRect(x, y, width);

            var that = this;
			this.timer = Interval.create(this.name, interval,
		        function() {
                    if(field.inView(that))
                        that.launch();
			});
		},

        // override
        launch: function() { },

        setStaticRect: function(x, y, width) {
            this.staticRect = new CheapRect(null, x, y, x + width, y + 1);
        },

        getName: function() { return this.name },

        release: function() {
            this.base();
            this.staticRect = null;
        },
	}, {
		getClassName: function() { return "Launcher"; },
	});

	return Launcher;
});