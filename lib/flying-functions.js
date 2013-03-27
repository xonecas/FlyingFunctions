/*jslint browser:true */
(function () {
    'use strict';

    // remember: This is a study, hand build everything, no dependencies
    //              use all the latest and greatest that you can out of JS
    //              Good luck! :-)
    //                                                  Optimistic Sean.

    // expected:
    // crud for the canvas
    // expose 2d api plus some helpers
    // event based, allow for plugins to listen to events, like frame drawn
    // plugin class
    //      an extendable prototype
    //
    // three.js friendlyness?
    //
    // How do I write tests?
    //  for now maybe just a test class...

    var FlyingFunctions,
        Events,
        Plugin,

        slice = Array.prototype.slice,
        animFrame;

    // mixer: [s]ource into [d]estination
    // careful, it will overwrite without shame.
    function mix(s, d) {
        var keys = Object.keys(s),
            key;
        while (keys.length) {
            key = keys.shift();
            d[key] = s[key];
        }

        return d;
    }

    // Opera engineer Erik Möller wrote about rAF and developed a polyfill that
    // better handles browsers without native support. You can read about it, but
    // basically his code will choose a delay of between 4ms and 16ms in order to
    // more closely match 60fps. Here it is, in case you’d like to use it. Note it
    // uses the standard method name. I have also fixed the cancel* method’s name,
    // as it has changed in WebKit.
    //
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    (function() {
        var lastTime = 0,
            vendors = ['webkit', 'moz'],
            x;

        for(x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                            window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());

    // https://github.com/jeromeetienne/microevent.js
    // simple events
    Events = function (){
        // keep this empty so when mixed the class we are mixing in doesn't have to
        // worry about calling this contructor.
    };

    Events.prototype = {
        // attach the event
        on: function (ev, fn) {
            this.events = this.events || {};
            this.events[ev] = this.events[ev] || [];
            this.events[ev].push(fn);
            // chainable
            return this;
        },

        off: function (ev, fn) {
            this.events = this.events || {};
            if (this.events[ev] === undefined) { return this; }
            this.events[ev].splice(this.events[ev].indexOf(fn), 1);
            // chainable
            return this;
        },

        once: function (ev, fn) {
            var self = this;
            this.on(ev, function () {
                fn.apply(self, arguments);
                self.off(ev, fn);
            });
            // chainable
            return this;
        },

        // trigger an event and pass arguments to the handlers
        trigger: function (ev) {
            this.events = this.events || {};
            if (this.events && this.events[ev] === undefined) { return this; }
            var handlers = this.events[ev],
                len = handlers.length;
            while (len) {
                len -= 1;
                handlers[len].apply(this, slice.call(arguments, 1));
            }
            // chainable
            return this;
        },
    };

    // Flying functions engine
    // -----------------------
    //
    // Usage: `new FlyingFunctions({ option: value, ... });`
    //
    // options:
    //  + fps = an integer between 1 and 60
    //  + canvas = the convas html element
    //  + c = the drawing context
    //  + container = the container to which append the canvas

    FlyingFunctions = function (opts) {
        opts = opts || {};

        // defaults, mark them on the opts obj that gets passed to the
        // `init` event.
        this.fps = opts.fps || 60;
        this.container = opts.container || document.querySelector('body');

        // initialize the main canvas
        this.canvas = opts.canvas;
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.c = this.canvas.getContext('2d');
        }

        this.c = opts.c || this.canvas.getContext('2d');

        // expose the canvas
        this.container.appendChild(this.canvas);
        this.canvas.width = opts.width || this.container.innerWidth;
        this.canvas.height = opts.height || this.container.innerHeight;

        // call any init function that might have been passed
        if (opts.init) {
            opts.init.call(this, opts);
        }

        // loop needs to be bound.
        this.loop = this.loop.bind(this);

        return this;
    };

    FlyingFunctions.prototype = mix(Events.prototype, {
        Plugin: Plugin,

        loop: function () {
            var self = this;

            setTimeout(function () {
                window.requestAnimationFrame(self.loop);

                // call out event
                self.trigger('frame');

            }, 1000 / this.fps);

            return this;
        }
    });

    window.FlyingFunctions = FlyingFunctions;
}());
