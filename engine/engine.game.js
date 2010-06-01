/**
 * The Render Engine
 * Game
 *
 * @fileoverview The game object represents an instance of a game.  It is
 * 				  the controlling entity for all of a game and is responsible
 * 				  for setup and teardown of the game.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 615 $
 *
 * Copyright (c) 2008 Brett Fattori (brettf@renderengine.com)
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
 * THE SOFTWARE
 */
Engine.initObject("Game", null, function() {

/**
 * @class The game object represents an instance of a game.  It is
 * the controlling entity for all of a game and is responsible
 * for setup and teardown of the game.
 */
var Game = Base.extend(/** @scope Game.prototype */{

   scriptsToLoad: [],

   constructor: null,

   /**
    * Initialize the game.
    * @memberOf Game
    * @static
    */
   setup: function() {
   },

   /**
    * Shut down the game.
    * @memberOf Game
    * @static
    */
   tearDown: function() {
   },

   /**
    * Get the display name of the game.
    * @memberOf Game
    * @static
    */
   getName: function() {
      return "Game";
   },

   /**
    * Load a script relative to this game.  Scripts cannot be specified
    * with an absolute URL.
    *
    * @param scriptSource {String} The relative path to the script to load.
    * @memberOf Game
    * @static
    */
   load: function(scriptSource) {
      Assert((scriptSource.indexOf("http") == -1), "Game scripts can only be loaded relative to the game's path");
      Engine.loadScript( (scriptSource.charAt(0) != "/" ? "./" : ".") + scriptSource );
   },

	/**
	 * Load a script, relative to the game engine.  Scripts cannot be loaded
	 * with an absolute URL.
	 * 
	 * @param scriptPath {String} The relative path of the script to load.
	 */
   loadEngineScript: function(scriptPath) {
      Engine.loadNow(scriptPath, Game.scriptLoaded);
   },

   scriptLoaded: function(scriptPath) {
   },

   /**
    * Abstracted to keep games separate from Engine
    */
   setQueueCallback: function(cb) {
      Engine.setQueueCallback(cb);
   },

   getGamePath: function() {
      var loc = window.location;
      var path = loc.protocol + "//" + loc.host + loc.pathname.substring(0,loc.pathname.lastIndexOf("/"));
      path += (path.charAt(path.length - 1) == "/" ? "" : "/");
      return path;
   },

   getFilePath: function(fileName) {
      var loc = window.location;
      if (fileName.indexOf(loc.protocol) != -1 && fileName.indexOf(loc.host) == -1) {
         throw new Error("File cannot be located on another server!");
      }

      if (fileName.indexOf(loc.protocol) == -1) {
         return this.getGamePath() + fileName;
      } else {
         return file;
      }
   }
});

return Game;

});