Engine.initObject("Uzi", "Weapon", function() {
	var Uzi = Weapon.extend({
		timeRequiredForDeadAim: 1000,
		
		constructor: function(owner) {
			this.base(owner, owner.field, Uzi.CLIP_CAPACITY, Weapon.AUTOMATIC, Uzi.ROUNDS_PER_MINUTE,
								Uzi.PROJECTILES_PER_SHOT, Uzi.TIME_TO_RELOAD);
		},
		
		bulletPhysics: function() {
			return this.recoil(Uzi.BASE_SPREAD, Uzi.TIME_REQUIRED_FOR_DEAD_AIM, Uzi.STEADINESS);
		},
		
	}, {
		getClassName: function() { return "Uzi"; },
		
		CLIP_CAPACITY: 30,
		ROUNDS_PER_MINUTE: 600,
		PROJECTILES_PER_SHOT: 1,
		TIME_TO_RELOAD: 2000,
		
		BASE_SPREAD: 5,
		TIME_REQUIRED_FOR_DEAD_AIM: 1000,
		STEADINESS: 70
	});

	return Uzi;
});