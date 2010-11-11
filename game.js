// Load required engine components
Engine.include("/rendercontexts/context.canvascontext.js");
Engine.include("/rendercontexts/context.scrollingbackground.js");
Engine.include("/spatial/container.spatialgrid.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/resourceloaders/loader.bitmapfont.js");
Engine.include("/textrender/text.renderer.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/resourceloaders/loader.level.js");
Engine.include("/resourceloaders/loader.image.js");
Engine.include("/components/component.image.js");
Engine.include("/components/component.notifier.js");

// Load game objects
Game.load("/game/mover.js");
Game.load("/game/player.js");
Game.load("/game/grenade.js");
Game.load("/game/particle.js");
Game.load("/game/sign.js");
Game.load("/game/loader.furnishedlevel.js");
Game.load("/game/furniture.js");
Game.load("/game/spritefurniture.js");
Game.load("/game/blockfurniture.js");
Game.load("/game/collider.js");
Game.load("/game/physics.js");
Game.load("/game/enemy.js");
Game.load("/game/human.js");
Game.load("/game/cheaprect.js");
Game.load("/game/ai.js");
Game.load("/game/weapon.js");
Game.load("/game/m9.js");
Game.load("/game/mac10.js");
Game.load("/game/spas.js");
Game.load("/game/mortar.js");
Game.load("/game/ordinance.js");
Game.load("/game/bullet.js");
Game.load("/game/mortarround.js");
Game.load("/game/shrapnel.js");
Game.load("/game/fire.js");
Game.load("/game/firework.js");
Game.load("/game/fireworklauncher.js");
Game.load("/game/parallax.js");
Game.load("/game/meter.js");
Game.load("/game/rectangleshape.js");
Game.load("/game/lantern.js");
Game.load("/game/sky.js");
Game.load("/game/speech.js");
Game.load("/game/trigger.js");
Game.load("/game/crosshair.js");
Game.load("/game/grenadelauncher.js");

Engine.initObject("PistolSlut", "Game", function() {

	/**
	 * @class The game.
	 */
	var PistolSlut = Game.extend({

		constructor: null,

		renderContext: null,

		fieldBox: null,
		playerCenterPoint: null,
		areaScale: $.browser.Wii ? 0.7 : 0.93,

		engineFPS: 30,

		collisionModel: null,

		collider: null,
		physics: null,		
		notifier: null,
	
		groundY: 395,
		playerStartPosY: 344,
		alwaysVisibleZIndex: 2001,
		frontZIndex: 2000,
		moverZIndex: 1000,
	
		fieldWidth: 700,
		fieldHeight: 430,
		level: null,
	
		meters: [],
		ammoMeter: null,
	
		debug: true,
		playerObj: null,

		showStart: false,

		pEngine: null,

		imageLoader: null,
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
			this.playerCenterX = this.fieldWidth / 4;
		
		  this.imageLoader = ImageLoader.create();
			this.spriteLoader = SpriteLoader.create();
			this.levelLoader = FurnishedLevelLoader.create("FurnishedLevelLoader", this.spriteLoader);

			// load sprite resources
			this.spriteLoader.load("human", this.getFilePath("resources/human.js"));

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

      PistolSlut.start = TextRenderer.create(VectorText.create(), "Press z to start", 1);
      PistolSlut.start.setPosition(Point2D.create(300, 168));
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
			Engine.getDefaultContext().add(this.renderContext);
			
			this.loadComponents();
			
			// load rest of level
			this.level.addObjects(this.renderContext);
			this.renderContext.setBackgroundColor(this.level.sky.getSkyColor());
		},
		
		loadComponents: function() {
			// We'll need something to detect collisions
			this.collisionModel = SpatialGrid.create(this.level.getWidth(), this.level.getHeight(), 5);
			this.collider = new Collider(this);
			this.physics = new Physics(this);
			
			// inter object event notifier
			this.notifier = NotifierComponent.create("notifier");
			
			// Start up the particle engine
			this.pEngine = ParticleEngine.create();
			this.pEngine.setMaximum(100);
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
			
			this.playerObj = Player.create(this, this.playerStartPosY);
			this.renderContext.add(this.playerObj);
			
			// add meters
			this.ammoMeter = new Meter(this, this.renderContext, this.playerObj.weapon.clipCapacity, Point2D.create(5, 7), "#fff");
			this.notifier.subscribe(Weapon.SHOOT, this.ammoMeter, this.ammoMeter.decrement);
			this.notifier.subscribe(Human.RELOADED, this.ammoMeter, this.ammoMeter.reset);
			this.notifier.subscribe(Weapon.SWITCH, this.ammoMeter, this.ammoMeter.notifyReadingUpdate);
			this.meters.push(this.ammoMeter);
			
			this.healthMeter = new Meter(this, this.renderContext, this.playerObj.health, Point2D.create(5, 17), "#f00");
			this.notifier.subscribe(Human.SHOT, this.healthMeter, this.healthMeter.decrement);
			this.meters.push(this.healthMeter);
		},
	
		applyGravity: function(obj) {
			if(!this.collider.colliding(obj, this.collider.getPCL(obj), Furniture))
				obj.getVelocity().add(this.gravityVector);
		},
		
	  waitForResources: function(){
			if (PistolSlut.imageLoader.isReady() && PistolSlut.spriteLoader.isReady() && PistolSlut.levelLoader.isReady())
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

		inView: function(obj) {
			return (new CheapRect(null, this.renderContext.getHorizontalScroll(), 0, this.renderContext.getHorizontalScroll() + this.fieldWidth, this.fieldHeight)).isIntersecting(new CheapRect(obj));
		},
	
		// updates the position of the view frame
		updateFramePosition: function(vector, centralObj) {
			var centralObjWindowX = centralObj.getRenderPosition().x;

			var movingPastCentrePoint = false;
			if(vector.x > 0 && centralObjWindowX > this.playerCenterX)
				movingPastCentrePoint = true;
			else if(vector.x < 0 && centralObjWindowX < this.playerCenterX)
				movingPastCentrePoint = true;
			
			var potentialNewHorizontalScroll = this.renderContext.getHorizontalScroll() + vector.x;
			if(movingPastCentrePoint
				 && potentialNewHorizontalScroll >= this.level.minScroll
				 && potentialNewHorizontalScroll <= this.level.maxScroll)
			{
				this.renderContext.setHorizontalScroll(potentialNewHorizontalScroll);

				// move parallaxes
				for(var i in this.level.parallaxesToMove)
				{
					var parallax = this.level.parallaxes[i];
					parallax.getPosition().setX(parallax.getPosition().x + (parallax.scrollAttenuation * vector.x));
				}
				
				// move meters
				for(var i in this.meters)
				{
					var meter = this.meters[i];
					meter.updatePosition(vector.x);
				}
				
				// move lanterns (they are like little parallaxes)
				for(var i in this.level.lanterns)
				{
					var lantern = this.level.lanterns[i];
					lantern.getPosition().setX(lantern.getPosition().x + (Lantern.SCROLL_ATTENUATION * vector.x));
				}
			}
		},
	});

	return PistolSlut;
});