Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Collider", "Base", function() {

var Collider = Base.extend({
	
	field: null,
	
	constructor: function(field) {
		this.field = field;
	},
	
	aFallingThroughB: function(a, b) {
		var aRect = this.getRect(a).get();
		var bRect = this.getRect(b).get();
		return a.velocity.y > 0 && aRect.b > bRect.y && aRect.b < bRect.y + 6;
	},
	
	aOnB: function(a, b) {
		var aRect = this.getRect(a).get();
		var bRect = this.getRect(b).get();
		return aRect.b == bRect.y;
	},
	
	aOnLeftAndBumpingB: function(a, b) {
		var aRect = this.getRect(a).get();
		var bRect = this.getRect(b).get();
		return !this.aOnB(a, b) && aRect.r >= bRect.x && aRect.x < bRect.x;
	},
	
	aOnRightAndBumpingB: function(a, b) {
		var aRect = this.getRect(a).get();
		var bRect = this.getRect(b).get();
		return !this.aOnB(a, b) && aRect.x <= bRect.r && aRect.r > bRect.r;
	},
	
	// returns true if subject colliding with any of the objects
	colliding: function(subject, objects) {
		for(var i in objects)
			if(this.getRect(subject).isIntersecting(this.getRect(objects[i])))
				return true;
		return false;
	},
	
	pointOfImpact: function(movingObj, staticObj) {
		var mOCurPos = movingObj.getPosition();
		var mOPrevPos = movingObj.getLastPosition();
		var sOPos = staticObj.getPosition();
		var sODims = staticObj.getBoundingBox().dims;
		
		var p1 = Point2D.create(mOPrevPos.x, mOPrevPos.y);
		var p2 = Point2D.create(mOCurPos.x, mOCurPos.y);
		var p3 = null;
		var p4 = null;
		
		var intersection = null;
		
		// top
		p3 = Point2D.create(sOPos.x,sOPos.y);
		p4 = Point2D.create(sOPos.x + sODims.x,sOPos.y);
		if(Math2D.lineLineCollision(p1, p2, p3, p4))
			intersection = Math2D.lineLineCollisionPoint(p1, p2, p3, p4);
		
		// left
		p3 = Point2D.create(sOPos.x + sODims.x,sOPos.y);
		p4 = Point2D.create(sOPos.x + sODims.x,sOPos.y + sODims.y);
		if(Math2D.lineLineCollision(p1, p2, p3, p4))
			intersection = Math2D.lineLineCollisionPoint(p1, p2, p3, p4);
		
		// bottom
		p3 = Point2D.create(sOPos.x,sOPos.y + sODims.y);
		p4 = Point2D.create(sOPos.x + sODims.x,sOPos.y + sODims.y);
		if(Math2D.lineLineCollision(p1, p2, p3, p4))
			intersection = Math2D.lineLineCollisionPoint(p1, p2, p3, p4);
		
		// right
		p3 = Point2D.create(sOPos.x,sOPos.y);
		p4 = Point2D.create(sOPos.x,sOPos.y + sODims.y);
		if(Math2D.lineLineCollision(p1, p2, p3, p4))
			intersection = Math2D.lineLineCollisionPoint(p1, p2, p3, p4);
		
		return intersection;
	},
	
	angleOfImpact: function(movingObj) {
		var vector = movingObj.getVelocity();
		return Math2D.radToDeg(Math.atan2(vector.x, vector.y) + Math.PI);
	},
	
	getRect: function(obj) {
		var pos = obj.getPosition();
		var bBoxDims = obj.getBoundingBox().dims;
		return Rectangle2D.create(pos.x, pos.y, bBoxDims.x, bBoxDims.y);
	}
	
	}, {
		/**
		 * Get the class name of this object
		 *
		 * @type String
		 */
		getClassName: function() {
			return "Collider";
		},
	});

	return Collider;
});