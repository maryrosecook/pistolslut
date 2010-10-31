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
			{ bitmapImage: "blockwall.gif", sprites: { "main": { "f": [0, 0, 20, 130] } } },
			{ bitmapImage: "bin.gif", sprites: { "main": { "f": [0, 0, 20, 27] } } },
			{ bitmapImage: "sandbags.gif", sprites: { "main": { "f": [0, 0, 18, 26] } } },
			{ bitmapImage: "busstop.gif", sprites: { "main": { "f": [0, 0, 154, 18] } } },
			{ bitmapImage: "floorpiece.gif", sprites: { "main": { "f": [0, 0, 420, 34] } } },
			{ bitmapImage: "lantern.gif", sprites: { "main": { "f": [0, 0, 14, 13] } } },
			{ bitmapImage: "grenade.gif", sprites: { "main": { "a": [0, 0, 11, 11, 4, 100, "loop"] } } },		
			{ bitmapImage: "crosshair.gif", sprites: { "main": { "f": [0, 0, 3, 3] } } },
		],

		furniture: [
			{ name: "blockwallleft", x: 0, y: 267, spriteName: "blockwall.gif" },
			{ name: "blockwallright", x: 3980, y: 267, spriteName: "blockwall.gif" },
			{ name: "bin", x: 170, y: 368, spriteName: "bin.gif" },
			{ name: "bin", x: 370, y: 368, spriteName: "bin.gif" },
			{ name: "busstop", x: 300, y: 280, spriteName: "busstop.gif" },
			{ name: "sandbags", x: 775, y: 369, spriteName: "sandbags.gif" },
			{ name: "bin", x: 1100, y: 368, spriteName: "bin.gif" },
			{ name: "floorpiece", x: 0, y: 394, spriteName: "floorpiece.gif" },
			{ name: "floorpiece", x: 400, y: 394, spriteName: "floorpiece.gif" },
			{ name: "floorpiece", x: 800, y: 394, spriteName: "floorpiece.gif" },
			{ name: "floorpiece", x: 1200, y: 394, spriteName: "floorpiece.gif" },
			{ name: "floorpiece", x: 1600, y: 394, spriteName: "floorpiece.gif" },
			{ name: "floorpiece", x: 2000, y: 394, spriteName: "floorpiece.gif" },
			{ name: "floorpiece", x: 2400, y: 394, spriteName: "floorpiece.gif" },
			{ name: "floorpiece", x: 2800, y: 394, spriteName: "floorpiece.gif" },
			{ name: "floorpiece", x: 3200, y: 394, spriteName: "floorpiece.gif" },
			{ name: "floorpiece", x: 3600, y: 394, spriteName: "floorpiece.gif" },
		],
		
		enemies: [
			{ name: "enemy", clazz: Enemy, x: 390, y: 350, health: 4, weaponName: "M9", canThrowGrenades: false },
			{ name: "enemy", clazz: Enemy, x: 720, y: 350, health: 4, weaponName: "Mortar", canThrowGrenades: false },
			{ name: "enemy", clazz: Enemy, x: 795, y: 350, health: 4, weaponName: "SPAS", canThrowGrenades: false },
			{ name: "enemy", clazz: Enemy, x: 1120, y: 350, health: 4, weaponName: "SPAS", canThrowGrenades: false },
			{ name: "enemy", clazz: Enemy, x: 1190, y: 350, health: 4, weaponName: "Mortar", canThrowGrenades: false },
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
				name: "busstopframe", x: 300, y: 298, scrollAttenuation: 0,
				sprite: { bitmapImage: "busstopframe.gif", sprites: { "main": { "f" : [0, 0, 154, 97] } } }
			},
			{ 
				name: "building", x: 795, y: 25, scrollAttenuation: 0,
				sprite: { bitmapImage: "building.gif", sprites: { "main": { "f" : [0, 0, 259, 370] } } }
			},
			{ 
				name: "floorsign2", x: 1177, y: 297, scrollAttenuation: 0,
				sprite: { bitmapImage: "floorsign.gif", sprites: { "main": { "f" : [0, 0, 151, 99] } } }
			},
			{ 
				name: "closestlight1", x: 1600, y: 91, scrollAttenuation: 0,
				sprite: { bitmapImage: "closestlight.gif", sprites: { "main": { "f" : [0, 0, 231, 304] } } }
			},
			{ 
				name: "closestlight2", x: 2200, y: 91, scrollAttenuation: 0,
				sprite: { bitmapImage: "closestlight.gif", sprites: { "main": { "f" : [0, 0, 231, 304] } } }
			},
			{ 
				name: "closestlight3", x: 2800, y: 91, scrollAttenuation: 0,
				sprite: { bitmapImage: "closestlight.gif", sprites: { "main": { "f" : [0, 0, 231, 304] } } }
			}
		]
	}
}