// Load required engine components
Engine.include("/rendercontexts/context.canvascontext.js");
Engine.include("/rendercontexts/context.scrollingbackground.js");
Engine.include("/spatial/container.spatialgrid.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/resourceloaders/loader.bitmapfont.js");
Engine.include("/textrender/text.renderer.js");
Engine.include("/resourceloaders/loader.sprite.js");
Engine.include("/resourceloaders/loader.remotefile.js");
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
Game.load("/game/status.js");
Game.load("/game/weapon.js");
Game.load("/game/indirectweapon.js");
Game.load("/game/m9.js");
Game.load("/game/mac10.js");
Game.load("/game/spas.js");
Game.load("/game/mortar.js");
Game.load("/game/ordinance.js");
Game.load("/game/bullet.js");
Game.load("/game/mortarround.js");
Game.load("/game/shrapnel.js");
Game.load("/game/launcher.js");
Game.load("/game/fire.js");
Game.load("/game/firework.js");
Game.load("/game/fireworklauncher.js");
Game.load("/game/parallax.js");
Game.load("/game/meter.js");
Game.load("/game/lantern.js");
Game.load("/game/sky.js");
Game.load("/game/speech.js");
Game.load("/game/trigger.js");
Game.load("/game/crosshair.js");
Game.load("/game/grenadelauncher.js");
Game.load("/game/lift.js");
Game.load("/game/barrel.js");
Game.load("/game/window.js");
Game.load("/game/machine.js");

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
		alwaysVisibleZIndex: 2005,
		frontZIndex: 2000,
		moverZIndex: 1000,

        maxBlockDimension: 50,

		fieldWidth: 700,
		fieldHeight: 430,
		level: null,

		meters: [],
		ammoMeter: null,
        spareClipsMeter: null,

		debug: true,
		playerObj: null,

		showStartTexts: false,

		pEngine: null,

		imageLoader: null,
		spriteLoader: null,
		levelLoader: null,
        remoteFileLoader: null,
		loadTimeout: null,
        enemyTypesDataIdentifier: "enemytypes",

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
            this.remoteFileLoader = RemoteFileLoader.create();

			this.imageLoader.load("grenadeon", this.getFilePath("resources/grenadeon.gif"), 7, 13);
			this.imageLoader.load("grenadeoff", this.getFilePath("resources/grenadeoff.gif"), 7, 13);

            this.remoteFileLoader.exists(this.getFilePath("resources/enemyai.js"), "json");
            this.remoteFileLoader.load("enemyai", this.getFilePath("resources/enemyai.js"), "json", true);
            this.remoteFileLoader.exists(this.getFilePath("resources/enemytypes.js"), "json");
            this.remoteFileLoader.load(this.enemyTypesDataIdentifier, this.getFilePath("resources/enemytypes.js"), "json", true);

			this.spriteLoader.load("human", this.getFilePath("resources/human.js")); // load sprite resources
			this.levelLoader.load("level1", this.getFilePath("resources/level1.js")); // load level resources

			// Don't start until all of the resources are loaded
			PistolSlut.loadTimeout = Timeout.create("wait", 250, this.waitForResources);
			this.waitForResources();
		},

		onKeyPress: function(event) {
			if(PistolSlut.isStartScreen == true)
    		    PistolSlut.play();
		},

		addStartText: function(text, x, y) {
			this.startTexts.push(TextRenderer.create(VectorText.create(), text, 1));
            this.startTexts[this.startTexts.length-1].setPosition(Point2D.create(x, y));
            this.startTexts[this.startTexts.length-1].setColor("#fff");
            this.renderContext.add(this.startTexts[this.startTexts.length-1]);
		},

		// an initial pause screen
		startScreen: function() {
    	    this.isStartScreen = true;
			this.loadLevelBasics(); // just enough for a cogent start screen

            EventEngine.setHandler(document, "keypress", this.onKeyPress);

			this.startTexts = []
			this.addStartText("PRESS Z", 285, 168);
			this.addStartText("TO START", 412, 168);

            var flashText = function() {
				if (!PistolSlut.showStartTexts)
				{
					PistolSlut.showStartTexts = true;
					for(var i in PistolSlut.startTexts)
				  	PistolSlut.startTexts[i].setDrawMode(TextRenderer.DRAW_TEXT);
				}
				else
				{
					PistolSlut.showStartTexts = false;
					for(var i in PistolSlut.startTexts)
				  	PistolSlut.startTexts[i].setDrawMode(TextRenderer.NO_DRAW);
				}

				PistolSlut.startTextsTimer.restart();
            };

            this.startTextsTimer = Timeout.create("startkey", 1000, flashText);
		},

        loadLevelBasics: function() {
		    // load level
	        this.level = this.levelLoader.getLevel("level1", this, this.fieldWidth);
	        this.renderContext = ScrollingBackground.create("bkg", this.level, this.fieldWidth, this.fieldHeight);
		    this.renderContext.setWorldScale(this.areaScale);
		    Engine.getDefaultContext().add(this.renderContext);

			this.loadComponents();

			// load rest of level
			this.level.addObjects(this.renderContext);
			this.renderContext.setBackgroundColor(this.level.sky.getSkyColor());

            this.viewBoxCheapRect = new CheapRect(null, this.renderContext.getHorizontalScroll(), 0, this.renderContext.getHorizontalScroll() + this.fieldWidth, this.fieldHeight);
		},

		loadComponents: function() {
			this.collisionModel = SpatialGrid.create(this.level.getWidth(), this.level.getHeight(), 7);
			this.collider = new Collider(this);
			this.physics = new Physics(this);

			// inter object event notifier
			this.notifier = NotifierComponent.create("notifier");

			// Start up the particle engine
			this.pEngine = ParticleEngine.create();
			this.pEngine.setMaximum(120);
			this.renderContext.add(this.pEngine);
		},

		destroyStartScreen: function() {
			this.isStartScreen = false;
			this.startTextsTimer.destroy();
			for(var i in this.startTexts)
			{
				var startText = this.startTexts[i];
				this.renderContext.remove(startText);
				this.startText = null;
			}
			this.startTexts = null;
		},

		play: function() {
			this.destroyStartScreen();

			this.playerObj = Player.create(this, this.level.playerData);
			this.renderContext.add(this.playerObj);
            this.addMeters();
            this.updateFramePosition(null, this.playerObj);
		},

        ammoMeter: null,
        spareClipsMeter: null,
        healthMeter: null,
        grenadeMeter: null,
        addMeters: function() {
			this.ammoMeter = new VectorCaretMeter(this, this.renderContext, this.playerObj.weapon.clipCapacity, Point2D.create(85, 5), VectorCaret.WIDTH * 2, 30, "white", "black");
			this.meters.push(this.ammoMeter);

			this.spareClipsMeter = new VectorCaretMeter(this, this.renderContext, Weapon.MAX_SPARE_CLIPS, Point2D.create(50, 5), VectorCaret.WIDTH * 2, Weapon.MAX_SPARE_CLIPS, "white", "black");
			this.meters.push(this.spareClipsMeter);

			this.healthMeter = new VectorCaretMeter(this, this.renderContext, this.playerObj.health, Point2D.create(5, 5), VectorCaret.WIDTH * 2, this.playerObj.health, "red", "black");
			this.meters.push(this.healthMeter);

			this.grenadeMeter = new ImageCaretMeter(this,
                                                    this.renderContext,
                                                    GrenadeLauncher.MAX_GRENADES,
                                                    Point2D.create(275, 6),
                                                    "grenade",
                                                    GrenadeLauncher.METER_CARET_SPACING,
                                                    GrenadeLauncher.MAX_GRENADES);

			this.meters.push(this.grenadeMeter);
        },

		applyGravity: function(obj) {
			if(!this.collider.colliding(obj, this.level.furniture))
				obj.getVelocity().add(this.gravityVector);
        },

	    waitForResources: function() {
	        if (PistolSlut.imageLoader.isReady() && PistolSlut.spriteLoader.isReady() && PistolSlut.levelLoader.isReady())
		    {
			    PistolSlut.loadTimeout.destroy();
				PistolSlut.startScreen();
				return;
		    }
		    else
		  	    PistolSlut.loadTimeout.restart();
	    },

        isPlayerAlive: function() { return this.playerObj && this.playerObj.isAlive(); },

		teardown: function() {
			this.renderContext.destroy();
		},

        objectsInView: {},
        viewBoxCheapRect: null,
		inView: function(obj) {
            if(obj.staticRect && this.objectsInView[obj.id] !== undefined) // only cache results for static or near static objects
                return this.objectsInView[obj.id];
            else
            {
			    this.objectsInView[obj.id] = this.viewBoxCheapRect.isIntersecting(CheapRect.gen(obj));
                return this.objectsInView[obj.id];
            }
		},

		// updates the position of the view frame
		updateFramePosition: function(vector, centralObj) {
            if(vector !== null && vector.x == 0)
                return;

			var centralObjWindowX = centralObj.getRenderPosition().x;

            if(vector === null) // just want to zip straight to a place - used if player is warped to start position
                vector = Point2D.create(centralObjWindowX - this.playerCenterX, 0);

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

                // update viewbox and reset array containing list of objs in view
                this.viewBoxCheapRect = new CheapRect(null, this.renderContext.getHorizontalScroll(), 0, this.renderContext.getHorizontalScroll() + this.fieldWidth, this.fieldHeight)
                this.objectsInView = {};

				// move parallaxes
				for(var i in this.level.parallaxesToMove)
				{
                    var parallax = this.level.parallaxesToMove[i];
                    if(this.inView(parallax))
                    {
					    parallax.getPosition().setX(parallax.getPosition().x + (parallax.scrollAttenuation * vector.x));
                        parallax.setStaticRect();
                    }
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