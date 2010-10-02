Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Ordinance", "Mover", function() {
	var Ordinance = Mover.extend({
		shooter: null,
		weapon: null,
		field: null,
		
		constructor: function(name, weapon, baseSpeed, projectileVelocityVariability, shape) {
			this.base(name);
			this.field = PistolSlut;
		
			// Track the shooting weapon
			this.weapon = weapon;
			this.shooter = weapon.owner;
		
			// Add components to move and draw the mortar round
			this.add(Mover2DComponent.create("move"));
			this.add(Vector2DComponent.create("draw"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));
			
			// Get the shooter's position and rotation,
			// then position this at the tip of the ship
			// moving away from it
			var p_mover = this.weapon.owner.getComponent("move");
			var c_mover = this.getComponent("move");
			var c_draw = this.getComponent("draw");
		
			c_draw.setPoints(shape);
			c_draw.setLineStyle("white");
			c_draw.setFillStyle("white");
			
			var ownerPosition = Point2D.create(p_mover.getPosition());
			var gunTipPosition = this.weapon.getGunTip();
			var speed = baseSpeed + (Math.random() * projectileVelocityVariability * baseSpeed);

			c_mover.setPosition(gunTipPosition);
			c_mover.setVelocity(this.weapon.ordinancePhysics.call(this.weapon).mul(speed));
			c_mover.setCheckLag(false);
		},
		
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