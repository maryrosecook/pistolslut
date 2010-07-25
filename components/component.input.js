/**
 * The Render Engine
 * InputComponent
 *
 * @fileoverview The base input component.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 1216 $
 *
 * Copyright (c) 2010 Brett Fattori (brettf@renderengine.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

// Includes
Engine.include("/components/component.base.js");

Engine.initObject("InputComponent", "BaseComponent", function() {

/**
 * @class A component which can read an input device and make those inputs
 *        available to a {@link HostObject}.
 *
 * @param name {String} The name of the component
 * @param [priority=1.0] {Number} The component's priority
 * @extends BaseComponent
 * @constructor
 * @description Create an input component.
 */
var InputComponent = BaseComponent.extend(/** @scope InputComponent.prototype */{

	recording: false,
	playback: false,
	script: null,
	lastInputTime: 0,

   /**
    * @private
    */
   constructor: function(name, priority) {
      this.base(name, BaseComponent.TYPE_INPUT, priority || 1.0);
		this.recording = false;
		this.playback = false;
   },
	
	startRecording: function() {
		Console.debug("RECORDING INPUT");
		this.recording = true;
		this.lastInputTime = Engine.worldTime;
		this.script = [];
	},
	
	stopRecording: function() {
		Console.debug("RECORDING STOPPED");
		this.recording = false;
	},
	
	getScript: function() {
		return this.script;
	},
	
	setScript: function(script) {
		this.script = script;
	},
	
	playEvent: function() {
		// ABSTRACT	
	},
	
	playScript: function(script) {
		this.recording = false;
		this.playback = true;
		this.script = script;
		
		var popCall = function() {
			if (arguments.callee.script.length == 0) {
				return;
			}
			if (arguments.callee.e != null) {
				Console.log("PLAYBACK:", arguments.callee.e.type);
				arguments.callee.self.playEvent(arguments.callee.e);
			}
			arguments.callee.e = arguments.callee.script.shift();
			setTimeout(arguments.callee, arguments.callee.e.delay);
		};
		popCall.script = this.script;
		popCall.self = this;
		popCall.e = null;
		
		popCall();
	},
	
	record: function(eventObj,parts) {
		if (!this.recording) {
			return;
		}
		var evtCall={};
		for (var x in parts) {
			evtCall[parts[x]] = eventObj[parts[x]];
		}
		evtCall.delay = Engine.worldTime - this.lastInputTime;
		this.lastInputTime = Engine.worldTime;
		evtCall.type = eventObj.type;
		this.script.push(evtCall);
	}
	
}, /** @scope InputComponent.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "InputComponent"
    */
   getClassName: function() {
      return "InputComponent";
   }
});

return InputComponent;

});