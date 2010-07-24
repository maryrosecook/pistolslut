{
	// Frame (f): left, top, frameWidth, frameHeight
	// Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
	bitmapImage: "girl.gif",
	bitmapWidth: 50,
	bitmapHeight: 25,
	sprites: {
		"leftstand": {
			"f" : [0, 46, 46, 46]
		},
		"leftrun": {
			"a" : [0, 46, 46, 46, 11, 100, "loop"]
		},
		"leftdying": {
			"a" : [0, 138, 46, 46, 7, 100, "loop"]
		},
		"leftdead": {
			"f" : [276, 138, 46, 46]
		},
		"rightstand": {
			"f" : [0, 0, 46, 46]
		},
		"rightrun": {
			"a" : [0, 0, 46, 46, 11, 100, "loop"]
		},
		"rightdying": {
			"a" : [0, 92, 46, 46, 7, 100, "loop"]
		},
		"rightdead": {
			"f" : [276, 92, 46, 46]
		}
	}
}