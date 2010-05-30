/*!
 * The Render Engine is a Javascript game engine written from the ground
 * up to be easy to use and fully expandable.  It runs on a number of
 * browser platforms, including Gecko, Webkit, and Opera.  Visit
 * http://code.google.com/p/renderengine for more information.
 *
 * author: Brett Fattori (brettf@renderengine.com)
 * version: beta 1.4.0
 * date: 11/15/2009
 *
 * Copyright (c) 2009 Brett Fattori (brettf@renderengine.com)
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
/**
 * The Render Engine
 * Console
 *
 * @fileoverview A debug console abstraction
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 716 $
 *
 * Copyright (c) 2009 Brett Fattori (brettf@renderengine.com)
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


/**
 * @class The base class for all console objects. Each type of supported console outputs
 *        its data differently.  This class allows abstraction between the console and the
 *        browser's console object so the {@link Console} can report to it.
 */
var ConsoleRef = Base.extend(/** @scope ConsoleRef.prototype */{
   constructor: function() {
   },

   dumpWindow: null,

   /** @private */
   combiner: function() {
      var out = "";
      for (var a = 0; a < arguments.length; a++) {
         out += arguments[a].toString();
      }
      return out;
   },

   cleanup: function(o) {
      if (typeof o == "undefined") {
         return "";
      } else if (typeof o == "function") {
         return "function";
      } else if (o.constructor == Array || (o.slice && o.join && o.splice)) {	// An array
         var s = "[";
         for (var e in o) {
            s += (s.length > 1 ? "," : "") + this.cleanup(o[e]);
         }
         return s + "]";
      } else if (typeof o == "object") {
         var s = "{\n";
         for (var e in o) {
            s += e + ": " + this.cleanup(o[e]) + "\n";
         }
         return s + "}\n";
      } else {
         return o.toString();
      }
   },

   /** @private */
   fixArgs: function(a) {
      var x = [];
      for (var i=0; i < a.length; i++) {
         if (!a[i]) {
            x.push("null");
         } else {
            x.push(this.cleanup(a[i]));
         }
      }
      return x.join(" ");
   },

   /**
    * Write a debug message to the console.  The arguments to the method call will be
    * concatenated into one string message.
    */
   debug: function() {
   },

   /**
    * Write an info message to the console.  The arguments to the method call will be
    * concatenated into one string message.
    */
   info: function() {
   },

   /**
    * Write a warning message to the console.  The arguments to the method call will be
    * concatenated into one string message.
    */
   warn: function() {
   },

   /**
    * Write an error message to the console.  The arguments to the method call will be
    * concatenated into one string message.
    */
   error: function() {
   },

   /**
    * Get the class name of this object
    *
    * @return {String} The string "ConsoleRef"
    */
   getClassName: function() {
      return "ConsoleRef";
   }

});

/**
 * @class A debug console that will use a pre-defined element to display its output.  The element with the id 
 *        "debug-console" will be created an appended to the DOM for you.  This object is created when no other
 *        option is available from the browser, or when developer tools cannot be accessed.
 * @extends ConsoleRef
 */
var HTMLConsoleRef = ConsoleRef.extend(/** @DebugConsoleRef.prototype **/{

   msgStore: null,
   
   firstTime: null,

   constructor: function() {
      this.msgStore = [];
      this.firstTime = true;
      $("head", document).append(
            "<style> " +
            "#debug-console { position: absolute; width: 400px; right: 10px; bottom: 5px; height: 98%; border: 1px solid; overflow: auto; " +
            "font-family: 'Lucida Console',Courier; font-size: 8pt; color: black; } " +
            "#debug-console .console-debug, #debug-console .console-info { background: white; } " +
            "#debug-console .console-warn { font-style: italics; background: #00ffff; } " +
            "#debug-console .console-error { color: red; background: yellow; font-weight: bold; } " +
            "</style>"
      );
      $(document).ready(function() {
         $(document.body).append($("<div id='debug-console'><!-- --></div>"));
      });
      
      // Redirect error logging to the console
      window.onerror = function(err){
         if (err instanceof Error) {
            this.error(err.message);
         } else {
            this.error(err);
         }
      };
   },

   /** @private */
   clean: function() {
      if ($("#debug-console > span").length > 150) {
         $("#debug-console > span:lt(150)").remove();
      }
   },

   /** @private */
   scroll: function() {
      var w = $("#debug-console")[0];
      if (w) {
         $("#debug-console")[0].scrollTop = w.scrollHeight + 1;
      }
   },
   
   store: function(type, args) {
      if (!this.firstTime) {
         return;
      }
      if (!document.getElementById("debug-console")) {
         this.msgStore.push({
            t: type,
            a: this.fixArgs(args)
         });   
      } else {
         this.firstTime = false;
         for (var i = 0; i < this.msgStore.length; i++) {
            switch (this.msgStore[i].t) {
               case "i": this.info(this.msgStore[i].a); break;
               case "d": this.debug(this.msgStore[i].a); break;
               case "w": this.warn(this.msgStore[i].a); break;
               case "e": this.error(this.msgStore[i].a); break;
            }
         }
         this.msgStore = null;
      }
   },

   /** @private */
   fixArgs: function(a) {
      var o = this.base(a);
      return o.replace(/\n/g, "<br/>").replace(/ /g, "&nbsp;");
   },

   /**
    * Write a debug message to the console.
    */
   info: function() {
      this.clean();
      this.store("i",arguments);
      $("#debug-console").append($("<div class='console-info'>" + this.fixArgs(arguments) + "</div>"));
      this.scroll();
   },

   /**
    * Write a debug message to the console
    */
   debug: function() {
      this.clean();
      this.store("d",arguments);
      $("#debug-console").append($("<div class='console-debug'>" + this.fixArgs(arguments) + "</div>"));
      this.scroll();
   },

   /**
    * Write a warning message to the console
    */
   warn: function() {
      this.clean();
      this.store("w",arguments);
      $("#debug-console").append($("<div class='console-warn'>" + this.fixArgs(arguments) + "</div>"));
      this.scroll();
   },

   /**
    * Write an error message to the console
    */
   error: function() {
      this.clean();
      this.store("e",arguments);
      $("#debug-console").append($("<div class='console-error'>" + this.fixArgs(arguments) + "</div>"));
      this.scroll();
   },

   /**
    * Get the class name of this object
    *
    * @return {String} The string "HTMLConsoleRef"
    */
   getClassName: function() {
      return "HTMLConsoleRef";
   }
});

/**
 * @class A debug console abstraction for Safari browsers.
 * @extends ConsoleRef
 */
var SafariConsoleRef = ConsoleRef.extend(/** @SafariConsoleRef.prototype **/{

   constructor: function() {
   },

   /**
    * Write a debug message to the console
    */
   info: function() {
      console.log(this.fixArgs(arguments));
   },

   /**
    * Write a debug message to the console
    */
   debug: function() {
      console.log(["[D]", this.fixArgs(arguments)]);
   },

   /**
    * Write a warning message to the console
    */
   warn: function() {
      console.log(["[W]", this.fixArgs(arguments)]);
   },

   /**
    * Write an error message to the console
    */
   error: function() {
      console.log(["[E!]", this.fixArgs(arguments)]);
   },

   /**
    * Get the class name of this object
    *
    * @return {String} The string "SafariConsoleRef"
    */
   getClassName: function() {
      return "SafariConsoleRef";
   }

});

/**
 * @class A debug console for Opera browsers.
 * @extends ConsoleRef
 */
var OperaConsoleRef = ConsoleRef.extend(/** @OperaConsoleRef.prototype **/{

   constructor: function() {
   },

   /**
    * Write a debug message to the console
    */
   info: function() {
      window.opera.postError(this.fixArgs(arguments));
   },

   /**
    * Write a debug message to the console
    */
   debug: function() {
      window.opera.postError(["[D]", this.fixArgs(arguments)]);
   },

   /**
    * Write a warning message to the console
    */
   warn: function() {
      window.opera.postError(["[W]", this.fixArgs(arguments)]);
   },

   /**
    * Write an error message to the console
    */
   error: function() {
      window.opera.postError(["[E!]", this.fixArgs(arguments)]);
   },

   /**
    * Get the class name of this object
    *
    * @return {String} The string "OperaConsoleRef"
    */
   getClassName: function() {
      return "OperaConsoleRef";
   }

});


/**
 * @class A console reference to the Firebug console.  This will work with both Firebug and FirebugLite.
 * @extends ConsoleRef
 */
var FirebugConsoleRef = ConsoleRef.extend(/** @FirebugConsoleRef.prototype **/{

   constructor: function () {
   },

   /**
    * Write a debug message to the console
    */
   info: function() {
      if (typeof firebug != "undefined") {
         firebug.d.console.log.apply(firebug.d.console, arguments);
      } else {
         console.info.apply(console, arguments);
      }
   },

   /**
    * Write a debug message to the console
    */
   debug: function() {
      if (typeof firebug != "undefined") {
         firebug.d.console.log.apply(firebug.d.console, arguments);
      } else {
         console.debug.apply(console, arguments);
      }
   },

   /**
    * Write a warning message to the console
    */
   warn: function() {
      if (typeof firebug != "undefined") {
         firebug.d.console.log.apply(firebug.d.console, arguments);
      } else {
         console.warn.apply(console, arguments);
      }
   },

   /**
    * Write an error message to the console
    */
   error: function() {
      if (typeof firebug != "undefined") {
         firebug.d.console.log.apply(firebug.d.console, arguments);
      } else {
         console.error.apply(console, arguments);
      }
   },

   /**
    * Get the class name of this object
    *
    * @return {String} The string "FirebugConsoleRef"
    */
   getClassName: function() {
      return "FirebugConsoleRef";
   }
});

/**
 * @class A class for logging messages to a console reference object.  There are
 *        currently three supported console references:
 *        <ul>
 *        <li>Firebug - logs to the Firebug/Firebug Lite error console</li>
 *        <li>OperaConsoleRef - logs to the Opera error console</li>
 *        <li>ConsoleRef - A simple popup window for logging messages</li>
 *        </ul>
 */
var Console = Base.extend(/** @scope Console.prototype */{
   constructor: null,

   consoleRef: null,

   /**
    * Output only errors to the console.
    */
   DEBUGLEVEL_ERRORS:      4,

   /**
    * Output warnings and errors to the console.
    */
   DEBUGLEVEL_WARNINGS:    3,

   /**
    * Output warnings, errors, and debug messages to the console.
    */
   DEBUGLEVEL_DEBUG:       2,

   /**
    * Output warnings, errors, debug, and low-level info messages to the console.
    */
   DEBUGLEVEL_INFO:        1,

   /**
    * Output all messages to the console.
    */
   DEBUGLEVEL_VERBOSE:     0,

   /**
    * Output nothing to the console.
    */
   DEBUGLEVEL_NONE:       -1,

   /** @private */
   verbosity: this.DEBUGLEVEL_NONE,

   /**
    * Starts up the console.
    */
   startup: function() {
      if (EngineSupport.checkBooleanParam("debug") && (EngineSupport.checkBooleanParam("simWii") || jQuery.browser.Wii)) {
         this.consoleRef = new HTMLConsoleRef();
      }
      else if (typeof firebug != "undefined" || (typeof console != "undefined" && console.firebug)) {
         // Firebug or firebug lite
         this.consoleRef = new FirebugConsoleRef();
      }
      else if (jQuery.browser.safari) {
         this.consoleRef = new SafariConsoleRef();
      }
      else if (jQuery.browser.opera) {
         this.consoleRef = new OperaConsoleRef();
      }
      else {
         this.consoleRef = new ConsoleRef(); // (null console)
      }
   },

   /**
    * Set the console reference object to a new type of console which isn't
    * natively supported.
    *
    * @param refObj {ConsoleRef} A descendent of the <tt>ConsoleRef</tt> class.
    */
   setConsoleRef: function(refObj) {
      if (refObj instanceof ConsoleRef) {
         this.consoleRef = refObj;
      }
   },

   /**
    * Set the debug output level of the console.  The available levels are:
    * <ul>
    * <li><tt>Console.DEBUGLEVEL_ERRORS</tt> = 4</li>
    * <li><tt>Console.DEBUGLEVEL_WARNINGS</tt> = 3</li>
    * <li><tt>Console.DEBUGLEVEL_DEBUG</tt> = 2</li>
    * <li><tt>Console.DEBUGLEVEL_INFO</tt> = 1</li>
    * <li><tt>Console.DEBUGLEVEL_VERBOSE</tt> = 0</li>
    * <li><tt>Console.DEBUGLEVEL_NONE</tt> = -1</li>
    * </ul>
    * Messages of the same (or lower) level as the specified level will be logged.
    * For instance, if you set the level to <tt>DEBUGLEVEL_DEBUG</tt>, errors and warnings
    * will also be logged.  The engine must also be in debug mode for warnings,
    * debug, and log messages to be output.
    *
    * @param level {Number} One of the debug levels.  Defaults to DEBUGLEVEL_NONE.
    */
   setDebugLevel: function(level) {
      this.verbosity = level;
   },

   /**
    * Verifies that the debug level is the same as the message to output
    * @private
    */
   checkVerbosity: function(debugLevel) {
      return (this.verbosity != this.DEBUGLEVEL_NONE &&
              this.verbosity == this.DEBUGLEVEL_VERBOSE ||
              (debugLevel != this.DEBUGLEVEL_VERBOSE && debugLevel >= this.verbosity));
   },

   /**
    * Outputs a log message.  These messages will only show when <tt>DEBUGLEVEL_VERBOSE</tt> is the level.
    * You can pass as many parameters as you want to this method.  The parameters will be combined into
    * one message to output to the console.
    */
   log: function() {
      if (Engine.debugMode && this.checkVerbosity(this.DEBUGLEVEL_VERBOSE))
         this.consoleRef.debug.apply(this.consoleRef, arguments);
   },

   /**
    * Outputs an info message. These messages will only show when <tt>DEBUGLEVEL_INFO</tt> is the level.
    * You can pass as many parameters as you want to this method.  The parameters will be combined into
    * one message to output to the console.
    */
   info: function() {
      if (Engine.debugMode && this.checkVerbosity(this.DEBUGLEVEL_INFO))
         this.consoleRef.debug.apply(this.consoleRef, arguments);
   },

   /**
    * Outputs a debug message.  These messages will only show when <tt>DEBUGLEVEL_DEBUG</tt> is the level.
    * You can pass as many parameters as you want to this method.  The parameters will be combined into
    * one message to output to the console.
    */
   debug: function() {
      if (Engine.debugMode && this.checkVerbosity(this.DEBUGLEVEL_DEBUG))
         this.consoleRef.info.apply(this.consoleRef, arguments);
   },

   /**
    * Outputs a warning message.  These messages will only show when <tt>DEBUGLEVEL_WARNINGS</tt> is the level.
    * You can pass as many parameters as you want to this method.  The parameters will be combined into
    * one message to output to the console.
    */
   warn: function() {
      if (Engine.debugMode && this.checkVerbosity(this.DEBUGLEVEL_WARNINGS))
         this.consoleRef.warn.apply(this.consoleRef, arguments);
   },

   /**
    * Output an error message.  These messages will only show when <tt>DEBUGLEVEL_ERRORS</tt> is the level.
    * You can pass as many parameters as you want to this method.  The parameters will be combined into
    * one message to output to the console.
    */
   error: function() {
      if (this.checkVerbosity(this.DEBUGLEVEL_ERRORS))
         this.consoleRef.error.apply(this.consoleRef, arguments);
   }
});


/**
 * Assert that a condition is <tt>true</tt>, stopping the engine if it is <tt>false</tt>.  
 * If the condifion fails an exception will be thrown.
 *
 * @param test {Boolean} A simple test that should evaluate to <tt>true</tt>
 * @param error {String} The error message to throw if the test fails
 */
var Assert = function(test, error) {
   if (!test)
   {
      Engine.shutdown();
      // This will provide a stacktrace for browsers that support it
      throw new Error(error);
   }
};

/**
 * Assert that a condition is <tt>true</tt>, reporting a warning if the test fails.
 *
 * @param test {Boolean} A simple test that should evaluate to <tt>true</tt>
 * @param error {String} The warning to display if the test fails
 */
var AssertWarn = function(test, warning) {
   if (!test)
   {
      Console.warn(warning);
   }
};


/**
 * The Render Engine
 * Engine Support Class
 *
 * @fileoverview A support class for the engine with useful methods
 *               to manipulate arrays, parse JSON, and handle query parameters.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 755 $
 *
 * Copyright (c) 2009 Brett Fattori (brettf@renderengine.com)
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

/**
 * @class A static class with support methods the engine or games can use.  
 *        Many of the methods can be used to manipulate arrays.  Additional
 *        methods are provided to access query parameters, and generate and/or 
 *        read JSON.
 * @static
 */
var EngineSupport = Base.extend(/** @scope EngineSupport.prototype */{
   constructor: null,

   /**
    * Get the index of an element in the specified array.
    *
    * @param array {Array} The array to scan
    * @param obj {Object} The object to find
    * @param [from=0] {Number} The index to start at, defaults to zero.
    * @memberOf EngineSupport
    */
   indexOf: function(array, obj, from) {
      if (!array) {
         return -1;
      }

      if (Array.prototype.indexOf) {
         return array.indexOf(obj, from);
      }
      else
      {
         var len = array.length;
         var from = Number(from) || 0;
         from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
         if (from < 0)
            from += len;

         for (; from < len; from++)
         {
            if (from in array && array[from] === obj)
               return from;
         }
         return -1;
      }
   },

   /**
    * Remove an element from an array.  This method modifies the array
    * directly.
    *
    * @param array {Array} The array to modify
    * @param obj {Object} The object to remove
    * @memberOf EngineSupport
    */
   arrayRemove: function(array, obj) {
      if (!array) {
         return;
      }

      var idx = EngineSupport.indexOf(array, obj);
      if (idx != -1)
      {
         array.splice(idx, 1);
      }
   },
   
   /**
    * Returns <tt>true</tt> if the string, after trimming, is either
    * empty or is null.
    * 
    * @param str {String} The string to test
    * @return {Boolean} <tt>true</tt> if the string is empty or <tt>null</tt>
    */
   isEmpty: function(str) {
      return (str == null || $.trim(str) === "");     
   },

   /**
    * Calls a provided callback function once for each element in
    * an array, and constructs a new array of all the values for which
    * callback returns a <tt>true</tt> value. callback is invoked only
    * for indexes of the array which have assigned values; it is not invoked
    * for indexes which have been deleted or which have never been assigned
    * values. Array elements which do not pass the callback test are simply
    * skipped, and are not included in the new array.
    *
    * @param array {Array} The array to filter.
    * @param fn {Function} The callback to invoke.  It will be passed three
    *                      arguments: The element value, the index of the element,
    *                      and the array being traversed.
    * @param [thisp=null] {Object} Used as <tt>this</tt> for each invocation of the
    *                       callback.
    * @memberOf EngineSupport
    */
   filter: function(array, fn, thisp) {
      if (!array) {
         return null;
      }

      if (Array.prototype.filter) {
         return array.filter(fn, thisp)
      }
      else
      {
         var len = array.length;
         if (typeof fn != "function")
            throw new TypeError();

         var res = new Array();
         for (var i = 0; i < len; i++)
         {
            if (i in array)
            {
               var val = array[i]; // in case fn mutates this
               if (fn.call(thisp, val, i, array))
                  res.push(val);
            }
         }

         return res;
      }
   },

   /**
    * Executes a callback for each element within an array.
    *
    * @param array {Array} The array to operate on
    * @param fn {Function} The function to apply to each element.  It will be passed three
    *                      arguments: The element value, the index of the element,
    *                      and the array being traversed.
    * @param [thisp=null] {Object} An optional "this" pointer to use in the callback
    * @memberOf EngineSupport
    */
   forEach: function(array, fn, thisp) {
      if (!array) {
         return;
      }

      if (Array.prototype.forEach) {
         array.forEach(fn, thisp);
      }
      else
      {
         var len = array.length;
         if (typeof fn != "function")
            throw new TypeError();

         for (var i = 0; i < len; i++)
         {
            if (i in array)
               fn.call(thisp, array[i], i, array);
         }
      }
   },

   /**
    * Fill the specified array with <tt>size</tt> elements
    * each with the value "<tt>value</tt>".  Modifies the provided
    * array directly.
    *
    * @param {Array} arr The array to fill
    * @param {Number} size The size of the array to fill
    * @param {Object} value The value to put at each index
    * @memberOf EngineSupport
    */
   fillArray: function(arr, size, value) {
      for (var i = 0; i < size; i++) {
         arr[i] = value;
      }
   },

   /**
    * Get the path from a fully qualified URL, not including the trailing
    * slash character.
    *
    * @param url {String} The URL
    * @return {String} The path
    * @memberOf EngineSupport
    */
   getPath: function(url) {
      var l = url.lastIndexOf("/");
      return url.substr(0, l);
   },

   /**
    * Get the query parameters from the window location object.  The
    * object returned will contain a key/value pair for each argument
    * found.
    *
    * @return {Object} A generic <tt>Object</tt> with a key and value for each query argument.
    * @memberOf EngineSupport
    */
   getQueryParams: function() {
      if (!EngineSupport.parms) {
         EngineSupport.parms = {};
         var p = window.location.toString().split("?")[1];
         if (p)
         {
            p = p.split("&");
            for (var x = 0; x < p.length; x++)
            {
               var v = p[x].split("=");
               EngineSupport.parms[v[0]] = (v.length > 1 ? v[1] : "");
            }
         }
      }
      return EngineSupport.parms;
   },

   /**
    * Check for a query parameter and to see if it evaluates to one of the following:
    * <tt>true</tt>, <tt>1</tt>, <tt>yes</tt>, or <tt>y</tt>.  If so, returns <tt>true</tt>.
    *
    * @param paramName {String} The query parameter name
    * @return {Boolean} <tt>true</tt> if the query parameter exists and is one of the specified values.
    * @memberOf EngineSupport
    */
   checkBooleanParam: function(paramName) {
      return (EngineSupport.getQueryParams()[paramName] &&
              (EngineSupport.getQueryParams()[paramName] == "true" ||
               EngineSupport.getQueryParams()[paramName] == "1" ||
               EngineSupport.getQueryParams()[paramName].toLowerCase() == "yes" ||
               EngineSupport.getQueryParams()[paramName].toLowerCase() == "y"));
   },

   /**
    * Check for a query parameter and to see if it evaluates to the specified value.
    * If so, returns <tt>true</tt>.
    *
    * @param paramName {String} The query parameter name
    * @param val {String} The value to check for
    * @return {Boolean} <tt>true</tt> if the query parameter exists and is the value specified
    * @memberOf EngineSupport
    */
   checkStringParam: function(paramName, val) {
      return (EngineSupport.getStringParam(paramName, null) == val);
   },

   /**
    * Check for a query parameter and to see if it evaluates to the specified number.
    * If so, returns <tt>true</tt>.
    *
    * @param paramName {String} The query parameter name
    * @param val {Number} The number to check for
    * @return {Boolean} <tt>true</tt> if the query parameter exists and is the value specified
    * @memberOf EngineSupport
    */
   checkNumericParam: function(paramName, val) {
      return (EngineSupport.getStringParam(paramName, null) == val)
   },

   /**
    * Get a numeric query parameter, or the default specified if the parameter
    * doesn't exist.
    *
    * @param paramName {String} The name of the parameter
    * @param defaultVal {Number} The number to return if the parameter doesn't exist
    * @return {Number} The value
    * @memberOf EngineSupport
    */
   getNumericParam: function(paramName, defaultVal) {
      return Number(EngineSupport.getStringParam(paramName, defaultVal));
   },

   /**
    * Get a string query parameter, or the default specified if the parameter
    * doesn't exist.
    *
    * @param paramName {String} The name of the parameter
    * @param defaultVal {String} The string to return if the parameter doesn't exist
    * @return {String} The value
    * @memberOf EngineSupport
    */
   getStringParam: function(paramName, defaultVal) {
      return (EngineSupport.getQueryParams()[paramName] || defaultVal);
   },

   /**
    * Returns specified object as a JavaScript Object Notation (JSON) string.
    *
    * Code to handle "undefined" type was delibrately not implemented, being that it is not part of JSON.
    * "undefined" type is casted to "null".
    *
    * @param object {Object} Must not be undefined or contain undefined types and variables.
    * @return String
    * @memberOf EngineSupport
    */
   toJSONString: function(o)
   {
      if (!typeof JSON == "undefined") {
         return JSON.stringify(o);
      } else {
         return null;
      }
   },

   /**
    * Cleans up incoming source by stripping single-line comments,
    * multi-line comments, blank lines, new lines, and trims lines.
    * In other words, this is a simplification of minification.
    * 
    * /(([\"'])(\\\2|.*:\/\/|[^\/\n\r])*\2)|(//.*$)/gm
    * @param inString {String} The source to clean
    */
   cleanSource: function(inString, keepNewLines) {
      var s = inString.replace(/((["'])[^;\n\r]*\2)|(\/\/.*$)/gm, "$1")  // Remove single line comments
                     .replace(/\/\*(\n|.)*?\*\//gm, "")           // Remove multi line comments
                     .replace(/^[ \t]*(.*?)[ \t]*$/gm, "$1")      // Trim lines
                     .replace(/\s*\n$/gm, "");                    // Remove blank lines
     
      if (!keepNewLines) {
         s = s.replace(/(\n|\r)/gm, "");                   // Remove new lines
      }
      
      return s;
   },

   /**
    * Parses specified JavaScript Object Notation (JSON) string back into its corresponding object.
    *
    * @param jsonString
    * @return Object
    * @see http://www.json.org
    * @memberOf EngineSupport
    */
   parseJSON: function(jsonString)
   {
      jsonString = EngineSupport.cleanSource(jsonString);
      if (!(typeof JSON == "undefined")) {
         try {
            return JSON.parse(jsonString, function (key, value) {
                      var a;
                      if (typeof value === 'string') {
                          a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                          if (a) {
                              return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
                          }
                      }
                      return value;
                  });
         } catch (ex) {
            Console.warn("Cannot parse JSON: " + ex.message);
            return null;
         }
      } else {
         return EngineSupport.evalJSON(jsonString);
      }
   },
   
   evalJSON: function(jsonString)
   {
      jsonString = EngineSupport.cleanSource(jsonString);
      try {
         return eval("(" + jsonString + ")");   
      } catch (ex) {
         Console.warn("Cannot eval JSON: " + ex.message);
         return null;
      }
   },

   /**
    * Return a string, enclosed in quotes.
    *
    * @param text {String} The string to quote
    * @return {String} The string in quotes
    * @memberOf EngineSupport
    */
   quoteString: function(text)
   {
      if (!typeof JSON == "undefined") {
         return JSON.quote(text);
      } else {
         return null;
      }
   },

   /**
    * Gets an object that is a collation of a number of browser and
    * client settings.  You can use this information to tailor a game
    * to the environment it is running within.
    * <ul>
    * <li>browser - A string indicating the browser type (safari, mozilla, opera, msie)</li>
    * <li>version - The browser version</li>
    * <li>agent - The user agent</li>
    * <li>platform - The platform the browser is running on</li>
    * <li>cpu - The CPU on the machine the browser is running on</li>
    * <li>language - The browser's language</li>
    * <li>online - If the browser is running in online mode</li>
    * <li>cookies - If the browser supports cookies</li>
    * <li>fullscreen - If the browser is running in fullscreen mode</li>
    * <li>width - The browser's viewable width</li>
    * <li>height - The browser's viewable height</li>
    * </ul>
    * @return An object with system information
    * @memberOf EngineSupport
    */
   sysInfo: function() {
      return {
         "browser" : $.browser.safari ? "safari" : ($.browser.mozilla ? "mozilla" : ($.browser.opera ? "opera" : ($.browser.msie ? "msie" : "unknown"))),
         "version" : $.browser.version,
         "agent": navigator.userAgent,
         "platform": navigator.platform,
         "cpu": navigator.cpuClass || navigator.oscpu,
         "language": navigator.language,
         "online": navigator.onLine,
         "cookies": navigator.cookieEnabled,
         "fullscreen": window.fullScreen || false,
         "width": window.innerWidth || document.body.parentNode.clientWidth,
         "height": window.innerHeight || document.body.parentNode.clientHeight
      };
   }
});


/**
 * The Render Engine
 * Engine Linker Class
 *
 * @fileoverview A class for checking class dependencies and class intialization
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 713 $
 *
 * Copyright (c) 2009 Brett Fattori (brettf@renderengine.com)
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

/**
 * @class A static class for processing class files, looking for dependencies, and
 *        ensuring that all dependencies exist before initializing a class.  The linker
 *        expects that files will follow a fairly strict format, so that patterns can be
 *        identified and all dependencies resolved.
 *        <p/>
 *        These methods handle object dependencies so that each object will be
 *        initialized as soon as its dependencies become available.  Using this method
 *        scripts can be loaded immediately, using the browsers threading model, and
 *        executed when dependencies are fulfilled.
 *
 * @static
 */
var Linker = Base.extend(/** @scope Linker.prototype */{ 

   constructor: null,

   //====================================================================================================
   //====================================================================================================
   //                                   DEPENDENCY PROCESSOR
   //
   //====================================================================================================
   //====================================================================================================

   dependencyList: {},
   dependencyCount: 0,
   dependencyProcessor: null,
   dependencyTimer: null,
   dependencyCheckTimeout: $.browser.Wii ? 6500 : 3500,
   dependencyProcessTimeout: 100,

   /**
    * Initializes an object for use in the engine.  Calling this method is required to make sure
    * that all dependencies are resolved before actually instantiating an object of the specified
    * class.
    *
    * @param objectName {String} The name of the object class
    * @param primaryDependency {String} The name of the class for which the <tt>objectName</tt> class is
    *                                   dependent upon.  Specifying <tt>null</tt> will assume the <tt>Base</tt> class.
    * @param fn {Function} The function to run when the object can be initialized.
    */
   initObject: function(objectName, primaryDependency, fn) {
      var objDeps = Linker.findAllDependencies(objectName, fn);

      // Add the known dependency to the list of object
      // dependencies we discovered
      if (primaryDependency) {
         objDeps.push(primaryDependency);
      }
      
      var newDeps = [];

      // Check for nulls and circular references
      for (var d in objDeps) {
         if (objDeps[d] != null) {
            if (objDeps[d].split(".")[0] != objectName) {
               newDeps.push(objDeps[d]);
            } else {
               Console.warn("Object references itself: ", objectName);
            }
         }
      }

		// Store the object for intialization when all dependencies are resolved
      Linker.dependencyList[objectName] = {deps: newDeps, objFn: fn};
      Linker.dependencyCount++;
      Console.info(objectName, " depends on: ", newDeps);

      // Check for 1st level circular references
      this.checkCircularRefs(objectName);

      // After a period of time has passed, we'll check our dependency list.
      // If anything remains, we'll drop the bomb that certain files didn't resolve...
      window.clearTimeout(Linker.dependencyTimer);
      Linker.dependencyTimer = window.setTimeout(Linker.checkDependencyList, Linker.dependencyCheckTimeout);

      if (!Linker.dependencyProcessor) {
         Linker.dependencyProcessor = window.setTimeout(Linker.processDependencies, Linker.dependencyProcessTimeout);
      }
   },

   /**
    * Check the object to make sure the namespace(s) are defined.
    * @param objName {String} A dot-notation class name
    * @private
    */
   checkNSDeps: function(objName) {
      var objHr = objName.split(".");

      if (objHr.length == 0) {
         return true;
      }

      var o = window;
      for (var i = 0; i < objHr.length - 1; i++) {
         o = o[objHr[i]];
         if (!o) {
            return false;
         }
      }
      return true;
   },

   /**
    * Get the parent class of the object specified by classname string.
    * @param classname {String} A dot-notation class name
    * @private
    */
   getParentClass: function(classname) {
      var objHr = classname.split(".");
      var o = window;
      for (var i = 0; i < objHr.length - 1; i++) {
         o = o[objHr[i]];
         if (!o) {
            return null;
         }
      }
      return o;
   },

   /**
    * The dependency processor and link checker.
    * @private
    */
   processDependencies: function() {
      var pDeps = [];
      var dCount = 0;
      for (var d in Linker.dependencyList) {
         // Check to see if the dependencies of an object are loaded
         // We also need to make sure that it's namespace(s) are initialized
         dCount++;

         var deps = Linker.dependencyList[d].deps;
         var resolved = [];
         var miss = false;
         for (var dep in deps) {
            if (deps[dep] != null && window[deps[dep]] == null) {
               miss = true;
            } else {
               resolved.push(deps[dep]);
            }
         }

         for (var x in resolved) {
            EngineSupport.arrayRemove(Linker.dependencyList[d].deps, resolved[x]);
         }

         if (!miss && Linker.checkNSDeps(d)) {
            // We can initialize it now
            var parentObj = Linker.getParentClass(d);
            parentObj[d] = Linker.dependencyList[d].objFn();
            Console.info("Initializing", d);

            // Remember what we processed so we don't process them again
            pDeps.push(d);
				
				// After it has been initialized, check to see if it has the
				// resolved() class method
				if (parentObj[d].resolved) {
					parentObj[d].resolved();
				}
         }
      }

      for (var i in pDeps) {
         delete Linker.dependencyList[pDeps[i]];
      }

      if (dCount != 0) {
         Linker.dependencyProcessor = window.setTimeout(Linker.processDependencies, Linker.dependencyProcessTimeout);
      } else {
         window.clearTimeout(Linker.dependencyProcessor);
         Linker.dependencyProcessor = null;
      }
   },

   /*
    * The following set of functions breaks apart a function into its
    * components.  It is used to determine the dependencies of classes.
    */

   /**
    * Find variables defined in a function:
    *   var x = 10;
    *   var y;
    *   for (var z=3; z < 10; z++)
    *   -- Still need to handle:  var x,y,z;
    *
    * @private
    */
   findVars: function(objectName, obj) {
      // Find all variables explicitly defined
      var def = obj.toString();
      var vTable = [];
      var nR = "([\\$_\\w\\.]*)";
      var vR = new RegExp("(var\\s*" + nR + "\\s*)","g");
      var m;
      while ((m = vR.exec(def)) != null) {
         vTable.push(m[2]);
      }
      return vTable;
   },

   /**
    * Find object dependencies in variables, arguments, and method usage.
    * @private
    */
   findDependencies: function(objectName, obj) {
      // Find all dependent objects
      var def = obj.toString();
      var dTable = [];
      var nR = "([\\$_\\w\\.]*)";
      var nwR = new RegExp("(new\\s+" + nR + ")","g");
      var ctR = new RegExp("(" + nR + "\\.create\\()","g");
      var fcR = new RegExp("(" + nR + "\\()", "g");
      var inR = new RegExp("(intanceof\\s+"+ nR + ")", "g");
      var m;

      // "new"-ing objects
      while ((m = nwR.exec(def)) != null) {
         if (EngineSupport.indexOf(dTable, m[2]) == -1) {
            dTable.push(m[2]);
         }
      }

      // "create"-ing objects
      while ((m = ctR.exec(def)) != null) {
         if (EngineSupport.indexOf(dTable, m[2]) == -1) {
            dTable.push(m[2]);
         }
      }

      // method dependencies
      while ((m = fcR.exec(def)) != null) {
         if (m[2].indexOf(".") != -1) {
            var k = m[2].split(".")[0];
            if (EngineSupport.indexOf(dTable, k) == -1) {
               dTable.push(k);
            }
         }
      }

      // "instanceof" checks
      while ((m = inR.exec(def)) != null) {
         if (EngineSupport.indexOf(dTable, m[2]) == -1) {
            dTable.push(m[2]);
         }
      }
      return dTable;
   },

   /**
    * Process anonymous functions
    * @private
    */
   findAnonDeps: function(objectName, str) {
      var fTable = {};
      var strR = /(["|']).*?\1/g;

      var aFnRE = new RegExp("function\\s*\\(([\\$\\w_, ]*?)\\)\\s*\\{((.|\\r|\\n)*?)\\};?","g");
      var a = 0;
      while ((m = aFnRE.exec(str)) != null) {
         var f = "_" + (a++);
         var fdef = m[2].replace(strR, "");

         // Process each function
         fTable[f] = { vars: Linker.findVars(objectName, fdef),
                       deps: Linker.findDependencies(objectName, fdef) };
         fTable[f].deps = EngineSupport.filter(fTable[f].deps, function(e) {
            return (e != "" && e != "this" && e != "arguments");
         });

         var args = m[1].split(",");
         var vs = fTable[f].vars;
         for (var a in args) {
            if (EngineSupport.indexOf(vs, args[a]) == -1) {
               vs.push(args[a].replace(" ",""));
            }
         }
      }

      return Linker.procDeps(objectName, fTable);
   },

   /**
    * Finds all of the dependencies within an object class.
    * @private
    */
   findAllDependencies: function(objectName, obj) {
      var defs;
      var fTable = {};
      Console.warn("Process: " + objectName);

      try {
         var k = obj();
      } catch (ex) {
         // The class probably extends a non-existent class. Replace the parent
         // class with a known class and evaluate as a dummy class
         var extRE = new RegExp("(var\\s*)?([\\$_\\w\\.]*?)\\s*=\\s*([\\$_\\w\\.]*?)\\.extend\\(");
         var classDef = obj.toString();
         var nm = null;
         classDef = classDef.replace(extRE, function(str, varDef, classname, parent, offs, s) {
            nm = classname;
            return "return Base.extend(";
         });
         try {
            k = eval("(" + classDef.replace("return " + nm + ";", "") + ")();");
         } catch (inEx) {
            Console.error("Cannot parse class '" + nm + "'");
         }
      }

      if ($.isFunction(k)) {
         // If the class is an instance, get it's class object
         k = k.prototype;
      }

      // Find the internal functions
      for (var f in k) {
         if ($.isFunction(k[f]) && k.hasOwnProperty(f)) {
            var def = k[f].toString();

            var fR = new RegExp("function\\s*\\(([\\$\\w_, ]*?)\\)\\s*\\{((.|\\s)*)","g");
            var m = fR.exec(def);
            if (m) {
               // Remove strings, then comments
               var fdef = m[2].replace(/(["|']).*?\1/g, "");
               fdef = fdef.replace(/\/\/.*\r\n/g, "");
               fdef = fdef.replace("\/\*(.|\s)*?\*\/", "");

               // Process, then remove anonymous functions
               var anonDeps = Linker.findAnonDeps(objectName, fdef);
               var aFnRE = new RegExp("function\\s*\\(([\\$\\w_, ]*?)\\)\\s*\\{((.|\\r|\\n)*?)\\};?","g");
               fdef = fdef.replace(aFnRE, "");

               // Process each function
               fTable[f] = { vars: Linker.findVars(objectName, fdef),
                             deps: Linker.findDependencies(objectName, fdef) };
               fTable[f].deps = EngineSupport.filter(fTable[f].deps, function(e) {
                  return (e != "" && e != "this" && e != "arguments");
               });

               var args = m[1].split(",");
               var vs = fTable[f].vars;
               for (var a in args) {
                  if (EngineSupport.indexOf(vs, args[a]) == -1) {
                     vs.push(args[a].replace(" ",""));
                  }
               }

               // Combine in the anonymous dependencies
               for (var a in anonDeps) {
                  fTable[f].deps.push(anonDeps[a]);
               }
            }
         }
      }

      // This is useful for debugging dependency problems...
      Console.log("DepTable: ", objectName, fTable);

      return Linker.procDeps(objectName, fTable);
   },

   /**
    * Process dependencies and clear any that have been resolved.
    * @private
    */
   procDeps: function(objectName, fTable) {
      // Remove dependencies resolved by local variables and arguments
      var r = [];
      var allDeps = [];
      for (var f in fTable) {
         var deps = fTable[f].deps;
         var vars = fTable[f].vars;

         for (var d in deps) {
            var dp = deps[d].split(".")[0];
            if (EngineSupport.indexOf(vars, dp) != -1 && EngineSupport.indexOf(r, deps[d]) == -1) {
               r.push(deps[d]);
            }
         }

         fTable[f].deps = EngineSupport.filter(deps, function(e) {
            return (EngineSupport.indexOf(r, e) == -1);
         });

         for (var d in fTable[f].deps) {
            if (EngineSupport.indexOf(allDeps, fTable[f].deps[d]) == -1) {
               allDeps.push(fTable[f].deps[d]);
            }
         }
      }

      return allDeps;
   },

   /**
    * Perform a quick resolution on first-level circular references.
    * @private
    */
   checkCircularRefs: function(objectName) {
      var deps = Linker.dependencyList[objectName].deps;
      var r = [];
      for (var dep in deps) {
         if (Linker.dependencyList[deps[dep]] && EngineSupport.indexOf(Linker.dependencyList[deps[dep]].deps, objectName) != -1) {
            // Try removing the circular reference
            EngineSupport.arrayRemove(Linker.dependencyList[objectName].deps, deps[dep]);
         }
      }
   },

   /**
    * Check the dependency list for any unresolved dependencies.  Anything that hasn't
    * been resolved will be dumped to the console as an error.
    * @private
    */
   checkDependencyList: function() {
      // Stop processing
      window.clearTimeout(Linker.dependencyTimer);
      Linker.dependencyTimer = null;
      window.clearTimeout(Linker.dependencyProcessor);
      Linker.dependencyProcessor = null;      

      // Build the list
      var unresDeps = "", dCount = 0;
      for (var obj in Linker.dependencyList) {
         dCount++;
         unresDeps += "Object '" + obj + "' has the following unresolved dependencies:\n";
         for (var d in Linker.dependencyList[obj].deps) {
            unresDeps += "   " + Linker.dependencyList[obj].deps[d] + "\n";
            // Display the dependencies we found for this object
            
         }
         unresDeps += "\n";
      }
      
      if (dCount != 0) {
         // Dump the dependency list
         Console.setDebugLevel(Console.DEBUGLEVEL_ERRORS);
         Console.error(unresDeps);
         Engine.shutdown();
      }
   },

   /**
    * Dump out any unresolved class dependencies to the console.
    * @return {Object} A list of all classes that haven't been loaded due to resolution conflicts.
    */
   dumpDependencies: function() {
      Console.debug(Linker.dependencyList);
   },

   //====================================================================================================
   //====================================================================================================
   //                                         SYNTAX PARSER
   //====================================================================================================
   //====================================================================================================
   
   /**
    * Parse a javascript file for common syntax errors which might otherwise cause a script
    * to not load.  On platforms, such as Wii and iPhone, it might not be possible to see
    * errors which cause the code to not compile.  By checking a known set of possible errors,
    * it might be possible to reduce headaches on those platforms when developing.
    * @private
    */
   parseSyntax: function(jsCode) {
      
      // Clean the source first so we only have code
      //jsCode = EngineSupport.cleanSource(jsCode, true);
      
      // Check for the following:
      // * Variable comparison in assignment statement
      // * Extra comma after last item in Object definition
      // * Missing comma between items in Object definition
      // * Missing colon between name and definition
      // * Equal sign where colon expected
      // * Try without catch and finally
      
      //Console.error("Syntax errors:\n", errors);
      
      return true;   
   }
   
});

/**
 * The Render Engine
 * Engine Class
 *
 * @fileoverview The main engine class
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 779 $
 *
 * Copyright (c) 2009 Brett Fattori (brettf@renderengine.com)
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

/**
 * @class The main engine class which is responsible for keeping the world up to date.
 * Additionally, the Engine will track and display metrics for optimizing a game. Finally,
 * the Engine is responsible for maintaining the local client's <tt>worldTime</tt>.
 * <p/>
 * The engine includes methods to load scripts and stylesheets in a serialized fashion
 * and report on the sound engine status.  Since objects are tracked by the engine, a list
 * of all game objects can be obtained from the engine.  The engine also contains the root
 * rendering context, or "default" context.  For anything to be rendered, or updated by the
 * engine, it will need to be added to a child of the default context.
 * <p/>
 * Other methods allow for starting or shutting down then engine, toggling metric display,
 * setting of the base "frames per second", toggling of the debug mode, and processing of
 * the script and function queue.
 * <p/>
 * Since JavaScript is a single-threaded environment, frames are generated serially.  One
 * frame must complete before another can be rendered.  Frames are not currently skipped
 * by the engine.  It is up to objects to determine if frames have been skipped and adjust
 * themselves appropriately.
 *
 * @static
 */
var Engine = Base.extend(/** @scope Engine.prototype */{
	version: "beta 1.4.0",

	constructor: null,

	/*
	 * Engine objects
	 */
	idRef: 0,						// Object reference Id
	gameObjects: {},				// Live objects cache
	livingObjects: 0,				// Count of live objects

	/*
	 * Engine info
	 */
	fpsClock: 33,					// The clock rate (ms)
	frameTime: 0,					// Amount of time taken to render a frame
	engineLocation: null,		// URI of engine
	defaultContext: null,		// The default rendering context
	debugMode: false,				// Global debug flag
	localMode: false,				// Local run flag
	started: false,				// Engine started flag
	running: false,				// Engine running flag

	/*
	 * Metrics tracking/display
	 */
	metrics: {},					// Tracked metrics
	metricDisplay: null,			// The metric display object
	metricSampleRate: 10,		// Frames between samples
	lastMetricSample: 10,		// Last sample frame
	showMetricsWindow: false,	// Metrics display flag
	vObj: 0,							// Visible objects
	droppedFrames: 0,				// Non-rendered frames/frames dropped

	/*
	 * Sound engine info
	 */
	soundsEnabled: false,		// Sound engine enabled flag

   /**
    * The current time of the world on the client.  This time is updated
    * for each frame generated by the Engine.
    * @type Number
    * @memberOf Engine
    */
   worldTime: 0,					// The world time


   //====================================================================================================
   //====================================================================================================
   //                                      ENGINE PROPERTIES
   //====================================================================================================
   //====================================================================================================

   /**
    * Set the debug mode of the engine.  Affects message ouput and
    * can be queried for additional debugging operations.
    *
    * @param mode {Boolean} <tt>true</tt> to set debugging mode
    * @memberOf Engine
    */
   setDebugMode: function(mode) {
      this.debugMode = mode;
   },

   /**
    * Query the debugging mode of the engine.
    *
    * @return {Boolean} <tt>true</tt> if the engine is in debug mode
    * @memberOf Engine
    */
   getDebugMode: function() {
      return this.debugMode;
   },

   /**
    * Returns <tt>true</tt> if SoundManager2 is loaded and initialized
    * properly.  The resource loader and play manager will use this
    * value to execute properly.
    * @return {Boolean} <tt>true</tt> if the sound engine was loaded properly
    * @memberOf Engine
    */
   isSoundEnabled: function() {
      return this.soundsEnabled;
   },

   /**
    * Set the FPS (frames per second) the engine runs at.  This value
    * is mainly a suggestion to the engine as to how fast you want to
    * redraw frames.  If frame execution time is long, frames will be
    * processed as time is available. See the metrics to understand
    * available time versus render time.
    *
    * @param fps {Number} The number of frames per second to refresh
    *                     Engine objects.
    * @memberOf Engine
    */
   setFPS: function(fps) {
      Assert((fps != 0), "You cannot have a framerate of zero!");
      this.fpsClock = Math.floor(1000 / fps);
   },
   
   /**
    * Get the FPS (frames per second) the engine is set to run at.
	 * @return {Number}
	 * @memberOf Engine
    */
   getFPS: function() {
   	return Math.floor((1 / this.fpsClock) * 1000)
   },
   
   /**
    * Get the actual FPS (frames per second) the engine is running at.
    * This value will vary as load increases or decreases due to the
    * number of objects being rendered.  A faster machine will be able
    * to handle a higher FPS setting.
    * @return {Number}
	 * @memberOf Engine
    */
	getActualFPS: function() {
		return Math.floor((1 / Engine.frameTime) * 1000);
	},
   
   /**
    * Get the amount of time allocated to draw a single frame.
    * @return {Number} Milliseconds allocated to draw a frame
	 * @memberOf Engine
    */
   getFrameTime: function() {
      return this.fpsClock;
   },
	
	/**
	 * Get the amount of time it took to draw the last frame.  This value
	 * varies per frame drawn, based on visible objects, number of operations
	 * performed, and other factors.  The draw time can be used to optimize
	 * your game for performance.
	 * @return {Number} Milliseconds required to draw the frame
	 * @memberOf Engine
	 */
	getDrawTime: function() {
		return Engine.frameTime;
	},
   
   /**
    * Get the load the currently rendered frame is putting on the engine.  
    * The load represents the amount of
    * work the engine is doing to render a frame.  A value less
    * than one indicates the the engine can render a frame within
    * the amount of time available.  Higher than one indicates the
    * engine cannot render the frame in the time available.
    * <p/>
    * Faster machines will be able to handle more load.  You can use
    * this value to gauge how well your game is performing.
    * @return {Number}
    * @memberOf Engine
    */
   getEngineLoad: function () {
   	return (Engine.frameTime / this.fpsClock);
   },

   /**
    * Get the default rendering context for the Engine.  This
    * is the <tt>document.body</tt> element in the browser.
    *
    * @return {RenderContext} The default rendering context
    * @memberOf Engine
    */
   getDefaultContext: function() {
      if (this.defaultContext == null) {
         this.defaultContext = DocumentContext.create();
      }

      return this.defaultContext;
   },

   /**
    * Get the path to the engine.  Uses the location of the <tt>engine.js</tt>
    * file that was loaded.
    * @return {String} The path/URL where the engine is located
    * @memberOf Engine
    */
   getEnginePath: function() {
      if (this.engineLocation == null)
      {
         // Determine the path of the "engine.js" file
         var head = document.getElementsByTagName("head")[0];
         var scripts = head.getElementsByTagName("script");
         for (var x = 0; x < scripts.length; x++)
         {
            var src = scripts[x].src;
            if (src != null && src.match(/(.*)\/engine\/(.*?)engine\.js/))
            {
               // Get the path
               this.engineLocation = src.match(/(.*)\/engine\/(.*?)engine\.js/)[1];
               break;
            }
         }
      }

      return this.engineLocation;
   },

   //====================================================================================================
   //====================================================================================================
   //                                  GLOBAL OBJECT MANAGEMENT
   //====================================================================================================
   //====================================================================================================

   /**
    * Track an instance of an object managed by the Engine.  This is called
    * by any object that extends from {@link PooledObject}.
    *
    * @param obj {PooledObject} A managed object within the engine
    * @return {String} The global Id of the object
    * @memberOf Engine
    */
   create: function(obj) {
      Assert((this.running == true), "Cannot create objects when the engine is not running!");
      this.idRef++;
      var objId = obj.getName() + this.idRef;
      this.gameObjects[objId] = obj;
      Console.log("CREATED Object ", objId, "[", obj, "]");
      this.livingObjects++;

      return objId;
   },

   /**
    * Removes an object instance managed by the Engine.
    *
    * @param obj {PooledObject} The object, managed by the engine, to destroy
    * @memberOf Engine
    */
   destroy: function(obj) {
      Assert((obj != null), "Trying to destroy non-existent object!");
      var objId = obj.getId();
      Assert((this.gameObjects[objId] != null), "Attempt to destroy missing object!");
      Console.log("DESTROYED Object ", objId, "[", obj, "]");
      this.gameObjects[objId] = null;
      delete this.gameObjects[objId];
      this.livingObjects--;
   },

   /**
    * Get an object by the Id that was assigned during the call to {@link #create}.
    *
    * @param id {String} The global Id of the object to locate
    * @return {PooledObject} The object
    * @memberOf Engine
    */
   getObject: function(id) {
      return this.gameObjects[id];
   },

   //====================================================================================================
   //====================================================================================================
   //                                    ENGINE PROCESS CONTROL
   //====================================================================================================
   //====================================================================================================

   /**
    * Load the minimal scripts required for the engine to run.
    * @private
    * @memberOf Engine
    */
   loadEngineScripts: function() {
      // Engine stylesheet
      this.loadStylesheet("/css/engine.css");

      // The basics needed by the engine to get started
      this.loadNow("/engine/engine.game.js");
      this.loadNow("/engine/engine.rendercontext.js");
      this.loadNow("/rendercontexts/context.render2d.js");
      this.loadNow("/rendercontexts/context.htmlelement.js");
      this.loadNow("/rendercontexts/context.documentcontext.js");
   },

   /**
    * Starts the engine and loads the basic engine scripts.  When all scripts required
    * by the engine have been loaded the {@link #run} method will be called.
    *
    * @param debugMode {Boolean} <tt>true</tt> to set the engine into debug mode
    *                            which allows the output of messages to the console.
    * @memberOf Engine
    */
   startup: function(debugMode) {
      Assert((this.running == false), "An attempt was made to restart the engine!");

      this.upTime = new Date().getTime();
      this.debugMode = debugMode ? true : false;
      this.started = true;

      // Load the required scripts
      this.loadEngineScripts();
   },

   /**
    * Runs the engine.  This will be called after all scripts have been loaded.
    * You will also need to call this if you pause the engine.
    * @memberOf Engine
    */
   run: function() {
		if (this.running) {
			return;
		}
		
      var mode = "[";
      mode += (this.debugMode ? "DEBUG" : "");
      mode += (this.localMode ? (mode.length > 0 ? " LOCAL" : "LOCAL") : "");
      mode += "]"
      Console.warn(">>> Engine started. " + (mode != "[]" ? mode : ""));
      this.running = true;

      // Start world timer
      Engine.globalTimer = window.setTimeout(function() { Engine.engineTimer(); }, this.fpsClock);

   },

   /**
    * Pauses the engine.
    * @memberOf Engine
    */
   pause: function() {
      Console.warn(">>> Engine paused <<<");
		window.clearTimeout(Engine.globalTimer);
      this.running = false;
   },

   /**
    * Shutdown the engine.  Stops the global timer and cleans up (destroys) all
    * objects that have been created and added to the world.
    * @memberOf Engine
    */
   shutdown: function() {
      if (!this.running && this.started)
      {
			// If the engine is not currently running (paused) restart it
			// and then re-perform the shutdown
         this.running = true;
         setTimeout(function() { Engine.shutdown(); }, 10);
			return;
      }

      this.started = false;
      window.clearTimeout(Engine.dependencyProcessor);

      Console.warn(">>> Engine shutting down...");

      // Stop world timer
      window.clearTimeout(Engine.globalTimer);

      if (this.metricDisplay)
      {
         this.metricDisplay.remove();
         this.metricDisplay = null;
      }

      this.downTime = new Date().getTime();
      Console.warn(">>> Engine stopped.  Runtime: " + (this.downTime - this.upTime) + "ms");

      this.running = false;
      for (var o in this.gameObjects)
      {
         this.gameObjects[o].destroy();
      }
      this.gameObjects = null;

      // Dump the object pool
      if (typeof PooledObject != "undefined") {
         PooledObject.objectPool = null;
      }

      Assert((this.livingObjects == 0), "Object references not cleaned up!");

      // Perform final cleanup (silly hack for unit testing)
      if (!Engine.UNIT_TESTING) {
         this.cleanup();
      }
   },

   /**
    * After a successful shutdown, the Engine needs to clean up
    * all of the objects that were created on the window object by the engine.
    * @memberOf Engine
    * @private
    */
   cleanup: function() {
      // Protect the HTML console, if visible
      var hdc = $("#debug-console").remove();
   
      // Remove the body contents
      $(document.body).empty();

      if (hdc.length != 0) {
         $(document.body).append(hdc);
      }

      // Remove all scripts from the <head>
      $("head script", document).remove();
   },


   /**
    * Initializes an object for use in the engine.  Calling this method is required to make sure
    * that all dependencies are resolved before actually instantiating an object of the specified
    * class.  This uses the {@link Linker} class to handle dependency processing and resolution.
    *
    * @param objectName {String} The name of the object class
    * @param primaryDependency {String} The name of the class for which the <tt>objectName</tt> class is
    *                                   dependent upon.  Specifying <tt>null</tt> will assume the <tt>Base</tt> class.
    * @param fn {Function} The function to run when the object can be initialized.
    */
   initObject: function(objectName, primaryDependency, fn) {
      Linker.initObject(objectName, primaryDependency, fn);
   },

   //====================================================================================================
   //====================================================================================================
   //                                     METRICS MANAGEMENT
   //====================================================================================================
   //====================================================================================================

   /**
    * Toggle the display of the metrics window.  Any metrics
    * that are being tracked will be reported in this window.
    * @memberOf Engine
    */
   toggleMetrics: function() {
      this.showMetricsWindow = !this.showMetricsWindow;
   },

   /**
    * Show the metrics window
    * @memberOf Engine
    */
   showMetrics: function() {
      this.showMetricsWindow = true;
   },

   /**
    * Hide the metrics window
    * @memberOf Engine
    */
   hideMetrics: function() {
      this.showMetricsWindow = false;
   },
   
   manMetrics: function() {
      if ($("div.metric-button.minimize").length > 0) {
         $("div.metric-button.minimize").removeClass("minimize").addClass("maximize").attr("title", "maximize");
         $("div.metrics").css("height", 17);
         $("div.metrics .items").hide();
      } else {
         $("div.metric-button.maximize").removeClass("maximize").addClass("minimize").attr("title", "minimize");
         $("div.metrics .items").show();
         $("div.metrics").css("height", "auto");
      }
   },

   /**
    * Creates a button for the metrics window
    * @private
    */
   metricButton: function(cssClass, fn) {
      return $("<div class='metric-button " + cssClass + "' title='" + cssClass + "'><!-- --></div>").click(fn);
   },

   /**
    * Render the metrics window
    * @private
    */
   renderMetrics: function() {

      if (this.showMetricsWindow && !this.metricDisplay) {
         this.metricDisplay = $("<div/>").addClass("metrics");
         this.metricDisplay.append(this.metricButton("run", function() { Engine.run(); }));
         this.metricDisplay.append(this.metricButton("pause", function() { Engine.pause(); }));
         this.metricDisplay.append(this.metricButton("shutdown", function() { Engine.shutdown(); }));
         this.metricDisplay.append(this.metricButton("minimize", function() { Engine.manMetrics(); }));

         this.metricDisplay.append($("<div class='items'/>"));
         this.metricDisplay.appendTo($("body"));
      }
      else if (!this.showMetricsWindow && this.metricDisplay) {
         this.metricDisplay.remove();
         this.metricDisplay = null;
      }

      if (this.showMetricsWindow && this.lastMetricSample-- == 0)
      {
         // Add some metrics to assist the developer
         Engine.addMetric("FPS", this.getFPS(), false, "#");
         Engine.addMetric("aFPS", this.getActualFPS(), true, "#");
         Engine.addMetric("avail", this.fpsClock, false, "#ms");
         Engine.addMetric("frame", Engine.frameTime, true, "#ms");
         Engine.addMetric("load", Math.floor(this.getEngineLoad() * 100), true, "#%");
         Engine.addMetric("visObj", Engine.vObj, false, "#");
			Engine.addMetric("dropped", Engine.droppedFrames, false, "#");

         this.updateMetrics();
         this.lastMetricSample = this.metricSampleRate;
      }
   },

   /**
    * Set the interval at which metrics are sampled by the system.
    * The default is for metrics to be calculated every 10 engine frames.
    *
    * @param sampleRate {Number} The number of ticks between samples
    * @memberOf Engine
    */
   setMetricSampleRate: function(sampleRate) {
      this.lastMetricSample = 1;
      this.metricSampleRate = sampleRate;
   },

   /**
    * Add a metric to the game engine that can be displayed
    * while it is running.  If smoothing is selected, a 3 point
    * running average will be used to smooth out jitters in the
    * value that is shown.  For the <tt>value</tt> argument,
    * you can provide a string which contains the pound sign "#"
    * that will be used to determine where the calculated value will
    * occur in the formatted string.
    *
    * @param metricName {String} The name of the metric to track
    * @param value {String/Number} The value of the metric.
    * @param smoothing {Boolean} <tt>true</tt> to use 3 point average smoothing
    * @memberOf Engine
    */
   addMetric: function(metricName, value, smoothing, fmt) {
      if (smoothing) {
         var vals = this.metrics[metricName] ? this.metrics[metricName].values : [];
         if (vals.length == 0) {
            // Init
            vals.push(value);
            vals.push(value);
            vals.push(value);
         }
         vals.shift();
         vals.push(value);
         var v = Math.floor((vals[0] + vals[1] + vals[2]) * 0.33);
         this.metrics[metricName] = { val: (fmt ? fmt.replace("#", v) : v), values: vals };
      } else {
         this.metrics[metricName] = { val: (fmt ? fmt.replace("#", value) : value) };
      }
   },

   /**
    * Remove a metric from the display
    *
    * @param metricName {String} The name of the metric to remove
    * @memberOf Engine
    */
   removeMetric: function(metricName) {
      this.metrics[metricName] = null;
      delete this.metrics[metricName];
   },

   /**
    * Updates the display of the metrics window.
    * @private
    * @memberOf Engine
    */
   updateMetrics: function() {
      var h = "";
      for (var m in this.metrics)
      {
         h += m + ": " + this.metrics[m].val + "<br/>";
      }
      $(".items", this.metricDisplay).html(h);
   },

   /**
    * Prints the version of the engine.
    * @memberOf Engine
    */
   toString: function() {
      return "The Render Engine " + this.version;
   },

   //====================================================================================================
   //====================================================================================================
   //                                        THE WORLD TIMER
   //====================================================================================================
   //====================================================================================================

   /**
    * This is the process which updates the world.  It starts with the default
    * context, telling it to update itself.  Since each context is a container,
    * all of the objects in the container will be called to update, and then
    * render themselves.
    *
    * @private
    * @memberOf Engine
    */
   engineTimer: function() {

      if (!this.running) {
         return;
      }

      // Update the world
      var nextFrame = Engine.fpsClock;
      if (Engine.getDefaultContext() != null)
      {
         Engine.vObj = 0;
         
         // Render a frame
         Engine.worldTime = new Date().getTime();
         Engine.getDefaultContext().update(null, Engine.worldTime);
         Engine.frameTime = new Date().getTime() - Engine.worldTime;
         
         // Determine when the next frame should draw
         // If we've gone over the allotted time, wait until the next available frame
         var f = nextFrame - Engine.frameTime;
         nextFrame = (f > 0 ? f : nextFrame);
         Engine.droppedFrames += (f <= 0 ? Math.round((f * -1) / Engine.fpsClock) : 0);
         
         // Output any metrics
         if (Engine.showMetricsWindow) {
            Engine.renderMetrics();
         }
     }

      // When the process is done, start all over again
      Engine.globalTimer = setTimeout(function _engineTimer() { Engine.engineTimer(); }, nextFrame);
   }

 }, { // Interface
   globalTimer: null
 });

/**
 * The Render Engine
 * 
 * An extension to the engine for script loading and processing.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 *
 * @author: $Author$
 * @version: $Revision$
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
 * THE SOFTWARE.
 *
 */

//====================================================================================================
//====================================================================================================
//                                     SCRIPT PROCESSING
//====================================================================================================
//====================================================================================================
var Engine = Engine.extend(/** @scope Engine.prototype */{
	constructor: null,

   /*
    * Script queue
    */
	scriptQueue: [],
	loadedScripts: {},			// Cache of loaded scripts
   scriptLoadCount: 0,			// Number of queued scripts to load
   scriptsProcessed: 0,			// Number of scripts processed
   scriptRatio: 0,				// Ratio between processed/queued
	queuePaused:false,			// Script queue paused flag
	pauseReps: 0,					// Queue run repetitions while paused
	
   /**
    * Status message when a script is not found
    * @memberOf Engine
    */
   SCRIPT_NOT_FOUND: false,
   
   /**
    * Status message when a script is successfully loaded
    * @memberOf Engine
    */
   SCRIPT_LOADED: true,

   /**
    * Include a script file.
    *
    * @param scriptURL {String} The URL of the script file
    * @memberOf Engine
    */
   include: function(scriptURL) {
      Engine.loadNow(scriptURL);
   },

   /**
    * Perform an immediate load on the specified script.  Objects within
    * the script may not immediately initialize, unless their dependencies
    * have been resolved.
    * 
    * @param {String} scriptPath The path to the script to load
    * @param {Function} [cb] The function to call when the script is loaded.
    *                   the path of the script loaded and a status message
    *                   will be passed as the two parameters.
    * @memberOf Engine
    * @private
    */
   loadNow: function(scriptPath, cb) {
      this.doLoad(this.getEnginePath() + scriptPath, scriptPath, cb);
   },
	
   /**
    * Queue a script to load from the server and append it to
    * the head element of the browser.  Script names are
    * cached so they will not be loaded again.  Each script in the
    * queue is processed synchronously.
    *
    * @param scriptPath {String} The URL of a script to load.
    * @memberOf Engine
    */
   loadScript: function(scriptPath) {
      // Put script into load queue
      Engine.scriptQueue.push(scriptPath);
      Engine.runScriptQueue();
   },

   /**
    * Internal method which runs the script queue to handle scripts and functions
    * which are queued to run sequentially.
    * @private
    * @memberOf Engine
    */
   runScriptQueue: function() {
      if (!Engine.scriptQueueTimer) {
         // Process any waiting scripts
         Engine.scriptQueueTimer = setInterval(function() {
            if (Engine.queuePaused) {
               if (Engine.pauseReps++ > 500) {
                  // If after ~5 seconds the queue is still paused, unpause it and
                  // warn the user that the situation occurred
                  Console.error("Script queue was paused for 5 seconds and not resumed -- restarting...");
                  Engine.pauseReps = 0;
                  Engine.pauseQueue(false);
               }
               return;
            }

            Engine.pauseReps = 0;

            if (Engine.scriptQueue.length > 0) {
               Engine.processScriptQueue();
            } else {
               // Stop the queue timer if there are no scripts
               clearInterval(Engine.scriptQueueTimer);
               Engine.scriptQueueTimer = null;
            }
         }, 10);

         Engine.readyForNextScript = true;
      }
   },

   /**
    * Put a callback into the script queue so that when a
    * certain number of files has been loaded, we can call
    * a method.  Allows for functionality to start with
    * incremental loading.
    *
    * @param cb {Function} A callback to execute
    * @memberOf Engine
    */
   setQueueCallback: function(cb) {
      // Put callback into load queue
      Engine.scriptQueue.push(cb);
      Engine.runScriptQueue();
   },

   /**
    * You can pause the queue from a callback function, then
    * unpause it to continue processing queued scripts.  This will
    * allow you to wait for an event to occur before continuing to
    * to load scripts.
    *
    * @param state {Boolean} <tt>true</tt> to put the queue processor
    *                        in a paused state.
    * @memberOf Engine
    */
   pauseQueue: function(state) {
      Engine.queuePaused = state;
   },

   /**
    * Process any scripts that are waiting to be loaded.
    * @private
    * @memberOf Engine
    */
   processScriptQueue: function() {
      if (Engine.scriptQueue.length > 0 && Engine.readyForNextScript) {
         // Hold the queue until the script is loaded
         Engine.readyForNextScript = false;

         // Get next script...
         var scriptPath = Engine.scriptQueue.shift();

         // If the queue element is a function, execute it and return
         if (typeof scriptPath === "function") {
            scriptPath();
            Engine.readyForNextScript = true;
            return;
         }

         this.doLoad(scriptPath);
      }
   },

   /**
    * This method performs the actual script loading.
    * @private
    * @memberOf Engine
    */
   doLoad: function(scriptPath, simplePath, cb) {
      if (!this.started) {
         return;
      }

      var s = scriptPath.replace(/[\/\.]/g,"_");
      if (this.loadedScripts[s] == null)
      {
         // Store the request in the cache
         this.loadedScripts[s] = scriptPath;

	      Engine.scriptLoadCount++;
	      Engine.updateProgress();

         if ($.browser.Wii) {

            $.get(scriptPath, function(data) {

               // Parse script code for syntax errors
               if (Engine.parseSyntax(data)) {
                  var n = document.createElement("script");
                  n.type = "text/javascript";
                  $(n).text(data);

                  var h = document.getElementsByTagName("head")[0];
                  h.appendChild(n);
                  Engine.readyForNextScript = true;
						
				      Engine.scriptLoadCount--;
				      Engine.updateProgress();
                  Console.debug("Loaded '" + scriptPath + "'");
               }
               
            }, "text");
         }  else {

            // We'll use our own script loader so we can detect errors (i.e. missing files).
            var n = document.createElement("script");
            n.src = scriptPath;
            n.type = "text/javascript";

            // When the file is loaded
            var fn = function() {
               if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                  Console.debug("Loaded '" + scriptPath + "'");
                  Engine.handleScriptDone();
                  if (cb) {
                     cb(simplePath, Engine.SCRIPT_LOADED);
                  }
                  if (!Engine.localMode) {
                     // Delete the script node
                     $(n).remove(); 
                  }

               }
               Engine.readyForNextScript = true;
            };

            // When an error occurs
            var eFn = function(msg) {
               Console.error("File not found: ", scriptPath);
               if (cb) {
                  cb(simplePath, Engine.SCRIPT_NOT_FOUND);
               }
               Engine.readyForNextScript = true;
            };

            if ($.browser.msie) {
               n.defer = true;
               n.onreadystatechange = fn;
               n.onerror = eFn;
            } else {
               n.onload = fn;
               n.onerror = eFn;
            }

            var h = document.getElementsByTagName("head")[0];
            h.appendChild(n);
         }

      } else {
         // Already have this script
         Engine.readyForNextScript = true;
      }
   },

   /**
    * Loads a game's script.  This will wait until the specified
    * <tt>gameObjectName</tt> is available before running it.  Doing so will
    * ensure that all dependencies have been resolved before starting a game.
    * Also creates the default rendering context for the engine.
    * <p/>
    * All games should execute this method to start their processing, rather than
    * using the script loading mechanism for engine or game scripts.  This is used
    * for the main game script only.  Normally it would appear in the game's "index" file.
    * <pre>
    *  &lt;script type="text/javascript"&gt;
    *     // Load the game script
    *     Engine.loadGame('game.js','PistolSlut');
    *  &lt;/script&gt;
    * </pre>
    *
    * @param gameSource {String} The URL of the game script.
    * @param gameObjectName {String} The string name of the game object to execute.  When
    *                       the framework if ready, the <tt>startup()</tt> method of this
    *                       object will be called.
    * @memberOf Engine
    */
   loadGame: function(gameSource, gameObjectName) {
      // We'll wait for the Engine to be ready before we load the game
      var engine = this;
      Engine.gameLoadTimer = setInterval(function() {
         if (window["DocumentContext"] != null) {

            // Start the engine
            Engine.run();

            // Stop the timer
            clearInterval(Engine.gameLoadTimer);
            Engine.gameLoadTimer = null;

            // Load the game
            Console.debug("Loading '" + gameSource + "'");
            engine.loadScript(gameSource);

            // Start the game when it's ready
            if (gameObjectName) {
               Engine.gameRunTimer = setInterval(function() {
                  if (typeof window[gameObjectName] != "undefined" &&
                      window[gameObjectName].setup) {
                     clearInterval(Engine.gameRunTimer);
                     Console.warn("Starting: " + gameObjectName);
                     window[gameObjectName].setup();
                  }
               }, 100);
            }
         }
      }, 100);
   },

   /**
    * Load a script relative to the engine path.  A simple helper method which calls
    * {@link #loadScript} and prepends the engine path to the supplied script source.
    *
    * @param scriptSource {String} A URL to load that is relative to the engine path.
    * @memberOf Engine
    */
   load: function(scriptSource) {
      this.loadScript(this.getEnginePath() + scriptSource);
   },

   /**
    * After a script has been loaded, updates the progress
    * @private
    * @memberOf Engine
    */
   handleScriptDone: function() {
      Engine.scriptsProcessed++;
      Engine.scriptRatio = Engine.scriptsProcessed / Engine.scriptLoadCount;
      Engine.scriptRatio = Engine.scriptRatio > 1 ? 1 : Engine.scriptRatio;
      Engine.updateProgress();
   },

   /**
    * Updates the progress bar (if available)
    * @private
    * @memberOf Engine
    */
   updateProgress: function() {
      var pBar = jQuery("#engine-load-progress");
      if (pBar.length > 0) {
         // Update their progress bar
         if (pBar.css("position") != "relative" || pBar.css("position") != "absolute") {
            pBar.css("position", "relative");
         }
         var pW = pBar.width();
         var fill = Math.floor(pW * Engine.scriptRatio);
         var fBar = jQuery("#engine-load-progress .bar");
         if (fBar.length == 0) {
            fBar = jQuery("<div class='bar' style='position: absolute; top: 0px; left: 0px; height: 100%;'></div>");
            pBar.append(fBar);
         }
         fBar.width(fill);
			jQuery("#engine-load-info").text(Engine.scriptsProcessed + " of " + Engine.scriptLoadCount);
      }
   },

   /**
    * Load a stylesheet and append it to the document.  Allows for
    * scripts to specify additional stylesheets that can be loaded
    * as needed.  Additionally, you can use thise method to inject
    * the engine path into the css being loaded.  Using the variable
    * <tt>$&lt;enginePath&gt;</tt>, you can load css relative to the
    * engine's path.  For example:
    * <pre>
    *    .foo {
    *       background: url('$&lt;enginePath&gt;/myGame/images/bar.png') no-repeat 50% 50%;
    *    }
    * </pre>
    *
    * @param stylesheetPath {String} Path to the stylesheet, relative to
    *                                the engine path.
    * @memberOf Engine
    */
   loadStylesheet: function(stylesheetPath, relative) {
      stylesheetPath = (relative ? "" : this.getEnginePath()) + stylesheetPath;
      var f = function() {
         $.get(stylesheetPath, function(data) {
            // process the data to replace the "enginePath" variable
            var epRE = /(\$<enginePath>)/g;
            data = data.replace(epRE, Engine.getEnginePath());
            $("head", document).append($("<style type='text/css'/>").text(data));
            Console.debug("Stylesheet loaded '" + stylesheetPath + "'");
         }, "text");
      };

      this.setQueueCallback(f);
   },

   /**
    * Output the list of scripts loaded by the Engine to the console.
    * @memberOf Engine
    */
   dumpScripts: function() {
      for (var f in this.loadedScripts)
      {
         Console.debug(this.loadedScripts[f]);
      }
   },

   /**
    * Clears the script name cache.  Allows scripts to be loaded
    * again.  Use this method with caution, as it is not recommended
    * to load a script if the object is in use.  May cause unexpected
    * results.
    * @memberOf Engine
    */
   clearScriptCache: function() {
      this.loadedScripts = {};
   }
   
});

/**
 * The Render Engine
 * Engine initialization
 *
 * @fileoverview Initializes the console and engine
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 681 $
 *
 * Copyright (c) 2009 Brett Fattori (brettf@renderengine.com)
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

// Start the console so logging can take place immediately
Console.startup();

// Start the engine
Engine.startup();

// Set up the engine using whatever query params were passed
Engine.setDebugMode(EngineSupport.checkBooleanParam("debug"));

if (Engine.getDebugMode())
{
   Console.setDebugLevel(EngineSupport.getNumericParam("debugLevel", Console.DEBUGLEVEL_DEBUG));
}

if (EngineSupport.checkBooleanParam("metrics"))
{
   Engine.showMetrics();
}

// Local mode keeps loaded script source available
Engine.localMode = EngineSupport.checkBooleanParam("local");

