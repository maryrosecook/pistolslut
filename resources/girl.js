{
	// Frame (f): left, top, frameWidth, frameHeight
	// Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
	bitmapImage: "girl.gif",
	bitmapWidth: 50,
	bitmapHeight: 25,
	sprites: {
		"rightstand": {
			"f" : [0, 0, 46, 46]
		},
		"rightrun": {
			"a" : [0, 0, 46, 46, 11, 100, "loop"]
		},
		"leftstand": {
			"f" : [0, 46, 46, 46]
		},
		"leftrun": {
			"a" : [0, 46, 46, 46, 11, 100, "loop"]
		}
	}
}