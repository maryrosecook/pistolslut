{
	bitmapImage: "level1.gif",
	bitmapWidth: 2000,
	bitmapHeight: 580,
	collisionMap: [], // I don't use this for the level object collision rects
	objects: {
		signs: [
			{ text: "Pistol Slut", x: 89, y: 460, width: 140 },
			{ text: "Please  return  to  your  homes", x: 517, y: 172, width: 245	}
		],
		furniture: [
			{
				name: "platform1", x: 350, y: 507,
				sprite: {
					bitmapImage: "platform1.gif", bitmapWidth: 60, bitmapHeight: 30,
					sprites: {
						"main": {
							"f" : [0, 0, 60, 40]
						}
					}
				}
			},
			{
				name: "level1floor", x: 0, y: 546,
				sprite: {
					bitmapImage: "level1floor.gif", bitmapWidth: 2000, bitmapHeight: 34,
					sprites: {
						"main": {
							"f" : [0, 0, 2000, 34]
						}
					}
				}
			}
		]
		
		// "Please return to your homes", "It is illegal to buy or possess a gas mask",
		// 				"Your trade union is your voice", "Support your country: vote in the election",
		// 				"England is your future"]
	}
}