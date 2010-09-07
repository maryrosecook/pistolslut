{
	// Frame (f): left, top, frameWidth, frameHeight
	// Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
	bitmapImage: "level1.gif", bitmapWidth: 2000, bitmapHeight: 580, collisionMap: [],
	objects: {
		signs: [
			{ text: "Pistol  Slut", x: 89, y: 460, width: 140 },
			{ text: "Please  return  to  your  homes", x: 517, y: 172, width: 245	},
			{ text: "Free  shop", x: 1188, y: 461, width: 140 }
		],
		
		furniture: [
			{
				name: "blockwallleft", x: 0, y: 417,
				sprite: {
					bitmapImage: "blockwallleft.gif", bitmapWidth: 20, bitmapHeight: 130,
					sprites: { "main": { "f" : [0, 0, 20, 130] } }
				}
			},
			{
				name: "blockwallright", x: 1980, y: 417,
				sprite: {
					bitmapImage: "blockwallright.gif", bitmapWidth: 20, bitmapHeight: 130,
					sprites: { "main": { "f" : [0, 0, 20, 130] } }
				}
			},
			{
				name: "bin1", x: 170, y: 520,
				sprite: {
					bitmapImage: "bin.gif", bitmapWidth: 20, bitmapHeight: 25,
					sprites: { "main": { "f" : [0, 0, 20, 25] } }
				}
			},
			{
				name: "bin2", x: 370, y: 520,
				sprite: {
					bitmapImage: "bin.gif", bitmapWidth: 20, bitmapHeight: 25,
					sprites: { "main": { "f" : [0, 0, 20, 25] } }
				}
			},
			{
				name: "bin3", x: 1000, y: 520,
				sprite: {
					bitmapImage: "bin.gif", bitmapWidth: 20, bitmapHeight: 25,
					sprites: { "main": { "f" : [0, 0, 20, 25] } }
				}
			},
			{ name: "floorpiece1", x: 0, y: 546, sprite: { bitmapImage: "floorpiece.gif", bitmapWidth: 400, bitmapHeight: 34, sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece2", x: 400, y: 546, sprite: { bitmapImage: "floorpiece.gif", bitmapWidth: 400, bitmapHeight: 34, sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece3", x: 800, y: 546, sprite: { bitmapImage: "floorpiece.gif", bitmapWidth: 400, bitmapHeight: 34, sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece4", x: 1200, y: 546, sprite: { bitmapImage: "floorpiece.gif", bitmapWidth: 400, bitmapHeight: 34, sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece5", x: 1600, y: 546, sprite: { bitmapImage: "floorpiece.gif", bitmapWidth: 400, bitmapHeight: 34, sprites: { "main": { "f" : [0, 0, 400, 34] } } } }
		],
		
		enemies: [
			{ name: "enemy1", clazz: Enemy, x: 395, y: 500, health: 4 },
			{ name: "enemy2", clazz: Enemy, x: 1025, y: 500, health: 4 },
		],
		
		fires: [
			{ name: "fire1", x: 374, y: 520, width: 14 }
		],
		
		fireworkLaunchers: [
			{ name: "fireworklauncher1", x: 381, y: 520, angle: 0, spread: 20, interval: 10000 }
		],
		
		parallaxes: [
			// { 
			// 	name: "hills", zIndex: 2,
			// 	sprite: {
			// 		bitmapImage: "hills.gif", bitmapWidth: 500, bitmapHeight: 580,
			// 		sprites: { "main": { "f" : [0, 0, 500, 580] } }
			// 	}
			// },
			{ 
				name: "city", zIndex: 3,
				sprite: {
					bitmapImage: "city.gif", bitmapWidth: 1000, bitmapHeight: 580,
					sprites: { "main": { "f" : [0, 0, 1000, 580] } }
				}
			},
			{ 
				name: "street", zIndex: 4,
				sprite: {
					bitmapImage: "street.gif", bitmapWidth: 2000, bitmapHeight: 580,
					sprites: { "main": { "f" : [0, 0, 2000, 580] } }
				}
			}
		]
		// "It is illegal to buy or possess a gas mask", "Your trade union is your voice", "Be a good citizen: vote"]
	}
}