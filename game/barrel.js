Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.collider.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Barrel", "Mover", function() {
	var Barrel = Mover.extend({

		constructor: function(position) {
			this.base("Barrel");

			// Add components to move and draw the mortar round
			this.add(Mover2DComponent.create("move"));
			this.add(ColliderComponent.create("collide", this.field.collisionModel));
            this.add(SpriteComponent.create("draw"));

            this.addSprite("main", this.field.spriteLoader.getSprite("barrel.gif", "main"));
			this.setSprite("main");

            var mover = this.getComponent("move");
            mover.setPosition(position);
            mover.setCheckLag(false);
		},

		release: function() {
			this.base();
		},

		update: function(renderContext, time) {
			this.field.applyGravity(this);
			renderContext.pushTransform();
			this.base(renderContext, time);
			renderContext.popTransform();
		},

		onCollide: function(obj) {
			if(obj instanceof Furniture || obj instanceof Lift)
			{
                if(this.field.collider.objsColliding(this, obj))
                {
                    if(this.shouldIgnite())
                    {
                        this.explode();
                        return ColliderComponent.STOP;
                    }
                    else if(this.field.collider.aFallingThroughB(this, obj))
                    {
					    this.endFall(obj);
                        return ColliderComponent.CONTINUE;
                    }
                    else if(this.field.collider.aOnLeftAndBumpingB(this, obj))
					    this.block(obj.getPosition().x - this.getBoundingBox().dims.x - 1);
				    else if(this.field.collider.aOnRightAndBumpingB(this, obj))
					    this.block(obj.getPosition().x + obj.getBoundingBox().dims.x + 1);
                }
            }
            else if(obj instanceof Human)
            {
                if(this.field.collider.objsColliding(this, obj))
                {
                    var pushing = (obj.getVelocity().x > 0 && this.field.collider.aOnLeftAndBumpingB(obj, this)) || (obj.getVelocity().x < 0 && this.field.collider.aOnRightAndBumpingB(obj, this));
                    var fallingOnHead = this.getVelocity().y > 0 && this.field.collider.aOnBottomAndBumpingB(obj, this);
                    if(pushing && !fallingOnHead)
                        this.push(obj);
                }
            }
            else if(obj instanceof Bullet || obj instanceof Shrapnel)
                if(this.field.collider.objsColliding(this, obj))
                {
                    this.explode();
                    return ColliderComponent.STOP;
                }

			return ColliderComponent.CONTINUE;
		},

        shouldIgnite: function() { return this.getVelocity().len() > Barrel.EXPLODE_SPEED; },

        push: function(pusher) {
            this.getComponent("move").setResting(false); // because do move w/o velocity change, need to handle own unset of resting state
		    this.setPosition(Point2D.create(this.getPosition().x + pusher.getVelocity().x, this.getPosition().y));
        },

		shrapnelCount: 40,
		shrapnelTTL: 700,
		explode: function() {
			for(var x = 0; x < this.shrapnelCount; x++)
				this.field.renderContext.add(Shrapnel.create(this.field, this.shooter, this.getPosition(), this.shrapnelTTL));

            this.field.notifier.post(AIComponent.SOUND, this);
			this.destroy();
		},

		endFall: function(groundObj) {
			this.getPosition().setY(groundObj.getPosition().y - this.getBoundingBox().dims.y);
			this.getVelocity().setY(0);
		},
	}, {
		getClassName: function() { return "Barrel"; },

		EXPLODE_SPEED: 10,
	});

	return Barrel;
});