/**
 * The Render Engine
 * Example Game: Spaceroids - an Asteroids clone
 *
 * The asteroid object
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author: bfattori $
 * @version: $Revision: 692 $
 *
 * Copyright (c) 2008 Brett Fattori (brettf@renderengine.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

Engine.include("/components/component.mover2d.js");
Engine.include("/components/component.vector2d.js");
Engine.include("/engine/engine.object2d.js");

Engine.initObject("Collider", "Base", function() {

var Collider = Base.extend({
	
	field: null,
	
	constructor: function(field) {
		this.field = field;
	},
	
	// returns true if subject colliding with any of the objects
	colliding: function(subject, objects) {
		for(var i in objects)
			if(subject.colliding(objects[i]))
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