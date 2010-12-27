Engine.initObject("JsonLoader", "RemoteLoader", function() {
	var JsonLoader = RemoteLoader.extend({
        jsons: [],

		constructor: function() {
			this.base("JsonLoader");
		},

		load: function(name, url, info, path) {
			if (url)
			{
				var loc = window.location;
				if (url.indexOf(loc.protocol) != -1 && url.indexOf(loc.host) == -1) {
					Assert(false, "Files must be located on this server");
				}

				var thisObj = this;

				// Get the file from the server
				$.get(url, function(data) {
					var info = EngineSupport.evalJSON(data);
					// get the path to the resource file
					var path = url.substring(0, url.lastIndexOf("/"));
					thisObj.load(name, null, info, path + "/");
				});
			}
			else
			{
				this.jsons[name] = info;
                this.base(name, info);

                // pause for a bit and assume json loaded afterwards
                thisObj = this;
                OneShotTimeout.create("readyJsonGuy", 2500, function() {
                    thisObj.setReady(name, true);
                });
			}
		},

        get: function(name) {
            return this.jsons[name];
        },

		getResourceType: function() { return "json"; }
	}, {

		getClassName: function() { return "JsonLoader"; }
	});

	return JsonLoader;
});