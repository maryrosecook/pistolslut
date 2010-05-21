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
Game.load("/rock.js");
Game.load("/player.js");
Game.load("/bullet.js");
Game.load("/particle.js");

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

	rocks: 0,
	snowTimer: null,
	snowFallRate: 0,
	snowFallInterval: 100,
	groundY: 498,
	
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
	
	/**
	 * A simple mode where the title, game over message,
	 * and start message are displayed with asteroids in the background
	 */
	attractMode: function() {
		Spaceroids.isAttractMode = true;

		var pWidth = this.fieldWidth;
		var pHeight = this.fieldHeight;

		// var flash = function() {
		// 	if (!Spaceroids.showStart)
		// 	{
		// 		Spaceroids.start.setDrawMode(TextRenderer.DRAW_TEXT);
		// 		Spaceroids.showStart = true;
		// 		Spaceroids.intv.restart();
		// 	}
		// 	else
		// 	{
		// 		Spaceroids.start.setDrawMode(TextRenderer.NO_DRAW);
		// 		Spaceroids.showStart = false;
		// 		Spaceroids.intv.restart();
		// 	}
		// };
		// 
		// Spaceroids.intv = Timeout.create("startkey", 1000, flash);
		
    this.level = Spaceroids.levelLoader.getLevel("level1");

		this.renderContext = ScrollingBackground.create("bkg", this.level, this.fieldWidth, this.fieldHeight);		
		this.renderContext.setWorldScale(this.areaScale);
		this.renderContext.setBackgroundColor("#000000");
		Engine.getDefaultContext().add(this.renderContext);
		
		// Start up the particle engine
		this.pEngine = ParticleEngine.create()
		this.renderContext.add(this.pEngine);

		this.playerObj = SpaceroidsPlayer.create();
		this.renderContext.add(this.playerObj);
		this.playerObj.setup(pWidth, pHeight);
		
		//snow machine
		Spaceroids.snowTimer = Interval.create("snow", this.snowFallInterval,
			function() {
				// if(Spaceroids.snowFallRate >= 1 || Spaceroids.snowFallRate > Math.random())
					Spaceroids.pEngine.addParticle(SnowParticle.create(Spaceroids.level.getWidth()));
				// else
				// 					Spaceroids.snowFallRate += 0.0001;
		});
		
		// gravity machine
		Spaceroids.gravityTimer = Interval.create("snow", this.gravityInterval,
			function() {
				Spaceroids.applyGravity(Spaceroids.playerObj);
		});
	},
	
	applyGravity: function(obj) {
		obj.velocity = obj.velocity.add(this.gravityVector);
	},
	
	updatePosition: function(obj) {
		var potentialNewPos = Point2D.create(obj.getPosition()).add(obj.velocity); // get pos COULD end up in
		var solidGround = this.solidGround(potentialNewPos); // either false or ground pos
		if(solidGround == false)
			obj.setPosition(potentialNewPos);
		else
			obj.endFall(solidGround);
	},
	
	// if not on solid ground, return false, otherwise return pos of solid ground
	solidGround: function(pos) {
		if(pos.y >= this.groundY)
			return Point2D.create(pos.x, this.groundY);
		else
			return false;
	},
	
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
		this.collisionModel = SpatialGrid.create(this.fieldWidth, this.fieldHeight, 7);

		this.spriteLoader = SpriteLoader.create();
		this.levelLoader = LevelLoader.create();
		
		// load sprites
		this.spriteLoader.load("girl", this.getFilePath("resources/girl.js"));

		// level
		this.levelLoader.load("level1", this.getFilePath("resources/level1.js"));
		
		// Don't start until all of the resources are loaded
		Spaceroids.loadTimeout = Timeout.create("wait", 250, Spaceroids.waitForResources);
		this.waitForResources();
	},

  waitForResources: function(){
		if (Spaceroids.spriteLoader.isReady() && Spaceroids.levelLoader.isReady()) {
			Spaceroids.loadTimeout.destroy();
			Spaceroids.attractMode();
			return;
	  }
	  else
	  	Spaceroids.loadTimeout.restart();
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
	 * @param bBox {Rectangle2D} The bounding box of the playfield
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

	/**
	 * Called to wrap an object around the edges of the playfield.
	 *
	 * @param pos {Point2D} The position of the object
	 * @param bBox {Rectangle2D} The bounding box of the playfield
	 */
	wrap: function(pos, bBox) {

		var rX = bBox.len_x();
		var rY = bBox.len_y();

		// Wrap if it's off the playing field
		var p = new Point2D(pos);
		var x = p.x;
		var y = p.y;
		var fb = this.renderContext.getViewport().get();

		//console.debug(p, fb);

		if (pos.x < fb.x || pos.x > fb.r ||
			 pos.y < fb.y || pos.y > fb.b)
		{
			if (pos.x > fb.r + rX)
			{
				x = (fb.x - (rX - 1));
			}
			if (pos.y > fb.b + rY)
			{
				y = (fb.y - (rY - 1));
			}
			if (pos.x < fb.x - rX)
			{
				x = (fb.r + (rX - 1));
			}
			if (pos.y < fb.y - rY)
			{
				y = (fb.b + (rY - 1));
			}
			p.set(x,y);
		}
		return p;
	}

});

return Spaceroids;

});
