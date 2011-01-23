{
	// Frame (f): left, top, frameWidth, frameHeight
	// Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
	bitmapImage: "level1.gif", bitmapWidth: 6000, bitmapHeight: 430, collisionMap: [],

    player: {
        startPosition: { x: 50, y: 344 },
    },

	objects: {
		signs: {
			color: "#fff", letterSpacing: 7,
			items: [
				{ text: "Pistol  Slut", x: 89, y: 310, width: 140 },
				{ text: "Please  return  to  your  homes", x: 805, y: 44, width: 245	},
				{ text: "Free  shop  opening  soon", x: 1188, y: 311, width: 140 },
			]
		},

		sprites: [
			{ bitmapImage: "fenceleft.gif", sprites: { "main": { "f": [0, 0, 11, 67] } } },
			{ bitmapImage: "bin.gif", sprites: { "main": { "f": [0, 0, 20, 27] } } },
			{ bitmapImage: "sandbags.gif", sprites: { "main": { "f": [0, 0, 18, 26] } } },
			{ bitmapImage: "lantern.png", sprites: { "main": { "f": [0, 0, 14, 13] } } },
			{ bitmapImage: "barrel.gif", sprites: { "main": { "f": [0, 0, 20, 27] } } },
			{ bitmapImage: "grenade.gif", sprites: { "main": { "a": [0, 0, 11, 11, 4, 100, "loop"] } } },
			{ bitmapImage: "crosshair.png", sprites: { "main": { "f": [0, 0, 3, 3] } } },
			{ bitmapImage: "drystonewall1.gif", sprites: { "main": { "f": [0, 0, 15, 27] } } },
			{ bitmapImage: "drystonewall2.gif", sprites: { "main": { "f": [0, 0, 15, 27] } } },
			{ bitmapImage: "fenceright.gif", sprites: { "main": { "f": [0, 0, 11, 67] } } },
		],

		spriteFurniture: [
			{ x: 0, y: 328, spriteName: "fenceleft.gif" },
			{ x: 170, y: 369, spriteName: "bin.gif" },
			{ x: 370, y: 369, spriteName: "bin.gif" },
			{ x: 775, y: 370, spriteName: "sandbags.gif" },
			{ x: 1100, y: 369, spriteName: "bin.gif" },
			{ x: 2000, y: 370, spriteName: "sandbags.gif" },
			{ x: 2315, y: 369, spriteName: "bin.gif" },
			{ x: 2665, y: 369, spriteName: "bin.gif" },
            { x: 4000, y: 369, spriteName: "drystonewall1.gif" },
            { x: 4400, y: 369, spriteName: "drystonewall2.gif" },
			{ x: 5989, y: 328, spriteName: "fenceright.gif" },
		],

		blockFurniture: [
			{ name: "longbuildingbody1", shape: { x: 2300, y: 96, w: 400, h: 212 } },
		],

		enemies: [
			{ name: "enemy", clazz: Enemy, x: 795, y: 350, type: "cannonfodder" },
			{ name: "enemy", clazz: Enemy, x: 1120, y: 350, type: "grenadier" },
			{ name: "enemy", clazz: Enemy, x: 1190, y: 350, type: "mortarer" },
			{ name: "enemy", clazz: Enemy, x: 2400, y: 350, type: "cannonfodder" },
			{ name: "enemy", clazz: Enemy, x: 2700, y: 350, type: "captain" },
			{ name: "enemy", clazz: Enemy, x: 4020, y: 350, type: "cannonfodder" },
			{ name: "enemy", clazz: Enemy, x: 4340, y: 350, type: "mortarer" },
			{ name: "enemy", clazz: Enemy, x: 4420, y: 350, type: "captain" },
		],

		speeches: {
			color: "#fff",
			items: [
				//{ identifier: "speechMortarGuy", text: "Oh no she's here. Opening fire.", x: 1070, b: 320, width: 100 },
			]
		},

		triggers: [
			//{ identifier: "speechMortarGuy", xStart: 636, triggerFunctionName: "show", oneTime: true },
		],

		fires: [
			{ name: "fire1", x: 174, y: 368, width: 14 }
		],

		fireworkLaunchers: [
			{ name: "fireworklauncher1", x: 180, y: 370, angle: 0, spread: 20, interval: 10000 }
		],

		sky: { startColor: ["26", "26", "26"], transformations: null },

		lifts: [
			{ name: "longbuildinglift", startX: 2259, startY: 400, distance: 304 },
		],

        barrels: [
            { x: 2500, y: 69 },
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
				name: "gantrya", x: 0, y: 130, scrollAttenuation: 0.5,
				sprite: { bitmapImage: "gantrya.gif", sprites: { "main": { "f" : [0, 0, 640, 82] } } }
			},
			{
				name: "gantryb", x: 606, y: 212, scrollAttenuation: 0.5,
				sprite: { bitmapImage: "gantryb.gif", sprites: { "main": { "f" : [0, 0, 34, 198] } } }
			},

			{
				name: "floorsign1", x: 79, y: 296, scrollAttenuation: 0,
				sprite: { bitmapImage: "floorsign.gif", sprites: { "main": { "f" : [0, 0, 151, 99] } } }
			},
			{
				name: "building1", x: 795, y: 26, scrollAttenuation: 0,
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
				name: "longbuildingfence", x: 2300, y: 76, scrollAttenuation: 0, zIndex: 2000,
				sprite: { bitmapImage: "longbuildingfence.png", sprites: { "main": { "f" : [0, 0, 400, 20] } } }
			},
			{
				name: "closestlight1", x: 1600, y: 92, scrollAttenuation: 0, zIndex: 2000,
				sprite: { bitmapImage: "closestlight.png", sprites: { "main": { "f" : [0, 0, 227, 304] } } }
			},
			{
				name: "closestlight2", x: 3000, y: 92, scrollAttenuation: 0, zIndex: 2000,
				sprite: { bitmapImage: "closestlight.png", sprites: { "main": { "f" : [0, 0, 227, 304] } } }
			},
			{
				name: "closestlight2", x: 3500, y: 92, scrollAttenuation: 0, zIndex: 2000,
				sprite: { bitmapImage: "closestlight.png", sprites: { "main": { "f" : [0, 0, 227, 304] } } }
			},
			{
				name: "signpistol", x: 7500, y: 95, scrollAttenuation: -1.6, zIndex: 2001,
				sprite: { bitmapImage: "signpistol.png", sprites: { "main": { "f" : [0, 0, 380, 394] } } }
			},
			{
				name: "treea", x: 3937, y: 2, scrollAttenuation: 0,
				sprite: { bitmapImage: "treea.png", sprites: { "main": { "f" : [0, 0, 535, 336] } } }
			},
			{
				name: "treeb", x: 4192, y: 337, scrollAttenuation: 0,
				sprite: { bitmapImage: "treeb.png", sprites: { "main": { "f" : [0, 0, 72, 59] } } }
			},
			{
				name: "daffsingles", x: 4100, y: 387, scrollAttenuation: 0,
				sprite: { bitmapImage: "daffsingles.png", sprites: { "main": { "f" : [0, 0, 30, 8] } } }
			},
			{
				name: "daffsingles", x: 4300, y: 387, scrollAttenuation: 0,
				sprite: { bitmapImage: "daffsingles.png", sprites: { "main": { "f" : [0, 0, 30, 8] } } }
			},
		]
	}
}