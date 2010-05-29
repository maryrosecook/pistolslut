Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Furniture", "Object2D", function() {

	/**
	 * @class A piece of furniture in the level.
	 */
	var Furniture = Object2D.extend({

		name: null,
		field: null,
		sprite: null,

		constructor: function(name, position) {
			this.base("Furniture");
			this.field = Spaceroids;
			this.name = name;

			// Add components to move and draw
			this.add(Mover2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));
			
			this.sprite = this.field.spriteLoader.getSprite(name, "main");
			this.setSprite(this.sprite);
			
			this.setPosition(position);
		},

	  setSprite: function(sprite) {
		  this.setBoundingBox(sprite.getBoundingBox());
		  this.getComponent("draw").setSprite(sprite);
	  },

		release: function() {
			this.base();
		},

		getPosition: function() {
			return this.getComponent("move").getPosition();
		},

		setPosition: function(point) {
			this.base(point);
			this.getComponent("move").setPosition(point);
		},

		getRenderPosition: function() {
			return this.getComponent("move").getRenderPosition();
		},

		getLastPosition: function() {
			return this.getComponent("move").getLastPosition();
		},

		update: function(renderContext, time) {
			var c_mover = this.getComponent("move");

			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},
		
		collisionWith: function(obj) {
			return 0;
		},
		
		onCollide: function(obj) {
			obj.collisionWith(this); // tell other object
			this.collisionWith(obj)// deal with it own self
			return 0; 
		},

	}, {

		getClassName: function() {
			return "Furniture";
		},
	});

	return Furniture;
});