{
	bitmapImage: "level1.gif", bitmapWidth: 6000, bitmapHeight: 430, collisionMap: [],

    player: {
        startPosition: { x: 50, y: 344 },
    },

	objects: {
		signs: {
			color: "#fff", letterSpacing: 7,
			items: [
				{ text: "Pistol  Slut", x: 89, y: 310, width: 140 },
				{ text: "Please  return  to  your  homes", x: 805, y: 44, width: 245 },
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
			{ x: 370, y: 369, spriteName: "bin.gif" },
			{ x: 775, y: 370, spriteName: "sandbags.gif" },
			{ x: 1100, y: 369, spriteName: "bin.gif" },
			{ x: 2000, y: 370, spriteName: "sandbags.gif" },
			{ x: 3050, y: 369, spriteName: "bin.gif" },
            { x: 3930, y: 369, spriteName: "drystonewall1.gif" },
            { x: 4330, y: 369, spriteName: "drystonewall2.gif" },
			{ x: 5989, y: 328, spriteName: "fenceright.gif" },
		],

		blockFurniture: [
			{ name: "bridgebody", shape: { x: 2364, y: 207, w: 551, h: 20 }, visible: false },
			{ name: "bridgebollard1", shape: { x: 2400, y: 369, w: 20, h: 27 }, visible: true },
			{ name: "bridgebollard2", shape: { x: 2600, y: 369, w: 20, h: 27 }, visible: true },
			{ name: "bridgebollard3", shape: { x: 2800, y: 369, w: 20, h: 27 }, visible: true },

			{ name: "scaffoldingafterbridge", shape: { x: 2960, y: 270, w: 280, h: 10 }, visible: false },

			{ name: "bunkerfrontblock", shape: { x: 3300, y: 362, w: 20, h: 34 }, visible: true },
			{ name: "bunkerfrontwall", shape: { x: 3300, y: 284, w: 20, h: 65 }, visible: true },
			{ name: "bunkerbackblock", shape: { x: 3515, y: 364, w: 20, h: 32 }, visible: true },
			{ name: "bunkerbackwall", shape: { x: 3515, y: 284, w: 20, h: 30 }, visible: true },
			{ name: "bunkerceilingleft", shape: { x: 3320, y: 284, w: 35, h: 20 }, visible: true },
			{ name: "bunkerceilingright", shape: { x: 3415, y: 284, w: 100, h: 20 }, visible: true },
		],

		enemies: [
			{ name: "firstenemy", clazz: Enemy, x: 810, y: 350, type: "cannonfodder", direction: "Right" },
			{ name: "easyspotter", clazz: Enemy, x: 1120, y: 350, type: "grenadier" },
			{ name: "easymortarer", clazz: Enemy, x: 1190, y: 350, type: "mortarer" },
			{ name: "bridgespotter", clazz: Enemy, x: 2400, y: 130, type: "cannonfodder" },
			{ name: "bridgemortarer", clazz: Enemy, x: 2500, y: 130, type: "mortarer" },
			{ name: "underbridge1", clazz: Enemy, x: 2510, y: 350, type: "cannonfodder" },
			{ name: "underbridge2", clazz: Enemy, x: 2625, y: 350, type: "grunt" },
			{ name: "underbridge3", clazz: Enemy, x: 2900, y: 350, type: "captain" },
			{ name: "bunker1", clazz: Enemy, x: 3325, y: 350, type: "captain" },
			{ name: "parkguard", clazz: Enemy, x: 3950, y: 350, type: "cannonfodder" },
			{ name: "parkmortarer", clazz: Enemy, x: 4170, y: 350, type: "mortarer" },
			{ name: "parkmachinegunner", clazz: Enemy, x: 4350, y: 350, type: "captain" },
		],

		speeches: {
			color: "#fff",
			items: [
				{ identifier: "speechMortarGuy", text: "CONTACT,  LEFT.  COVER.", x: 1070, b: 320, width: 100 },
			]
		},

		triggers: [
			{ identifier: "speechMortarGuy", xStart: 636, triggerFunctionName: "show", oneTime: true },
		],

		fires: [
			{ name: "fire1", x: 374, y: 368, width: 14 }
		],

		fireworkLaunchers: [
			{ name: "fireworklauncher1", x: 381, y: 370, angle: 0, spread: 20, interval: 10000 }
		],

		sky: { startColor: "3C3F76", transformations: null },

		lifts: [
			{ name: "longbuildinglift", startX: 2301, startY: 400, distance: 193, width: 64 },
		],

        barrels: [
            { name: "bridgebarrel", x: 2600, y: 180 },
            { name: "bridgebarrel", x: 3450, y: 369 },
        ],

        windows: [
            { name: "skylightwindow", x: 3355, y: 284, width: 60, height: 2 },
            { name: "bunkerbackwallwindow", x: 3532, y: 314, width: 3, height: 50 },
        ],

		parallaxes: [
			{
				name: "fartherlight", x: 630, y: 348, scrollAttenuation: 0.75,
				sprite: { bitmapImage: "fartherlight.gif", sprites: { "main": { "f" : [0, 0, 41, 52] } } }
			},
			{
				name: "closerlight", x: 870, y: 284, scrollAttenuation: 0.60,
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
				sprite: { bitmapImage: "building.gif", sprites: { "main": { "f" : [0, 0, 261, 375] } } }
			},
			{
				name: "floorsign2", x: 1177, y: 297, scrollAttenuation: 0,
				sprite: { bitmapImage: "floorsign.gif", sprites: { "main": { "f" : [0, 0, 151, 99] } } }
			},
			{
				name: "bridgea", x: 2300, y: 144, scrollAttenuation: 0, zIndex: 2001,
				sprite: { bitmapImage: "bridgea.png", sprites: { "main": { "f" : [0, 0, 613, 66] } } }
			},
			{
				name: "bridgeb", x: 2300, y: 210, scrollAttenuation: 0, zIndex: 2001,
				sprite: { bitmapImage: "bridgeb.png", sprites: { "main": { "f" : [0, 0, 66, 119] } } }
			},
			{
				name: "bridgec", x: 2848, y: 210, scrollAttenuation: 0, zIndex: 2001,
				sprite: { bitmapImage: "bridgec.png", sprites: { "main": { "f" : [0, 0, 64, 119] } } }
			},
			{
				name: "bridged", x: 2300, y: 329, scrollAttenuation: 0, zIndex: 2001,
				sprite: { bitmapImage: "bridged.png", sprites: { "main": { "f" : [0, 0, 613, 101] } } }
			},
			{
				name: "scaffolding", x: 2960, y: 222, scrollAttenuation: 0, zIndex: 2001,
				sprite: { bitmapImage: "scaffolding.gif", sprites: { "main": { "f" : [0, 0, 280, 51] } } }
			},
			{
				name: "craneline", x: 3099, y: 0, scrollAttenuation: 0, zIndex: 2001,
				sprite: { bitmapImage: "craneline.gif", sprites: { "main": { "f" : [0, 0, 1, 222] } } }
			},
			{
				name: "closestlight1", x: 1350, y: 92, scrollAttenuation: 0, zIndex: 2000,
				sprite: { bitmapImage: "closestlight.png", sprites: { "main": { "f" : [0, 0, 227, 304] } } }
			},
			{
				name: "signpistol", x: 4800, y: 95, scrollAttenuation: -1.6, zIndex: 2001,
				sprite: { bitmapImage: "signpistol.png", sprites: { "main": { "f" : [0, 0, 380, 394] } } }
			},
			{
				name: "treea", x: 3867, y: 2, scrollAttenuation: 0,
				sprite: { bitmapImage: "treea.png", sprites: { "main": { "f" : [0, 0, 535, 336] } } }
			},
			{
				name: "treeb", x: 4122, y: 337, scrollAttenuation: 0,
				sprite: { bitmapImage: "treeb.png", sprites: { "main": { "f" : [0, 0, 72, 59] } } }
			},
		]
	}
}