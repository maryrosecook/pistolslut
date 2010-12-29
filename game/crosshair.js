Engine.include("/components/component.mover2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Crosshair", "Mover", function() {
	var Crosshair = Mover.extend({
		field: null,
		weapon: null,
		aiming: false,

		constructor: function(field, weapon) {
			this.base("Crosshair");
			this.field = field;
			this.weapon = weapon;

			this.add(Mover2DComponent.create("move"));
			this.add(SpriteComponent.create("draw"));

			this.setZIndex(this.field.alwaysVisibleZIndex);

			this.addSprite("main", this.field.spriteLoader.getSprite("crosshair.gif", "main"));
			this.setSprite("main");

			this.getComponent("move").setCheckLag(false);
		},

		show: function() {
			this.getComponent("draw").setDrawMode(RenderComponent.DRAW);
			this.aiming = true;
		},

		hide: function() {
			this.getComponent("draw").setDrawMode(RenderComponent.NO_DRAW);
			this.aiming = false;
		},

		update: function(renderContext, time) {
			if(this.aiming == true)
			{
				renderContext.pushTransform();
				this.setPosition(this.weapon.getCrosshairPosition());
				this.base(renderContext, time);
				renderContext.popTransform();
			}
		},
	}, {
		getClassName: function() { return "Crosshair"; },

        RANGE_GROWTH_ATTENUATION: 4,
		Z_INDEX: 1000,
	});

	return Crosshair;
});