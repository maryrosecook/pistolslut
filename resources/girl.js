{
	// Frame (f): left, top, frameWidth, frameHeight
	// Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
	bitmapImage: "girl.gif",
	bitmapWidth: 50,
	bitmapHeight: 25,
	sprites: {
		"rightstand": {
			"f" : [0, 0, 25, 25]
		},
		"rightrun": {
			"a" : [0, 0, 25, 25, 2, 150, "loop"]
		},
		"leftstand": {
			"f" : [0, 25, 25, 25]
		},
		"leftrun": {
			"a" : [0, 25, 25, 25, 2, 150, "loop"]
		}
	}
}