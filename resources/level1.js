{
	// Frame (f): left, top, frameWidth, frameHeight
	// Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
	bitmapImage: "level1.gif", bitmapWidth: 4000, bitmapHeight: 430, collisionMap: [],
	objects: {
		signs: {
			color: "#fff", letterSpacing: 7,
			items: [
				{ text: "Pistol  Slut", x: 89, y: 310, width: 140 },
				{ text: "Please  return  to  your  homes", x: 805, y: 44, width: 245	},
				{ text: "Free  shop  opening  soon", x: 1188, y: 311, width: 140 }
			]
		},

		sprites: [
			{ bitmapImage: "fenceleft.gif", sprites: { "main": { "f": [0, 0, 11, 67] } } },
			{ bitmapImage: "bin.gif", sprites: { "main": { "f": [0, 0, 20, 27] } } },
			{ bitmapImage: "sandbags.gif", sprites: { "main": { "f": [0, 0, 18, 26] } } },
			{ bitmapImage: "lantern.png", sprites: { "main": { "f": [0, 0, 14, 13] } } },
			{ bitmapImage: "grenade.gif", sprites: { "main": { "a": [0, 0, 11, 11, 4, 100, "loop"] } } },		
			{ bitmapImage: "crosshair.gif", sprites: { "main": { "f": [0, 0, 3, 3] } } },
			{ bitmapImage: "fenceright.gif", sprites: { "main": { "f": [0, 0, 11, 67] } } },
		],

		spriteFurniture: [
			{ x: 0, y: 328, spriteName: "fenceleft.gif" },
			{ x: 170, y: 369, spriteName: "bin.gif" },
			{ x: 370, y: 369, spriteName: "bin.gif" },
			{ x: 775, y: 370, spriteName: "sandbags.gif" },
			{ x: 1100, y: 369, spriteName: "bin.gif" },
			{ x: 2315, y: 369, spriteName: "bin.gif" },
			{ x: 2665, y: 369, spriteName: "bin.gif" },
			{ x: 3989, y: 328, spriteName: "fenceright.gif" },
		],
		
		blockFurniture: [
			{ name: "longbuildingbody1", shape: { x: 2300, y: 96, w: 400, h: 212 } },
		],
		
		enemies: [
			{ name: "enemy1", clazz: Enemy, x: 410, y: 350, health: 4, weaponName: "M9", canThrowGrenades: false },
			{ name: "enemy", clazz: Enemy, x: 720, y: 350, health: 4, weaponName: "Mortar", canThrowGrenades: false },
			{ name: "enemy", clazz: Enemy, x: 795, y: 350, health: 4, weaponName: "SPAS", canThrowGrenades: false },
			{ name: "enemy", clazz: Enemy, x: 1120, y: 350, health: 4, weaponName: "SPAS", canThrowGrenades: false },
			{ name: "enemy", clazz: Enemy, x: 1190, y: 350, health: 4, weaponName: "Mortar", canThrowGrenades: false },
			{ name: "enemy", clazz: Enemy, x: 2700, y: 350, health: 4, weaponName: "Mac10", canThrowGrenades: false, shootDelay: 100 },
		],
		
		speeches: {
			color: "#fff", letterSpacing: 7, lineSpacing: 10,
			items: [
				{ identifier: "speechMortarGuy", text: "Oh no she's here. Opening fire.", x: 1070, b: 320, width: 100 }
			]
		},
		
		triggers: [
			{ identifier: "speechMortarGuy", xStart: 636, triggerFunctionName: "show", oneTime: true }
		],
		
		fires: [
			{ name: "fire1", x: 174, y: 368, width: 14 }
		],
		
		fireworkLaunchers: [
			{ name: "fireworklauncher1", x: 180, y: 370, angle: 0, spread: 20, interval: 10000 }
		],
		
		sky: { startColor: ["26", "26", "26"], transformations: null },
		
		lifts: [
			{ name: "longbuildinglift", startX: 2260, startY: 400, distance: 304 },
		],
		
		parallaxes: [
			{ 
				name: "farthestlight", x: 400, y: 367, scrollAttenuation: 0.8,
				sprite: { bitmapImage: "farthestlight.gif", sprites: { "main": { "f" : [0, 0, 22, 30] } } }
			},
			{ 
				name: "fartherlight", x: 480, y: 348, scrollAttenuation: 0.75,
				sprite: { bitmapImage: "fartherlight.gif", sprites: { "main": { "f" : [0, 0, 41, 52] } } }
			},
			{ 
				name: "closerlight", x: 750, y: 284, scrollAttenuation: 0.60,
				sprite: { bitmapImage: "closerlight.gif", sprites: { "main": { "f" : [0, 0, 89, 116] } } }
			},
			{ 
				name: "gantry", x: 0, y: 130, scrollAttenuation: 0.5,
				sprite: { bitmapImage: "gantry.gif", sprites: { "main": { "f" : [0, 0, 640, 280] } } }
			},
			
			{ 
				name: "floorsign1", x: 79, y: 296, scrollAttenuation: 0,
				sprite: { bitmapImage: "floorsign.gif", sprites: { "main": { "f" : [0, 0, 151, 99] } } }
			},
			{ 
				name: "building1", x: 795, y: 25, scrollAttenuation: 0,
				sprite: { bitmapImage: "building.gif", sprites: { "main": { "f" : [0, 0, 259, 370] } } }
			},
			{ 
				name: "floorsign2", x: 1177, y: 297, scrollAttenuation: 0,
				sprite: { bitmapImage: "floorsign.gif", sprites: { "main": { "f" : [0, 0, 151, 99] } } }
			},
			{ 
				name: "longbuilding", x: 2300, y: 96, scrollAttenuation: 0, zIndex: 2000,
				sprite: { bitmapImage: "longbuilding.png", sprites: { "main": { "f" : [0, 0, 400, 300] } } }
			},
			{ 
				name: "closestlight1", x: 1600, y: 91, scrollAttenuation: 0, zIndex: 2000,
				sprite: { bitmapImage: "closestlight.png", sprites: { "main": { "f" : [0, 0, 340, 304] } } }
			},
			{ 
				name: "closestlight3", x: 2800, y: 91, scrollAttenuation: 0, zIndex: 2000,
				sprite: { bitmapImage: "closestlight.png", sprites: { "main": { "f" : [0, 0, 340, 304] } } }
			}
		]
	}
}