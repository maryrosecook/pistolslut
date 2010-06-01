{
	// Frame (f): left, top, frameWidth, frameHeight
	// Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
	bitmapImage: "level1.gif", bitmapWidth: 2000, bitmapHeight: 580, collisionMap: [],
	objects: {
		signs: [
			{ text: "Pistol Slut", x: 89, y: 460, width: 140 },
			{ text: "Please  return  to  your  homes", x: 517, y: 172, width: 245	}
		],
		
		furniture: [
			{
				name: "wall1", x: 350, y: 495,
				sprite: {
					bitmapImage: "wall1.gif", bitmapWidth: 20, bitmapHeight: 52,
					sprites: {
						"main": { "f" : [0, 0, 20, 52] }
					}
				}
			},
			{
				name: "platform2", x: 370, y: 517,
				sprite: {
					bitmapImage: "platform2.gif", bitmapWidth: 40, bitmapHeight: 30,
					sprites: {
						"main": { "f" : [0, 0, 40, 30] }
					}
				}
			},
			{ name: "floorpiece1", x: 0, y: 546, sprite: { bitmapImage: "floorpiece.gif", bitmapWidth: 400, bitmapHeight: 34, sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece2", x: 400, y: 546, sprite: { bitmapImage: "floorpiece.gif", bitmapWidth: 400, bitmapHeight: 34, sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece3", x: 801, y: 546, sprite: { bitmapImage: "floorpiece.gif", bitmapWidth: 400, bitmapHeight: 34, sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece4", x: 1202, y: 546, sprite: { bitmapImage: "floorpiece.gif", bitmapWidth: 400, bitmapHeight: 34, sprites: { "main": { "f" : [0, 0, 400, 34] } } } },
			{ name: "floorpiece5", x: 1603, y: 546, sprite: { bitmapImage: "floorpiece.gif", bitmapWidth: 400, bitmapHeight: 34, sprites: { "main": { "f" : [0, 0, 400, 34] } } } }
		],
		
		enemies: [
			{
				name: "machinegunner1", x: 364, y: 472,
				sprite: {
					bitmapImage: "machinegunner.gif", bitmapWidth: 92, bitmapHeight: 46,
					sprites: {
						"standing": { "f" : [0, 0, 46, 46] },
						"shooting": { "a" : [0, 0, 46, 46, 2, 50, "loop"] }
					}
				}
			}
		]
		// "It is illegal to buy or possess a gas mask", "Your trade union is your voice", "Support your country: vote in the election", "England is your future"]
	}
}