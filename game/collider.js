Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Collider", "Base", function() {
	var Collider = Base.extend({
		field: null,

		constructor: function(field) {
			this.field = field;
		},

		inLineOfFire: function(shooter, target, inSafetyMargin) {
			var inLine = false;

			var safetyMargin = 0;
			if(inSafetyMargin !== undefined)
				safetyMargin = inSafetyMargin;

			var muzzlePosition = shooter.weapon.getGunTip();
			var targetRect = CheapRect.gen(target);
			if(muzzlePosition.y <= targetRect.b + safetyMargin && muzzlePosition.y >= targetRect.y - safetyMargin) // intersecting on y-axis
			{
				if(shooter.direction == Collider.LEFT)
					inLine = targetRect.x < muzzlePosition.x;
				else if(shooter.direction == Collider.RIGHT)
					inLine = muzzlePosition.x < targetRect.r;
			}

			return inLine;
		},

		aFallingThroughB: function(a, b) {
			var aRect = CheapRect.gen(a);
			var bRect = CheapRect.gen(b);
			return a.getVelocity().y >= 0 && aRect.b > bRect.y && aRect.b < bRect.y + 16;
		},

		aOnB: function(a, b) {
			var aRect = CheapRect.gen(a);
			var bRect = CheapRect.gen(b);
			return aRect.b == bRect.y;
		},

		aOnLeftAndBumpingB: function(a, b) {
			var aRect = CheapRect.gen(a);
			var bRect = CheapRect.gen(b);
			return aRect.r >= bRect.x && aRect.x < bRect.x && !this.aOnB(a, b);
		},

		aOnRightAndBumpingB: function(a, b) {
			var aRect = CheapRect.gen(a);
			var bRect = CheapRect.gen(b);
			return aRect.x <= bRect.r && aRect.r > bRect.r && !this.aOnB(a, b);
		},

		aOnBottomAndBumpingB: function(a, b) {
			var aRect = CheapRect.gen(a);
			var bRect = CheapRect.gen(b);
			return a.getVelocity().y <= 0 && aRect.y < bRect.b && aRect.y > bRect.b - 16;
		},

		getPCL: function(subject) {
			return this.field.collisionModel.getPCL(subject.getPosition());
		},

		colliding: function(subject, objects) {
			for(var i in objects)
                if(this.field.inView(objects[i]))
				    if(CheapRect.gen(subject).isIntersecting(CheapRect.gen(objects[i])))
					    return true;
			return false;
		},

		objsColliding: function(obj1, obj2) {
			return CheapRect.gen(obj1).isIntersecting(CheapRect.gen(obj2));
		},

		objectAtLeastDistanceAway: function(obj1, obj2, distance) {
			if(obj1.getPosition().dist(obj2.getPosition()) > distance)
				return true;
			else
				return false;
		},

        getNearest: function(direction, atSimilarHeight, object, objects) {
            var nearest = null;
            var smallestDistance = null;
            for(var i in objects)
            {
                var otherObj = objects[i];
                if(object.id != otherObj.id)
                    if(this.field.inView(otherObj))
                        if(atSimilarHeight !== true || this.yDistance(otherObj, object) < Collider.SIMILAR_HEIGHT_THRESHOLD)
                        {
                            var curObjDistance = this.xDistance(otherObj, object);
                            if(smallestDistance === null || curObjDistance < smallestDistance)
                            {
                                if(direction === null)
                                {
                                    nearest = otherObj;
                                    smallestDistance = curObjDistance;
                                }
                                else
                                {
                                    if(direction == Collider.LEFT && this.getDirectionOf(object, otherObj) == Collider.LEFT)
                                    {
                                        nearest = otherObj;
                                        smallestDistance = curObjDistance;
                                    }
                                    else if(direction == Collider.RIGHT && this.getDirectionOf(object, otherObj) == Collider.RIGHT)
                                    {
                                        nearest = otherObj;
                                        smallestDistance = curObjDistance;
                                    }
                                }
                            }
                        }
            }

            return nearest;
        },

        getDirectionOf: function(fromObj, toObj) {
			if(fromObj.getPosition().x < toObj.getPosition().x)
				return Collider.RIGHT;
            else
                return Collider.LEFT;
        },

        xDistance: function(obj1, obj2) {
            if(obj1.getPosition().x < obj2.getPosition().x)
                return Math.abs(obj2.getPosition().x - (obj1.getPosition().x + obj1.getBoundingBox().dims.x));
            else
                return Math.abs(obj1.getPosition().x - (obj2.getPosition().x + obj2.getBoundingBox().dims.x));
        },

        yDistance: function(obj1, obj2) {
            if(obj1.getPosition().y < obj2.getPosition().y)
                return Math.abs(obj2.getPosition().y - (obj1.getPosition().y + obj1.getBoundingBox().dims.y));
            else
                return Math.abs(obj1.getPosition().y - (obj2.getPosition().y + obj2.getBoundingBox().dims.y));
        },

		moveToEdge: function(obj, objHit, sideHit) {
			if(sideHit == Collider.TOP)
				obj.getPosition().setY(objHit.getPosition().y - obj.getBoundingBox().dims.y);
			else if(sideHit == Collider.BOTTOM)
				obj.getPosition().setY(objHit.getPosition().y + objHit.getBoundingBox().dims.y);
			else if(sideHit == Collider.LEFT)
				obj.getPosition().setX(objHit.getPosition().x - obj.getBoundingBox().dims.x);
			else if(sideHit == Collider.RIGHT)
				obj.getPosition().setX(objHit.getPosition().x + objHit.getBoundingBox().dims.x);
		},

        sideHit: function(movingObj, staticObj) {
          	var mORect = CheapRect.gen(movingObj);
			var sOPos = staticObj.getPosition();
			var sODims = staticObj.getBoundingBox().dims;

			// staticobj on bottom
			var p1 = Point2D.create(sOPos.x, sOPos.y);
			var p2 = Point2D.create(sOPos.x + sODims.x, sOPos.y);
			if(Math2D.lineBoxCollision(p1, p2, mORect))
				return Collider.TOP;

			// staticobj on right
			var p1 = Point2D.create(sOPos.x, sOPos.y);
			var p2 = Point2D.create(sOPos.x, sOPos.y + sODims.y);
			if(Math2D.lineBoxCollision(p1, p2, mORect))
				return Collider.LEFT;

			// staticobj on left
			var p1 = Point2D.create(sOPos.x + sODims.x, sOPos.y);
			var p2 = Point2D.create(sOPos.x + sODims.x, sOPos.y + sODims.y);
			if(Math2D.lineBoxCollision(p1, p2, mORect))
				return Collider.RIGHT;

			// staticobj on top
			var p1 = Point2D.create(sOPos.x, sOPos.y + sODims.y);
			var p2 = Point2D.create(sOPos.x + sODims.x, sOPos.y + sODims.y);
			if(Math2D.lineBoxCollision(p1, p2, mORect))
				return Collider.BOTTOM;

            return null;
        },

		// returns point that moving obj hit staticObj
		pointOfImpact: function(movingObj, staticObj) {
			var mOCurPos = movingObj.getPosition();
			var mOPrevPos = movingObj.getLastPosition();
			var mODims = movingObj.getBoundingBox().dims;
			var sOPos = staticObj.getPosition();
			var sODims = staticObj.getBoundingBox().dims;

			// staticobj on bottom
			var p1 = Point2D.create(mOPrevPos.x,mOPrevPos.y + mODims.y);
			var p2 = Point2D.create(mOCurPos.x,mOCurPos.y + mODims.y);
			var p3 = Point2D.create(sOPos.x,sOPos.y);
			var p4 = Point2D.create(sOPos.x + sODims.x,sOPos.y);
			if(Math2D.lineLineCollision(p1, p2, p3, p4))
				return [Math2D.lineLineCollisionPoint(p1, p2, p3, p4), Collider.TOP];

			// staticobj on right
			var p1 = Point2D.create(mOPrevPos.x + mODims.x,mOPrevPos.y + mODims.y);
			var p2 = Point2D.create(mOCurPos.x + mODims.x,mOCurPos.y + mODims.y);
			var p3 = Point2D.create(sOPos.x,sOPos.y);
			var p4 = Point2D.create(sOPos.x,sOPos.y + sODims.y);
			if(Math2D.lineLineCollision(p1, p2, p3, p4))
				return [Math2D.lineLineCollisionPoint(p1, p2, p3, p4), Collider.LEFT];

			// staticobj on left
			var p1 = Point2D.create(mOPrevPos.x,mOPrevPos.y);
			var p2 = Point2D.create(mOCurPos.x,mOCurPos.y);
			var p3 = Point2D.create(sOPos.x + sODims.x,sOPos.y);
			var p4 = Point2D.create(sOPos.x + sODims.x,sOPos.y + sODims.y);
			if(Math2D.lineLineCollision(p1, p2, p3, p4))
				return [Math2D.lineLineCollisionPoint(p1, p2, p3, p4), Collider.RIGHT];

			// staticobj on top
			var p1 = Point2D.create(mOPrevPos.x,mOPrevPos.y);
			var p2 = Point2D.create(mOCurPos.x,mOCurPos.y);
			var p3 = Point2D.create(sOPos.x,sOPos.y + sODims.y);
			var p4 = Point2D.create(sOPos.x + sODims.x,sOPos.y + sODims.y);
			if(Math2D.lineLineCollision(p1, p2, p3, p4))
				return [Math2D.lineLineCollisionPoint(p1, p2, p3, p4), Collider.BOTTOM];

			return null; // no intersection
		},

	}, {

		getClassName: function() { return "Collider"; },

		LEFT: "Left",
		RIGHT: "Right",
		TOP: "Top",
		BOTTOM: "Bottom",

        AT_SIMILAR_HEIGHT: true,
        SIMILAR_HEIGHT_THRESHOLD: 50,

        UP: new Point2D(0, -1),
        DOWN: new Point2D(0, 1),
	});

	return Collider;
});