// Load required engine components
Engine.include("/rendercontexts/context.canvascontext.js");
Engine.include("/rendercontexts/context.scrollingbackground.js");
Engine.include("/spatial/container.spatialgrid.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/textrender/text.vector.js");
Engine.include("/textrender/text.renderer.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/resourceloaders/loader.level.js");

// Load game objects
Game.load("/player.js");
Game.load("/bullet.js");
Game.load("/particle.js");
Game.load("/sign.js");
Game.load("/furnishedlevel.js");
Game.load("/furniture.js");
Game.load("/collider.js");

Engine.initObject("Spaceroids", "Game", function() {

	/**
	 * @class The game.
	 */
	var Spaceroids = Game.extend({

		constructor: null,

		renderContext: null,

		fieldBox: null,
		centerPoint: null,
		areaScale: $.browser.Wii ? 0.7 : 0.93,

		engineFPS: 30,

		collisionModel: null,
		collider: null,
	
		snowTimer: null,
		snowFallRate: 0,
		snowFallInterval: 100,
		groundY: 500,
	
		fieldWidth: 500,
		fieldHeight: 580,
		level: null,
	
		debug: true,
		playerObj: null,

		showStart: false,

		pEngine: null,

		spriteLoader: null,
		levelLoader: null,
		loadTimeout: null,
	
		gravityVector: Vector2D.create(0, 0.6),
		gravityTimer: null,
		gravityInterval: 100,
	
		bullets: 0,
	
		/**
		 * Called to set up the game, download any resources, and initialize
		 * the game to its running state.
		 */
		setup: function() {
			$("#loading").remove();

			// Set the FPS of the game
			Engine.setFPS(this.engineFPS);
		
			// Create the 2D context
			this.fieldBox = Rectangle2D.create(0, 0, this.fieldWidth, this.fieldHeight);
			this.centerPoint = this.fieldBox.getCenter();
		
			// We'll need something to detect collisions
			this.collisionModel = SpatialGrid.create(this.fieldWidth, this.fieldHeight, 5);
			this.collider = new Collider(this);
		
			this.spriteLoader = SpriteLoader.create();
			this.levelLoader = FurnishedLevelLoader.create("FurnishedLevelLoader", this.spriteLoader);
		
			// load sprite resources
			this.spriteLoader.load("girl", this.getFilePath("resources/girl.js"));

			// load level resources
			this.levelLoader.load("level1", this.getFilePath("resources/level1.js"));
		
			// Don't start until all of the resources are loaded
			Spaceroids.loadTimeout = Timeout.create("wait", 250, Spaceroids.waitForResources);
			this.waitForResources();
		},
	
		play: function() {
			var pWidth = this.fieldWidth;
			var pHeight = this.fieldHeight;
		
	    this.level = Spaceroids.levelLoader.getLevel("level1");

			this.renderContext = ScrollingBackground.create("bkg", this.level, this.fieldWidth, this.fieldHeight);		
			this.renderContext.setWorldScale(this.areaScale);
			this.renderContext.setBackgroundColor("#000000");
			Engine.getDefaultContext().add(this.renderContext);
		
			this.playerObj = SpaceroidsPlayer.create();
			this.renderContext.add(this.playerObj);
			this.playerObj.setup(pWidth, pHeight);
		
			this.level.addObjects(this.renderContext);
		
			// Start up the particle engine
			this.pEngine = ParticleEngine.create();
			this.renderContext.add(this.pEngine);

			this.loadSigns();
				
			//snow machine
			Spaceroids.snowTimer = Interval.create("snow", this.snowFallInterval,
				function() {
					Spaceroids.pEngine.addParticle(SnowParticle.create(Spaceroids.level.getWidth()));
			});
		
			// gravity machine
			Spaceroids.gravityTimer = Interval.create("gravity", this.gravityInterval,
				function() {
					Spaceroids.applyGravity(Spaceroids.playerObj);
			});
		},
	
		applyGravity: function(obj) {
			if(!this.collider.colliding(obj, this.level.furniture))
				obj.velocity = obj.velocity.add(this.gravityVector);
		},
		
	  waitForResources: function(){
			if (Spaceroids.spriteLoader.isReady() && Spaceroids.levelLoader.isReady())
			{
				Spaceroids.loadTimeout.destroy();
				Spaceroids.play();
				return;
		  }
		  else
		  	Spaceroids.loadTimeout.restart();
	  },

		// load signs from the current level
		signLetterSpacing: 7,
		signColor: "#ff0000",
		loadSigns: function() {
			var signs = this.level.levelResource.info.objects.signs;
			for(var i in signs)
			{
				var signData = signs[i];
				var sign = new Sign(this.renderContext, signData.text, this.signColor, Point2D.create(signData.x, signData.y), signData.width, this.signLetterSpacing);	
				this.renderContext.add(sign);
			}
		},

		/**
		 * Called when the game is being shut down to allow the game
		 * the chance to clean up any objects, remove event handlers, and
		 * destroy the rendering context.
		 */
		teardown: function() {
			this.renderContext.destroy();
		},

		/**
		 * A simple method that determines if the position is within the supplied bounding
		 * box.
		 *
		 * @param pos {Point2D} The position to test
		 * @param bBox {Rectangle2D} The bounding box of the field
		 * @type Boolean
		 */
		inLevel: function(pos) {
			return Math2D.boxPointCollision(this.level.getFrame(), pos);
		},
	
		// updates the position of the view frame
		updateFramePosition: function(vector, centralObj) {
			var centralObjWindowX = centralObj.getRenderPosition().x;
			var minScroll = 0;
			var maxScroll = this.level.getWidth() - this.fieldWidth;
			var potentialNewHorizontalScroll = this.renderContext.getHorizontalScroll() + vector.x;

			var movingPastCentrePoint = false;
			if(vector.x > 0 && centralObjWindowX > this.centerPoint.x)
				movingPastCentrePoint = true;
			else if(vector.x < 0 && centralObjWindowX < this.centerPoint.x)
				movingPastCentrePoint = true;
			
			if(movingPastCentrePoint && potentialNewHorizontalScroll >= minScroll && potentialNewHorizontalScroll <= maxScroll)
				this.renderContext.setHorizontalScroll(potentialNewHorizontalScroll);
		},

	});

	return Spaceroids;
});
