Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Ordinance", "Mover", function() {
	var Ordinance = Mover.extend({
		weapon: null,
		field: null,
		shooter: null,
		
		constructor: function(weapon) {
			this.base();
			this.field = PistolSlut;
		
			// Track the shooting weapon
			this.weapon = weapon;
			this.shooter = this.weapon.owner;
		
			// Add components to move and draw the mortar round
			this.add(Mover2DComponent.create("move"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));
			
			var ownerPosition = Point2D.create(this.weapon.owner.getComponent("move").getPosition());
			var gunTipPosition = this.weapon.getGunTip();

			var c_mover = this.getComponent("move");
			c_mover.setPosition(gunTipPosition);
			c_mover.setVelocity(this.weapon.ordinancePhysics.call(this.weapon));
			c_mover.setCheckLag(false);
			this.setupGraphics();
		},
		
		setupGraphics: function() { },
		
		release: function() {
			this.base();
			this.weapon = null;
		},
		
		destroy: function() {
			if (this.ModelData.lastNode)
				this.ModelData.lastNode.removeObject(this);
				
			this.base();
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