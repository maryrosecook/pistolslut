/**
 * The Render Engine
 * InputComponent
 *
 * @fileoverview An extension of the logic component which efficiently 
 *               notifies a list of recipients when events are triggered.
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
Engine.include("/components/component.logic.js");

Engine.initObject("NotifierComponent", "LogicComponent", function() {

/**
 * @class A component which notifies objects when an action occurs.  The component
 *        uses a subscriber model to notify an object when certain actions occur.
 *        This component can be used so that multiple objects could subscribe to one
 *        to be notified when a particular event occurs.  The objects don't have to
 *        exist within the same scope.
 *        <p/>
 *        For example, a host object could publish an event of type "death" that other
 *        hosts are listening for.  Thus, when the host dies, it can pass relevant
 *        information that other objects (such as a life counter) could respond to.
 *        Rather than the host having to actively know about other parts of the
 *        game world, those other objects could "listen in" on the actions of the host
 *        and act accordingly.
 *
 * @param name {String} The name of the component
 * @param [priority=1.0] {Number} The priority of the component
 * @extends LogicComponent
 * @constructor
 * @description Create a notifier component
 */
var NotifierComponent = LogicComponent.extend(/** @scope NotifierComponent.prototype */{

   notifyLists: null,

   /**
    * @private
    */
   constructor: function(name, priority) {
      this.base(name, priority || 1.0);
      this.notifyLists = {};
   },

   /**
    * Releases the component back into the object pool. See {@link PooledObject#release}
    * for more information.
    */
   release: function() {
      this.base();
      this.notifyLists = null;
   },

   /**
    * Subscribe to the event type specified.  The specified callback
    * will be passed the relative object and event object as its arguments.
    *
    * @param type {String} The type name of the event list.
    * @param thisObj {Object} The scope object for the callback, or <tt>null</tt>
    * @param fn {Function} The function to call when the event triggers.
    */
   subscribe: function(type, thisObj, fn) {
      if (this.notifyLists[type] == null) {
         this.notifyLists[type] = [];
      }
      this.notifyLists[type].push({parent: thisObj, func: fn});
   },

   /**
    * @deprecated
    * @see #subscribe
    */
   addRecipient: function(type, thisObj, fn) {
      this.subscribe(type, thisObj, fn);
   },

   /**
    * Unsubscribe from the event type specified.  If you only
    * pass the event type, all subscribers will be removed.  Passing
    * the type and relative object will remove all listeners for the
    * event type and scoped object.  Finally, passing the type, scoped
    * object, and callback will remove the specific subscriber.
    *
    * @param type {String} The type name of the event list.
    * @param [thisObj] {Object} The scope object for the callback
    * @param [fn] {Function} The function to remove from the notification list.
    */
   unsubscribe: function(type, thisObj, fn) {
      if (fn != null) {
         // Remove a specific subscriber
         var o = {parent: thisObj, func: fn};
         EngineSupport.arrayRemove(this.notifyLists[type], o);
      } else if (thisObj != null) {
         // Remove all subscribers for the scope object
         var newSubscribers = EngineSupport.filter(this.notifyLists[type], 
            function(val, idx) {
               return (val.parent !== thisObj);
            });
         this.notifyLists[type] = newSubscribers;
      } else {
         // Remove all subscribers for the event type
         this.notifyLists[type] = [];
      }
   },
   
   /**
    * @deprecated
    * @see #unsubscribe
    */
   removeRecipient: function(type, thisObj, fn) {
      
   },

   /**
    * Post a message of the given type, with the event object
    * which subscribers will act upon.
    *
    * @param type {String} The type of the event
    * @param eventObj {Object} An object which subscribers can use
    */
   post: function(type, eventObj) {
      this.notifyRecipients(type, eventObj);      
   },

   /**
    * Run through the list of subscribers for the event type specified.  
    * Optimized for speed if the list is large.
    * @private
    */
   notifyRecipients: function(type, eventObj) {
      if (this.notifyLists[type] == null)
      {
         // No handlers for this type
         return;
      }

      // Using Duff's device with loop inversion
      var p = 0;
      var s = null;
      switch(this.notifyLists[type].length & 0x3)
      {
         case 3:
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);
         case 2:
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);
         case 1:
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);
      }

      if (p < this.notifyLists[type].length)
      {
         do
         {
            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

            s = this.notifyLists[type][p++];
            s.func.call(s.parent, eventObj);

         } while (p < this.notifyLists[type].length);
      }
   }
}, /** @scope NotifierComponent.prototype */{
   /**
    * Get the class name of this object
    *
    * @return {String} "NotifierComponent"
    */
   getClassName: function() {
      return "NotifierComponent";
   }
});

return NotifierComponent;

});