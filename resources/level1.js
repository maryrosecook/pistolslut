{
	// Frame (f): left, top, frameWidth, frameHeight
	// Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
	bitmapImage: "level1.gif", bitmapWidth: 2000, bitmapHeight: 430, collisionMap: [],
	objects: {
		signs: {
			color: "#fff", letterSpacing: 7,
			items: [
				{ text: "Pistol  Slut", x: 89, y: 310, width: 140 },
				{ text: "Please  return  to  your  homes", x: 805, y: 44, width: 245	},
				{ text: "Free  shop", x: 1188, y: 311, width: 140 }
			]
		},

		furniture: [
			{
				name: "blockwallleft", x: 0, y: 267, 
				sprite: {
					bitmapImage: "blockwallleft.gif",
					sprites: { "main": { "f" : [0, 0, 20, 130] } }
				}
			},
			{
				name: "blockwallright", x: 1980, y: 267,
				sprite: {
					bitmapImage: "blockwallright.gif",
					sprites: { "main": { "f" : [0, 0, 20, 130] } }
				}
			},
			{
				name: "postbox1", x: 170, y: 359,
				sprite: {
					bitmapImage: "postbox.gif",
					sprites: { "main": { "f" : [0, 0, 18, 36] } }
				}
			},
			{
				name: "bin1", x: 370, y: 370,
				sprite: {
					bitmapImage: "bin.gif",
					sprites: { "main": { "f" : [0, 0, 20, 25] } }
				}
			},
			{
				name: "bin2", x: 1100, y: 370,
				sprite: {
					bitmapImage: "bin.gif",
					sprites: { "main": { "f" : [0, 0, 20, 25] } }
				}
			},
			{ name: "floorpiece1", x: 0, y: 396, sprite: { bitmapImage: "floorpiece.gif", sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece2", x: 400, y: 396, sprite: { bitmapImage: "floorpiece.gif", sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece3", x: 800, y: 396, sprite: { bitmapImage: "floorpiece.gif", sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece4", x: 1200, y: 396, sprite: { bitmapImage: "floorpiece.gif", sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece5", x: 1600, y: 396, sprite: { bitmapImage: "floorpiece.gif", sprites: { "main": { "f" : [0, 0, 400, 34] } } } }
		],
		
		enemies: [
			{ name: "enemy1", clazz: Enemy, x: 550, y: 350, health: 4, weaponName: "Mortar", canThrowGrenades: false },
			//{ name: "enemy2", clazz: Enemy, x: 1140, y: 350, health: 4, weaponName: "M9", canThrowGrenades: true },
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
			{ name: "fire1", x: 374, y: 370, width: 14 }
		],
		
		fireworkLaunchers: [
			{ name: "fireworklauncher1", x: 381, y: 370, angle: 0, spread: 20, interval: 10000 }
		],
		
		sky: {
			startColor: ["32", "32", "32"],
			transformations: [
				{ start: 50,  end: 110, parts: [0,1,2], },
				{ start: 110, end: 50,  parts: [0,1,2], }
			]
		},
		
		parallaxes: [
			{ 
				name: "farthestlight", x: 400, y: 357, scrollAttenuation: 0.8,
				sprite: {
					bitmapImage: "farthestlight.gif",
					sprites: { "main": { "a" : [0, 0, 40, 40, 2, 6000, "loop"] } }
				}
			},
			{ 
				name: "fartherlight", x: 480, y: 300, scrollAttenuation: 0.75,
				sprite: {
					bitmapImage: "fartherlight.gif",
					sprites: { "main": { "f" : [0, 0, 100, 100] } }
				}
			},
			{ 
				name: "closerlight", x: 750, y: 200, scrollAttenuation: 0.60,
				sprite: {
					bitmapImage: "closerlight.gif",
					sprites: { "main": { "f" : [0, 0, 200, 200] } }
				}
			},
			{ 
				name: "gantry", x: 0, y: 130, scrollAttenuation: 0.5,
				sprite: {
					bitmapImage: "gantry.gif",
					sprites: { "main": { "f" : [0, 0, 640, 280] } }
				}
			},
			{ 
				name: "street", x: 0, y: 0, scrollAttenuation: 0,
				sprite: {
					bitmapImage: "street.gif",
					sprites: { "main": { "f" : [0, 0, 2000, 430] } }
				}
			}
		]
	}
}