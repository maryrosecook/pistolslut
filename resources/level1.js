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
					bitmapImage: "blockwallleft.gif",
					sprites: { "main": { "f" : [0, 0, 20, 130] } }
				}
			},
			{
				name: "blockwallright", x: 1980, y: 417,
				sprite: {
					bitmapImage: "blockwallright.gif",
					sprites: { "main": { "f" : [0, 0, 20, 130] } }
				}
			},
			{
				name: "postbox1", x: 170, y: 509,
				sprite: {
					bitmapImage: "postbox.gif",
					sprites: { "main": { "f" : [0, 0, 16, 36] } }
				}
			},
			{
				name: "bin1", x: 370, y: 520,
				sprite: {
					bitmapImage: "bin.gif",
					sprites: { "main": { "f" : [0, 0, 20, 25] } }
				}
			},
			{
				name: "bin2", x: 1100, y: 520,
				sprite: {
					bitmapImage: "bin.gif",
					sprites: { "main": { "f" : [0, 0, 20, 25] } }
				}
			},
			{ name: "floorpiece1", x: 0, y: 546, sprite: { bitmapImage: "floorpiece.gif", sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece2", x: 400, y: 546, sprite: { bitmapImage: "floorpiece.gif", sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece3", x: 800, y: 546, sprite: { bitmapImage: "floorpiece.gif", sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece4", x: 1200, y: 546, sprite: { bitmapImage: "floorpiece.gif", sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece5", x: 1600, y: 546, sprite: { bitmapImage: "floorpiece.gif", sprites: { "main": { "f" : [0, 0, 400, 34] } } } }
		],
		
		enemies: [
			{ name: "enemy1", clazz: Enemy, x: 395, y: 500, health: 4, weaponName: "M9", canThrowGrenades: true },
			{ name: "enemy2", clazz: Enemy, x: 1140, y: 500, health: 4, weaponName: "M9", canThrowGrenades: false },
		],
		
		fires: [
			{ name: "fire1", x: 374, y: 520, width: 14 }
		],
		
		fireworkLaunchers: [
			{ name: "fireworklauncher1", x: 381, y: 520, angle: 0, spread: 20, interval: 10000 }
		],
		
		parallaxes: [
			{ 
				name: "farthestlight", x: 400, y: 507,
				scrollAttenuation: 0.8,
				sprite: {
					bitmapImage: "farthestlight.png",
					sprites: { "main": { "a" : [0, 0, 40, 40, 2, 6000, "loop"] } }
				}
			},
			{ 
				name: "fartherlight", x: 480, y: 450,
				scrollAttenuation: 0.75,
				sprite: {
					bitmapImage: "fartherlight.png",
					sprites: { "main": { "f" : [0, 0, 100, 100] } }
				}
			},
			{ 
				name: "closerlight", x: 750, y: 350,
				scrollAttenuation: 0.60,
				sprite: {
					bitmapImage: "closerlight.png",
					sprites: { "main": { "f" : [0, 0, 200, 200] } }
				}
			},
			{ 
				name: "gantry", x: 0, y: 280,
				scrollAttenuation: 0.5,
				sprite: {
					bitmapImage: "gantry.png",
					sprites: { "main": { "f" : [0, 0, 700, 300] } }
				}
			},
			{ 
				name: "street", x: 0, y: 0,
				scrollAttenuation: 0,
				sprite: {
					bitmapImage: "street.png",
					sprites: { "main": { "f" : [0, 0, 2000, 580] } }
				}
			}
		]
		// "It is illegal to buy or possess a gas mask", "Your trade union is your voice", "Be a good citizen: vote"]
	}
}