Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Ordinance", "Mover", function() {
	var Ordinance = Mover.extend({
		field: null,
		weapon: null,
		shooter: null,
		
		constructor: function(weapon) {
			this.base("yeah");
			this.field = PistolSlut;
		
			// Track the shooting weapon
			this.weapon = weapon;
			this.shooter = this.weapon.owner;
		
			// Add components to move and draw the mortar round
			this.add(Mover2DComponent.create("move"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));

			var c_mover = this.getComponent("move");
			c_mover.setPosition(Point2D.create(this.weapon.getGunTip()));
			c_mover.setVelocity(this.weapon.ordinancePhysics.call(this.weapon));
			c_mover.setCheckLag(false);
			this.setupGraphics();
		},
		
		setupGraphics: function() { },
		
		release: function() {
			this.base();
			this.weapon = null;
			this.shooter = null;
		},
		
		update: function(renderContext, time) {
			if (!this.field.inView(this)) // remove if not in field
			{
				this.destroy();
				return;
			}
		
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},
		
	}, {
		getClassName: function() { return "Ordinance"; },
		
		tip: new Point2D(0, -1),
	});

	return Ordinance;
});