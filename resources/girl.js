{
	// Frame (f): left, top, frameWidth, frameHeight
	// Animation (a): left, top, frameWidth, frameHeight, frameCount, speedMS, loop/toggle
	bitmapImage: "girl.gif",
	bitmapWidth: 506,
	bitmapHeight: 230,
	sprites: {
		"leftstandingstill": {
			"f" : [0, 46, 46, 46]
		},
		"leftstandingrunning": {
			"a" : [0, 46, 46, 46, 11, 100, "loop"]
		},
		"leftdying": {
			"a" : [0, 138, 46, 46, 7, 100, "loop"]
		},
		"leftdead": {
			"f" : [276, 138, 46, 46]
		},
		"leftcrouchingstill": {
			"f" : [0, 219, 46, 35]
		},
		"rightstandingstill": {
			"f" : [0, 0, 46, 46]
		},
		"rightstandingrunning": {
			"a" : [0, 0, 46, 46, 11, 100, "loop"]
		},
		"rightdying": {
			"a" : [0, 92, 46, 46, 7, 100, "loop"]
		},
		"rightdead": {
			"f" : [276, 92, 46, 46]
		},
		"rightcrouchingstill": {
			"f" : [0, 185, 46, 35]
		}
	}
}