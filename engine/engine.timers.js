/**
 * The Render Engine
 * Timers
 *
 * @fileoverview A collection of timer objects.
 *
 * @author: Brett Fattori (brettf@renderengine.com)
 * @author: $Author: bfattori $
 * @version: $Revision: 697 $
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

// Includes
Engine.include("/engine/engine.baseobject.js");

Engine.initObject("Timer", "BaseObject", function() {

/**
 * @class The base abstract class for all timers.
 *
 * @param name {String} The name of the timer
 * @param interval {Number} The interval for the timer, in milliseconds
 * @param callback {Function} The function to call when the interval is reached
 *
 * @extends BaseObject
 */
var Timer = BaseObject.extend(/** @scope Timer.prototype */{

   timer: null,

   running: false,

   constructor: function(name, interval, callback) {
      callback = name instanceof Number ? interval : callback;
      interval = name instanceof Number ? name : interval;
      name = name instanceof Number ? "Timer" : name;

      Assert((typeof callback == "function"), "Callback must be a function in Timer");

      this.base(name);
      this.interval = interval;
      this.callback = callback;
      this.restart();
   },

   release: function() {
      this.base();
      this.timer = null;
      this.running = false;
   },

   /**
    * Stop the timer and remove it from the system
    */
   destroy: function() {
      this.timer = null;
      this.base();
   },

   /**
    * Get the underlying system timer object.
    */
   getTimer: function() {
      return this.timer;
   },

   /**
    * Set the underlying system timer object.
    *
    * @param timer {Object} The timer object
    */
   setTimer: function(timer) {
      this.timer = timer;
   },

   /**
    * Returns <tt>true</tt> if the timer is currently running.
    * @return {Boolean} <tt>true</tt> if the timer is running
    */
   isRunning: function() {
      return this.running;
   },

   /**
    * Cancel the timer.
    */
   cancel: function() {
      this.timer = null;
      this.running = false;
   },

   /**
    * Cancel the running timer and restart it.
    */
   restart: function() {
      this.cancel();
      this.running = true;
   },

   /**
    * Set the callback function for this timer.  If the timer is
    * currently running, it will be restarted.
    *
    * @param callback {Function} A function object to call
    */
   setCallback: function(callback) {
      Assert((typeof callback == "function"), "Callback must be a function in Timer.setCallback");
      this.callback = callback;
      if (this.isRunning)
      {
         this.restart();
      }
   },

   /**
    * Get the callback function for this timer.
    * @return {Function} The callback function
    */
   getCallback: function() {
      return this.callback;
   },

   /**
    * Set the interval of this timer.  If the timer is running, it
    * will be cancelled.
    *
    * @param interval {Number} The interval of this timer, in milliseconds
    */
   setInterval: function(interval) {
      this.cancel();
      this.interval = interval;
   },

   /**
    * Get the interval of this timer, in milliseconds.
    * @return {Number} The interval
    */
   getInterval: function() {
      return this.interval;
   }
}, { /** @scope Timer.prototype */
   /**
    * Get the class name of this object
    * @return {String} "Timer"
    */
   getClassName: function() {
      return "Timer";
   }
});

return Timer;

});

Engine.initObject("Timeout", "Timer", function() {

/**
 * @class A timer that wraps the <tt>window.setTimeout</tt> method.
 * @extends Timer
 */
var Timeout = Timer.extend(/** @scope Timeout.prototype */{

   /**
    * Cancel this timeout timer.
    */
   cancel: function() {
      window.clearTimeout(this.getTimer());
      this.base();
   },

   destroy: function() {
      this.cancel();
      this.base();
   },

   /**
    * Restart this timeout timer
    */
   restart: function() {
      this.setTimer(window.setTimeout(this.getCallback(), this.getInterval()));
   }
}, { /** @scope Timeout.prototype */
   /**
    * Get the class name of this object
    * @return {String} "Timeout"
    */
   getClassName: function() {
      return "Timeout";
   }
});

return Timeout;

});

Engine.initObject("OneShotTimeout", "Timeout", function() {

/**
 * @class A one-shot timer that cannot be restarted and will
 *        self-destroy after it completes its interval..
 *
 * @param name {String} The name of the timer
 * @param interval {Number} The interval for the timer, in milliseconds
 * @param callback {Function} The function to call when the interval is reached
 */
var OneShotTimeout = Timeout.extend(/** @scope OneShotTimeout.prototype */{

   constructor: function(name, interval, callback) {

      var cb = function() {
         var aC = arguments.callee;
         aC.timer.destroy();
         aC.cbFn();
      };
      cb.cbFn = callback;
      cb.timer = this;

      this.base(name, interval, cb);
   },

   /**
    * This timer cannot be restarted.
    * @private
    */
   restart: function() {
      if (this.running)
      {
         return;
      }

      this.base();
   }
}, { /** @scope OneShotTimeout.prototype */

   /**
    * Get the class name of this object
    * @return {String} "OneShotTimeout"
    */
   getClassName: function() {
      return "OneShotTimeout";
   }
});

return OneShotTimeout;

});

Engine.initObject("OneShotTrigger", "OneShotTimeout", function() {

/**
 * @class A one-shot timer that triggers a callback, at regular intervals,
 *        until the timer has expired.  When the timer expires, the trigger
 *        will automatically destroy itself.
 *
 * @param name {String} The name of the timer
 * @param interval {Number} The interval for the timer, in milliseconds
 * @param callback {Function} The function to call when the interval is reached
 * @param triggerInterval {Number} The interval between triggers, in milliseconds
 * @param triggerCallback {Function} The function to call for each trigger interval
 */
var OneShotTrigger = OneShotTimeout.extend(/** @scope OneShotTimeout.prototype */{

   constructor: function(name, interval, callback, triggerInterval, triggerCallback) {
      var doneFn = function() {
         var aC = arguments.callee;
         aC.intv.destroy();
         aC.cb();
      };
      // Create an Interval internally
      doneFn.intv = Interval.create(name + "_trigger", triggerInterval, triggerCallback);
      doneFn.cb = callback;

      this.base(name, interval, doneFn);
   }
}, { /** @scope OneShotTrigger.prototype */

   /**
    * Get the class name of this object
    * @return {String} "OneShotTrigger"
    */
   getClassName: function() {
      return "OneShotTrigger";
   }
});

return OneShotTrigger;

});

Engine.initObject("MultiTimeout", "Timeout", function() {

/**
 * @class A timer that will repeat the specified number of times before
 *        destroying itself.  The callback will be triggered with the
 *        repetition number as the only argument.
 *
 * @extends Timeout
 */
var MultiTimeout = Timeout.extend(/** @scope MultiTimeout.prototype */{

   constructor: function(name, reps, interval, callback) {

      var cb = function() {
         var aC = arguments.callee;
         if (aC.reps-- > 0) {
            aC.cbFn(aC.reps);
            aC.timer.restart();
         } else {
            aC.timer.destroy();
         }
      };
      cb.cbFn = callback;
      cb.timer = this;
      cb.reps = reps;

      this.base(name, interval, cb);
   }
   
}, { /** @scope MultiTimeout.prototype */

   /**
    * Get the class name of this object
    * @return {String} "MultiTimeout"
    */
   getClassName: function() {
      return "MultiTimeout";
   }
});

return MultiTimeout;

});

Engine.initObject("Interval", "Timer", function() {

/**
 * @class A timer that wraps the <tt>window.setInterval</tt> method.
 * @extends Timer
 */
var Interval = Timer.extend(/** @scope Interval.prototype */{

   /**
    * Cancel this interval timer.
    */
   cancel: function() {
      window.clearInterval(this.getTimer());
      this.base();
   },

   destroy: function() {
      this.cancel();
      this.base();
   },

   /**
    * Restart this interval timer.
    */
   restart: function() {
      this.setTimer(window.setInterval(this.getCallback(), this.getInterval()));
   }
}, { /** @scope Interval.prototype */

   /**
    * Get the class name of this object
    * @return {String} "Interval"
    */
   getClassName: function() {
      return "Interval";
   }
});

return Interval;

});

