Engine.initObject("Pistol", "Weapon", function() {
	var Pistol = Weapon.extend({
		timeRequiredForDeadAim: 1000,
		
		constructor: function(owner) {
			this.base(owner, owner.field, Pistol.CLIP_CAPACITY, Weapon.SEMI_AUTOMATIC, Pistol.ROUNDS_PER_MINUTE,
								Pistol.PROJECTILES_PER_SHOT, Pistol.TIME_TO_RELOAD);
		},
		
		bulletPhysics: function() {
			return this.recoil(Pistol.BASE_SPREAD, Pistol.TIME_REQUIRED_FOR_DEAD_AIM, Pistol.STEADINESS);
		},
		
	}, {
		getClassName: function() { return "Pistol"; },
		
		CLIP_CAPACITY: 10,
		ROUNDS_PER_MINUTE: 999999,
		PROJECTILES_PER_SHOT: 1,
		TIME_TO_RELOAD: 1000,
		
		BASE_SPREAD: 2,
		TIME_REQUIRED_FOR_DEAD_AIM: 1000,
		STEADINESS: 100
	});

	return Pistol;
});