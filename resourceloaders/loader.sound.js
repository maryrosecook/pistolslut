/**
 * The Render Engine
 * SoundResourceLoader
 *
 * @fileoverview A resource loader for MP3 sounds and a sound class for
 * 				  working with the loaded sounds via SoundManager 2.
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
Engine.include("/libs/soundmanager2.js");
Engine.include("/libs/AC_OETags.js");
Engine.include("/engine/engine.pooledobject.js");
Engine.include("/resourceloaders/loader.remote.js");

Engine.initObject("SoundLoader", "RemoteLoader", function() {

/**
 * @class Loads sounds and stores the reference to them.  Provides a simple
 *        way to play and stop the sounds that have been loaded.
 *        <p/>
 *        Sounds must be 44.1KHz and have a bitrate of 192k to play correctly.
 *
 * @constructor
 * @param name {String=SoundLoader} The name of the resource loader
 * @extends RemoteLoader
 */
var SoundLoader = RemoteLoader.extend(/** @scope SoundLoader.prototype */{

   init: false,

   queuedSounds: null,

   checkReady: null,

   soundManager: null,

   queueingSounds: true,

   loadingSounds: 0,

   /**
    * @private
    */
   constructor: function(name) {
      this.base(name || "SoundLoader");
      this.init = false;
      this.queuedSounds = [];
      this.queueingSounds = true;
      this.loadingSounds = 0;

      if (typeof SoundManager != "undefined") {

         // Create a link to the object
         this.soundManager = window.soundManager;
         this.soundManager.debugMode = false;

         // directory where SM2 .SWFs live
         this.soundManager.url = Engine.getEnginePath() + '/libs/';
			
			// Detect the version of flash available.  If 9 or higher, use 9
			var hasReqestedVersion = DetectFlashVer(9, 0, 0);
			if (hasReqestedVersion) {
				this.soundManager.flashVersion = 9;
			} else {
				this.soundManager.flashVersion = 8;
			}

         // Debugging enabled?
         this.soundManager.debugMode = EngineSupport.checkBooleanParam("debugSound");

         var self = this;

         this.soundManager.onload = function() {
            Engine.soundsEnabled = true;
            Console.warn("SoundManager loaded successfully");
            self.queueingSounds = false
            self.loadQueuedSounds();
         };

         this.soundManager.onerror = function() {
            Engine.soundsEnabled = false;
            Console.warn("SoundManager not loaded");
            self.queueingSounds = false;
            self.loadQueuedSounds();
         };

         if (Engine.getEnginePath().indexOf("file:") == 0) {
            this.soundManager.sandbox.type = "localWithFile";
         }

         this.soundManager.go();

      } else {
         Engine.soundsEnabled = false;
      }
   },

   destroy: function() {
      // Stop the sound manager
      if (Engine.isSoundEnabled()) {
         this.soundManager.destruct();
      }
   },

   /**
    * Load a sound resource from a URL. If the sound system does not initialize, for whatever
    * reason, you can still call the sound's methods.
    *
    * @param name {String} The name of the resource
    * @param url {String} The URL where the resource is located
    */
   load: function(name, url) {

      if (this.queueingSounds) {
         this.queuedSounds.push({n: name, u: url});
         return;
      }

      var soundObj = null;

      if (Engine.isSoundEnabled()) {

         // Only MP3 files are supported
         Assert(url.indexOf(".mp3") > 0, "Only MP3 sound format is supported!");

         // Create the sound object
         var sound = this.soundManager.createSound({
            "id": name,
            "url": url,
            "autoPlay": false,
            "autoLoad": true,
            "volume": 50
         });
         soundObj = Sound.create(name, sound);

         // We'll need to periodically check a sound's "readyState" for success
         // to know when the sound is ready for usage.
         this.loadingSounds++;
         if (!this.checkReady) {
            var self = this;
            this.checkReady = window.setTimeout(function() {
               var sounds = self.getResources();
               for (var s in sounds) {
                  if (!self.isReady(sounds[s]) && self.get(sounds[s]).smSound.readyState == SoundLoader.LOAD_SUCCESS) {
                     self.setReady(sounds[s], true);
                     self.loadingSounds--;
                  } else if (self.get(sounds[s]).smSound.readyState == SoundLoader.LOAD_ERROR) {
                     Console.error("An error occurred loading the sound ", sounds[s]);
                  }
               }

               if (self.loadingSounds != 0) {
                  // There are still sounds loading
                  self.checkReady = window.setTimeout(arguments.callee, 500);
               } else {
                  window.clearTimeout(self.checkReady);
                  self.checkReady = null;
               }
            }, 500);
         }

         if (!this.init) {
            Engine.getDefaultContext().add(this);
            this.init = true;
         }
      } else {
         soundObj = Sound.create(name, null);
      }

      this.base(name, soundObj);
   },

   loadQueuedSounds: function() {
      for (var s in this.queuedSounds) {
         this.load(this.queuedSounds[s].n, this.queuedSounds[s].u);
      }
      this.queuedSounds = null;
   },

   /**
    * Unload a sound, calling the proper methods in SoundManager2.
    *
    * @param sound {String} The name of the sound to unload
    */
   unload: function(sound) {
      var s = this.get(sound).destroy();
      this.base(sound);
   },

   /**
    * Creates a {@link Sound} object representing the named sound.
    *
    * @param resource {String} A loaded sound resource
    * @param sound {String} The name of the sound from the resource
    * @return {Sound} A {@link Sound} instance
    */
   getSound: function(sound) {
      return this.get(sound);
   },

   /**
    * The name of the resource this loader will get.
    * @return {String} The string "sound"
    */
   getResourceType: function() {
      return "sound";
   }
}, /** @scope SoundResourceLoader.prototype */{
   /**
    * Get the class name of this object
    * @return {String} The string "SoundResourceLoader"
    */
   getClassName: function() {
      return "SoundLoader";
   },

   /**
    * Indicates that a sound is loading.
    * @type Number
    */
   LOAD_LOADING: 1,

   /**
    * Indicates an error state during sound loading.
    * @type Number
    */
   LOAD_ERROR: 2,

   /**
    * Indicates a successful sound load.
    * @type Number
    */
   LOAD_SUCCESS: 3
});

return SoundLoader;

});

Engine.initObject("Sound", "PooledObject", function() {

/**
 * @class Represents a sound object that is abstracted from the sound system.
 *        In the current case, sound is loaded via SoundManager2 which is implemented
 *        with a flash bridge.  If the sound system does not initialize, for whatever
 *        reason, you can still call the sound's methods.
 *
 * @constructor
 * @param name {String} The name of the sound
 * @param soundObj {SMSound} A sound object returned from SoundManager2
 * @extends PooledObject
 */
var Sound = PooledObject.extend(/** @scope Sound.prototype */{

   smSound: null,

   volume: -1,

   paused: false,

   pan: -1,

   muted: false,

   /**
    * @private
    */
   constructor: function(name, soundObj) {
      this.smSound = soundObj;
      this.volume = 50;
      this.paused = false;
      this.pan = 0;
      this.muted = false;
      return this.base(name);
   },

   /**
    * Destroy the sound object
    */
   destroy: function() {
      this.smSound.unload();
      this.base();
   },

   /**
    * @private
    */
   release: function() {
      this.base();
      this.volume = -1;
      this.pan = -1;
      this.paused = false;
      this.muted = false;
      this.smSound = null;
   },

   /**
    * Play the sound.  If the volume is specified, it will set volume of the
    * sound before playing.  If the sound was paused, it will be resumed.
    *
    * @param volume {Number} <i>[optional]</i> An integer between 0 (muted) and 100 (full volume)
    */
   play: function(volume) {
      if (this.paused) {
         this.resume();
         return;
      }

      if (volume && volume != this.getVolume()) {
         this.setVolume(volume);
      }

      if (Engine.isSoundEnabled()) {
         this.smSound.play();
      }
   },

   /**
    * If the sound is playing, stop the sound and reset it to the beginning.
    */
   stop: function() {
      this.paused = false;
      if (Engine.isSoundEnabled()) {
         this.smSound.stop();
      }
   },

   /**
    * If the sound is playing, pause the sound.
    */
   pause: function() {
      this.paused = true;
      if (Engine.isSoundEnabled()) {
         this.smSound.pause();
      }
   },

   /**
    * Returns <tt>true</tt> if the sound is currently paused.
    * @return {Boolean} <tt>true</tt> if the sound is paused
    */
   isPaused: function() {
      return this.paused;
   },

   /**
    * If the sound is paused, it will resume playing the sound.
    */
   resume: function() {
      this.paused = false;
      if (Engine.isSoundEnabled()) {
         this.smSound.resume();
      }
   },

   /**
    * Mute the sound (set its volume to zero).
    */
   mute: function() {
      this.muted = true;
      if (Engine.isSoundEnabled()) {
         this.smSound.mute();
      }
   },

   /**
    * Unmute the sound (reset its volume to what it was before muting).
    */
   unmute: function() {
      if (!this.muted) {
         return;
      }

      this.muted = false;
      if (Engine.isSoundEnabled()) {
         this.smSound.unmute();
      }
   },

   /**
    * Set the volume of the sound to an integer between 0 (muted) and 100 (full volume).
    *
    * @param volume {Number} The volume of the sound
    */
   setVolume: function(volume) {
      if (isNaN(volume)) {
         return;
      }

      // clamp it
      volume = (volume < 0 ? 0 : volume > 100 ? 100 : volume);
      this.volume = volume;
      if (Engine.isSoundEnabled()) {
         this.smSound.setVolume(volume);
      }
   },

   /**
    * Get the volume the sound is playing at.
    * @return {Number} An integer between 0 and 100
    */
   getVolume: function() {
      return this.volume;
   },

   /**
    * Set the pan of the sound, with -100 being full left and 100 being full right.
    *
    * @param pan {Number} An integer between -100 and 100, with 0 being center.
    */
   setPan: function(pan) {
      this.pan = pan;
      if (Engine.isSoundEnabled()) {
         this.smSound.setPan(pan);
      }
   },

   /**
    * Get the pan of the sound, with -100 being full left and 100 being full right.
    * @return {Number} An integer between -100 and 100
    */
   getPan: function() {
      return this.pan;
   },

   /**
    * Set the sound offset in milliseconds.
    *
    * @param millisecondOffset {Number} The offset into the sound to play from
    */
   setPosition: function(millisecondOffset) {
      this.position = millisecondOffset;
      if (Engine.isSoundEnabled()) {
         this.smSound.setPosition(millisecondOffset);
      }
   },

   /**
    * Get the position of the sound, in milliseconds, from the start of the sound.
    * @return {Number} The millisecond offset into the sound
    */
   getLastPosition: function() {
      if (Engine.isSoundEnabled()) {
         this.position = this.smSound.position;
      }
      return this.position;
   },

   /**
    * Get the total size, in bytes, of the sound.  If the sound engine is not
    * initialized, returns 0.
    * @return {Number} The size of the sound, in bytes
    */
   getSizeBytes: function() {
      if (Engine.isSoundEnabled()) {
         return this.smSound.bytesTotal;
      }
      return 0;
   },

   /**
    * Get the length of the sound, in milliseconds.  If the sound hasn't fully loaded,
    * it will be the number of milliseconds currently loaded.  Due to the nature of
    * Variable Bitrate (VBR) sounds, this number may be inaccurate.
    * @return {Number} The length of the sound, in milliseconds
    */
   getDuration: function() {
      if (Engine.isSoundEnabled()) {
         return this.smSound.duration;
      }
      return 0;
   },

   getReadyState: function() {
      if (Engine.isSoundEnabled()) {
         return this.smSound.readyState;
      }
      return 0;
   }

}, /** @scope Sound.prototype */{
   /**
    * Gets the class name of this object.
    * @return {String} The string "Sound"
    */
   getClassName: function() {
      return "Sound";
   }
});

return Sound;

});
