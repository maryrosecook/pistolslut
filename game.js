// Load required engine components
Engine.include("/rendercontexts/context.canvascontext.js");
Engine.include("/rendercontexts/context.scrollingbackground.js");
Engine.include("/spatial/container.spatialgrid.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/resourceloaders/loader.bitmapfont.js");
Engine.include("/textrender/text.renderer.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/resourceloaders/loader.level.js");
Engine.include("/components/component.notifier.js");

// Load game objects
Game.load("/game/mover.js");
Game.load("/game/player.js");
Game.load("/game/bullet.js");
Game.load("/game/grenade.js");
Game.load("/game/particle.js");
Game.load("/game/sign.js");
Game.load("/game/loader.furnishedlevel.js");
Game.load("/game/furniture.js");
Game.load("/game/collider.js");
Game.load("/game/enemy.js");
Game.load("/game/human.js");
Game.load("/game/cheaprect.js");
Game.load("/game/ai.js");
Game.load("/game/weapon.js");
Game.load("/game/m9.js");
Game.load("/game/mac10.js");
Game.load("/game/spas.js");
Game.load("/game/shrapnel.js");
Game.load("/game/fire.js");
Game.load("/game/firework.js");
Game.load("/game/fireworklauncher.js");

Engine.initObject("PistolSlut", "Game", function() {

	/**
	 * @class The game.
	 */
	var PistolSlut = Game.extend({

		constructor: null,

		renderContext: null,

		fieldBox: null,
		centerPoint: null,
		areaScale: $.browser.Wii ? 0.7 : 0.93,

		engineFPS: 30,

		collisionModel: null,
		collider: null,
		
		notifier: null,
	
		snowTimer: null,
		snowFallRate: 0,
		snowFallInterval: 50,
		groundY: 400,
	
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
		
			this.spriteLoader = SpriteLoader.create();
			this.levelLoader = FurnishedLevelLoader.create("FurnishedLevelLoader", this.spriteLoader);
		
			// load sprite resources
			this.spriteLoader.load("girl", this.getFilePath("resources/girl.js"));
			this.spriteLoader.load("grenade", this.getFilePath("resources/grenade.js"));

			// load level resources
			this.levelLoader.load("level1", this.getFilePath("resources/level1.js"));
		
			// Don't start until all of the resources are loaded
			PistolSlut.loadTimeout = Timeout.create("wait", 250, PistolSlut.waitForResources);
			this.waitForResources();
		},
	
		onKeyPress: function(event) {
			if(PistolSlut.isStartScreen == true)
    		PistolSlut.play();
		},
		
		// an initial pause screen
		startScreen: function() {
    	PistolSlut.isStartScreen = true;
			
			this.loadLevelBasics(); // just enough for a cogent start screen
			
      EventEngine.setHandler(document, "keypress", PistolSlut.onKeyPress);

      PistolSlut.start = TextRenderer.create(VectorText.create(), "Press any key to start", 1);
      PistolSlut.start.setPosition(Point2D.create(125, 200));
      PistolSlut.start.setColor("#fff");
      PistolSlut.renderContext.add(PistolSlut.start);

      var flashText = function() {
				if (!PistolSlut.showStart)
				{
				   PistolSlut.start.setDrawMode(TextRenderer.DRAW_TEXT);
				   PistolSlut.showStart = true;
				   PistolSlut.intv.restart();
				}
				else
				{
				   PistolSlut.start.setDrawMode(TextRenderer.NO_DRAW);
				   PistolSlut.showStart = false;
				   PistolSlut.intv.restart();
				}
      };
      PistolSlut.intv = Timeout.create("startkey", 1000, flashText);
		},
	
		loadLevelBasics: function() {
			// load level
	    this.level = PistolSlut.levelLoader.getLevel("level1", PistolSlut, this.fieldWidth);
			this.renderContext = ScrollingBackground.create("bkg", this.level, this.fieldWidth, this.fieldHeight);		
			this.renderContext.setWorldScale(this.areaScale);
			this.renderContext.setBackgroundColor("#000000");
			Engine.getDefaultContext().add(this.renderContext);
			
			this.loadComponents();
			
			// load rest of level
			this.level.addObjects(this.renderContext);
			
			// snow machine
			PistolSlut.snowTimer = Interval.create("snow", this.snowFallInterval,
				function() {
					PistolSlut.pEngine.addParticle(SnowParticle.create(PistolSlut.level.getWidth()));
			});
		},
		
		loadComponents: function() {
			// We'll need something to detect collisions
			this.collisionModel = SpatialGrid.create(this.level.getWidth(), this.level.getHeight(), 5);
			this.collider = new Collider(this);
			
			// inter object event notifier
			this.notifier = NotifierComponent.create("notifier");
			
			// Start up the particle engine
			this.pEngine = ParticleEngine.create();
			this.pEngine.setMaximum(1000);
			this.renderContext.add(this.pEngine);
		},
	
		destroyStartScreen: function() {
			this.isStartScreen = false;
			this.intv.destroy();
			this.renderContext.remove(PistolSlut.start);
			this.start = null;
		},
	
		play: function() {
			this.destroyStartScreen();
			
			this.playerObj = Player.create();
			this.renderContext.add(this.playerObj);
			this.playerObj.setup(this.fieldWidth, this.fieldHeight);
		},
	
		applyGravity: function(obj) {
			if(!this.collider.colliding(obj, this.collider.getPCL(obj), Furniture))
				obj.getVelocity().add(this.gravityVector);
		},
		
	  waitForResources: function(){
			if (PistolSlut.spriteLoader.isReady() && PistolSlut.levelLoader.isReady())
			{
				PistolSlut.loadTimeout.destroy();
				PistolSlut.startScreen();
				return;
		  }
		  else
		  	PistolSlut.loadTimeout.restart();
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

			var movingPastCentrePoint = false;
			if(vector.x > 0 && centralObjWindowX > this.centerPoint.x)
				movingPastCentrePoint = true;
			else if(vector.x < 0 && centralObjWindowX < this.centerPoint.x)
				movingPastCentrePoint = true;
			
			var potentialNewHorizontalScroll = this.renderContext.getHorizontalScroll() + vector.x;
			if(movingPastCentrePoint && potentialNewHorizontalScroll >= this.level.minScroll && potentialNewHorizontalScroll <= this.level.maxScroll)
				this.renderContext.setHorizontalScroll(potentialNewHorizontalScroll);
		},
	});

	return PistolSlut;
});
