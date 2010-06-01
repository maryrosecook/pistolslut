Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.keyboardinput.js");
Engine.include("/engine/engine.object2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.timers.js");
Engine.include("/components/component.sprite.js");

Engine.initObject("Mover", "Object2D", function() {

var Mover = Object2D.extend({

	field: null,
	
	velocity: null,
	direction: null,

	sprites: null,

	destroy: function() {
		if (this.ModelData && this.ModelData.lastNode) {
			this.ModelData.lastNode.removeObject(this);
		}
		this.base();
	},

  setSprite: function(spriteKey) {
	  var sprite = this.sprites[spriteKey];
	  this.setBoundingBox(sprite.getBoundingBox());
	  this.getComponent("draw").setSprite(sprite);
  },

	/**
	 * Get the position of the ship from the mover component.
	 * @type Point2D
	 */
	getPosition: function() {
		return this.getComponent("move").getPosition();
	},

	getRenderPosition: function() {
		return this.getComponent("move").getRenderPosition();
	},

	/**
	 * Get the last position the ship was at before the current move.
	 * @type Point2D
	 */
	getLastPosition: function() {
		return this.getComponent("move").getLastPosition();
	},

	/**
	 * Set, or initialize, the position of the mover component
	 *
	 * @param point {Point2D} The position to draw the ship in the playfield
	 */
	setPosition: function(point) {
		this.base(point);
		this.getComponent("move").setPosition(point);
	},

	/**
	 * Get the rotation of the ship from the mover component.
	 * @type Number
	 */
	getRotation: function() {
		return this.getComponent("move").getRotation();
	},

	/**
	 * Set the rotation of the ship on the mover component.
	 *
	 * @param angle {Number} The rotation angle of the ship
	 */
	setRotation: function(angle) {
		this.base(angle);
		this.getComponent("move").setRotation(angle);
	},

	getScale: function() {
		return this.getComponent("move").getScale();
	},

	setScale: function(scale) {
		this.base(scale);
		this.getComponent("move").setScale(scale);
	},
	
	release: function() {
		this.base();
		this.velocity = null;
		this.direction = null;
		this.sprites = null;
	},

	}, { // Static
		getClassName: function() {
			return "Mover";
		},
	});

	return Mover;
});