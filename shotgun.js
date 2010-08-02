Engine.initObject("Shotgun", "Weapon", function() {
	var Shotgun = Weapon.extend({
		timeRequiredForDeadAim: 1000,
		
		constructor: function(owner) {
			this.base(owner, owner.field, Shotgun.CLIP_CAPACITY, Weapon.SEMI_AUTOMATIC, Shotgun.ROUNDS_PER_MINUTE,
								Shotgun.PROJECTILES_PER_SHOT, Shotgun.TIME_TO_RELOAD);
		},
		
		bulletPhysics: function() {
			return this.recoil(Shotgun.BASE_SPREAD, Shotgun.TIME_REQUIRED_FOR_DEAD_AIM, Shotgun.STEADINESS);
		},
		
	}, {
		getClassName: function() { return "Shotgun"; },
		
		CLIP_CAPACITY: 6,
		ROUNDS_PER_MINUTE: 999999,
		PROJECTILES_PER_SHOT: 5,
		TIME_TO_RELOAD: 2000,
		
		BASE_SPREAD: 60,
		TIME_REQUIRED_FOR_DEAD_AIM: 1000,
		STEADINESS: 30
	});

	return Shotgun;
});