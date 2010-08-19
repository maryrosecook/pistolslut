Engine.include("/engine/engine.math2d.js");
Engine.include("/engine/engine.pooledobject.js");
Engine.include("/resourceloaders/loader.image.js");

Engine.initObject("FurnishedLevelLoader", "LevelLoader", function() {
	var FurnishedLevelLoader = LevelLoader.extend(/** @scope FurnishedLevelLoader.prototype */{
		
		spriteLoader: null,
		
		constructor: function(name, spriteLoader) {
			this.base(name || "FurnishedLevelLoader");
			this.spriteLoader = spriteLoader;
		},

		load: function(name, url, info, path) {
			if (url)
			{
				var loc = window.location;
				if (url.indexOf(loc.protocol) != -1 && url.indexOf(loc.host) == -1) {
					Assert(false, "Levels must be located on this server");
				}

				var thisObj = this;

				// Get the file from the server
				$.get(url, function(data) {
					var levelInfo = EngineSupport.evalJSON(data);

					// get the path to the resource file
					var path = url.substring(0, url.lastIndexOf("/"));
					thisObj.load(name, null, levelInfo, path + "/");
				});
			}
			else
			{
				this.base(name, url, info, path); // let the super do its thing
				
				// now load all the sprites for the furniture
				var levelObjects = info.objects;
				for(var i in levelObjects.furniture)
				{
					var furniturePieceData = levelObjects.furniture[i];					
					this.spriteLoader.load(furniturePieceData.name, null, furniturePieceData.sprite, path);
				}
			}
		},

		/**
		 * Get the level resource with the specified name from the cache.  The
		 * object returned contains the bitmap as <tt>image</tt> and
		 * the level definition as <tt>info</tt>.
		 *
		 * @param name {String} The name of the object to retrieve
		 * @return {Object} The level resource specified by the name
		 */
		get: function(name) {
			var level = this.base(name);
			level.furniture = this.levels[name].furniture;
			level.enemies = this.levels[name].enemies;
			return level;
		},

		getLevel: function(levelName, field, fieldWidth) {
			return FurnishedLevel.create(levelName, field, this.get(levelName), fieldWidth);
		},

		/**
		 * The name of the resource this loader will get.
		 * @returns {String} The string "level"
		 */
		getResourceType: function() {
			return "furnishedLevel";
		}

	}, /** @scope FurnishedLevelLoader.prototype */{
		getClassName: function() {
			return "FurnishedLevelLoader";
		}
	});

	return FurnishedLevelLoader;

});

Engine.initObject("FurnishedLevel", "Level", function() {
	
	var FurnishedLevel = Level.extend(/** @scope Level.prototype */{
		
		field: null,
		signs: null,
		furniture: null, // actual furniture objs
		furnitureData: null,
		enemies: null,
		fires: null,
		fireworkLaunchers: null,
		enemiesData: null,
		minScroll: 0,
		maxScroll: null,
		levelResource: null,

	  constructor: function(name, field, levelResource, fieldWidth) {
			var level = this.base(name, levelResource);
			this.field = field;
			this.signs = [];
			this.furniture = [];
			this.enemies = [];
			this.fires = [];
			this.fireworkLaunchers = [];
			this.levelResource = levelResource;
			this.furnitureData = this.levelResource.info.objects.furniture;
			this.enemiesData = this.levelResource.info.objects.enemies;
			this.maxScroll = this.getWidth() - fieldWidth;
			return level;
		},

		addObjects: function(renderContext) {
			this.addFurniture(renderContext);
			this.addEnemies(renderContext);
			this.addSigns(renderContext);
			this.addFires();
			this.addFireworkLaunchers(renderContext);
		},

		// creates Furniture render objects for each piece of furniture loaded from
		// level def file and adds them to the renderContext
		addFurniture: function(renderContext) {
			for(var i in this.furnitureData)
			{
				var furniturePieceData = this.furnitureData[i];
				var furniturePiece = Furniture.create(furniturePieceData.name, Point2D.create(furniturePieceData.x, furniturePieceData.y));
				this.furniture[i] = furniturePiece;
				renderContext.add(furniturePiece);
			}
		},
				
		// creates Enemy render objects for each piece of furniture loaded from
		// level def file and adds them to the renderContext
		addEnemies: function(renderContext) {
			for(var i in this.enemiesData)
			{
				var enemyData = this.enemiesData[i];
				var enemy = Enemy.create(enemyData.name, Point2D.create(enemyData.x, enemyData.y));
				this.enemies[i] = enemy;
				renderContext.add(enemy);
			}
		},

		// load signs from the current level
		signLetterSpacing: 7,
		signColor: "#ff0000",
		addSigns: function(renderContext) {
			var signs = this.levelResource.info.objects.signs;
			for(var i in signs)
			{
				var signData = signs[i];
				this.signs[i] = new Sign(this.field, signData.text, this.signColor, Point2D.create(signData.x, signData.y), signData.width, this.signLetterSpacing);
				renderContext.add(this.signs[i]);
				this.field.notifier.subscribe(Human.CLIP_EMPTY, this.signs[i], this.signs[i].notifyWeaponEmpty);
				this.field.notifier.subscribe(Human.RELOADED, this.signs[i], this.signs[i].notifyReloaded);
				this.field.notifier.subscribe(Weapon.SWITCH, this.signs[i], this.signs[i].notifyWeaponSwitch);
			}
		},
		
		addFires: function() {
			var fires = this.levelResource.info.objects.fires;
			for(var i in fires)
			{
				var fireData = fires[i];
				this.fires[i] = new Fire(fireData.name, this.field, fireData.x, fireData.y, fireData.width);	
			}
		},
		
		addFireworkLaunchers: function(renderContext) {
			var fireworkLaunchers = this.levelResource.info.objects.fireworkLaunchers;
			for(var i in fireworkLaunchers)
			{
				var data = fireworkLaunchers[i];
				this.fireworkLaunchers[i] = new FireworkLauncher(data.name, this.field, renderContext, data.x, data.y, data.angle, data.spread, data.interval);
			}
		},

		release: function() {
			this.base();
			this.furnitureData = null;
			this.enemies = null;
			this.signs = null;
			this.fires = null;
		},

	},{

		getClassName: function() { return "FurnishedLevel"; }
	});

	return FurnishedLevel;
});