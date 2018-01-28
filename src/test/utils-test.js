/*global config, console*/

var modules = window.modules || {};

(function () {

    'use strict';

    //polyfill Object.assign
    if (typeof Object.assign != 'function') {
        Object.assign = function (target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // pasamos si es undefined o null
                    for (var nextKey in nextSource) {
                        // Evita un error cuando 'hasOwnProperty' ha sido sobrescrito
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }

    modules.utils = modules.utils || (function () {
        return {
            generateUniqueId: function(tag) {
                return tag + Math.random().toString(36).slice(2) +'gid';
            },

            makeObservable: function (subject, events) {
                events = events || [];
                subject.getEvents = function () {
                    return events;
                };

                subject.firesEvent = function (eventName) {
                    return events.join().indexOf(eventName) !== -1;
                };

                subject.on = function (eventName, callback, context) {
                    this.observers = this.observers || {};
                    eventName = eventName.split(' ');

                    for (var i = 0, l = eventName.length; i < l; i++) {
                        this.observers[eventName[i]] = this.observers[eventName[i]] || [];
                        this.observers[eventName[i]].push({
                            callback: callback,
                            context: context
                        });
                    }

                    return subject;
                };

                subject.off = function (eventName, callback, context) {
                    if (this.observers) { //throw new Error('One false move, baby, suddenly everything's ruined');
                        eventName = eventName.split(' ');
                        for (var i = 0, l = eventName.length; i < l; i++) {
                            if (this.observers[eventName[i]]) {
                                for (var j = 0, m = this.observers[eventName[i]].length; j < m; j++) {
                                    if (this.observers[eventName[i]][j].context === context &&
										this.observers[eventName[i]][j].callback.toString() === callback.toString()) {
                                        this.observers[eventName[i]].splice(j, 1);
                                        break;
                                    }
                                }
                            }
                        }

                        return subject;
                    }
                };

                var functionCall = function (observer, params) {
                    return function () {
                        observer.callback.apply(observer.context, params);
                    };
                };

                subject.trigger = function (eventName) {
                    var params = [].slice.call(arguments, 1);
                    // this is a potential breaker ;p
                    if (modules.utils.isArray(params[0])) params = params[0];
                    if (this.observers && this.observers[eventName]) {
                        for (var i = 0, l = this.observers[eventName].length; i < l; i++) {
                            setTimeout(functionCall(this.observers[eventName][i], params), 10);
                        }
                    }
                };

                subject.triggerSync = function (eventName) {
                    var params = [].slice.call(arguments, 1);
                    if (modules.utils.isArray(params[0])) params = params[0];
                    if (this.observers && this.observers[eventName]) {
                        for (var i = 0, l = this.observers[eventName].length; i < l; i++) {
                            this.observers[eventName][i].callback.apply(this.observers[eventName][i].context, params);
                        }
                    }
                };
            }

        };
    })();

})();
