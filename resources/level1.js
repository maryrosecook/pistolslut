{
	// Frame (f): left, top, frameWidth, frameHeight
	// Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
	bitmapImage: "level1.gif", bitmapWidth: 2000, bitmapHeight: 580, collisionMap: [],
	objects: {
		signs: [
			{ text: "Pistol  Slut", x: 89, y: 460, width: 140 },
			{ text: "Please  return  to  your  homes", x: 805, y: 172, width: 245	},
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
				name: "bin3", x: 1100, y: 520,
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
			{ name: "enemy2", clazz: Enemy, x: 1140, y: 500, health: 4 },
		],
		
		fires: [
			{ name: "fire1", x: 374, y: 520, width: 14 }
		],
		
		fireworkLaunchers: [
			{ name: "fireworklauncher1", x: 381, y: 520, angle: 0, spread: 20, interval: 10000 }
		],
		
		parallaxes: [
			{ 
				name: "farthestlight", zIndex: 2, x: 400, y: 507,
				scrollAttenuation: 0.8,
				sprite: {
					bitmapImage: "farthestlight.png", bitmapWidth: 80, bitmapHeight: 40,
					sprites: { "main": { "a" : [0, 0, 40, 40, 2, 6000, "loop"] } }
				}
			},
			{ 
				name: "fartherlight", zIndex: 3, x: 480, y: 450,
				scrollAttenuation: 0.75,
				sprite: {
					bitmapImage: "fartherlight.png", bitmapWidth: 100, bitmapHeight: 100,
					sprites: { "main": { "f" : [0, 0, 100, 100] } }
				}
			},
			{ 
				name: "closerlight", zIndex: 4, x: 750, y: 350,
				scrollAttenuation: 0.60,
				sprite: {
					bitmapImage: "closerlight.png", bitmapWidth: 200, bitmapHeight: 200,
					sprites: { "main": { "f" : [0, 0, 200, 200] } }
				}
			},
			{ 
				name: "gantry", zIndex: 5, x: 0, y: 280,
				scrollAttenuation: 0.5,
				sprite: {
					bitmapImage: "gantry.png", bitmapWidth: 700, bitmapHeight: 300,
					sprites: { "main": { "f" : [0, 0, 700, 300] } }
				}
			},
			{ 
				name: "street", zIndex: 6, x: 0, y: 0,
				scrollAttenuation: 0,
				sprite: {
					bitmapImage: "street.png", bitmapWidth: 2000, bitmapHeight: 580,
					sprites: { "main": { "f" : [0, 0, 2000, 580] } }
				}
			}
		]
		// "It is illegal to buy or possess a gas mask", "Your trade union is your voice", "Be a good citizen: vote"]
	}
}