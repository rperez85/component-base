export default (subject, events) => {
    events = events||[];
    subject.getEvents = function() {
        return events;
    };

    subject.firesEvent = function(eventName) {
        return events.join().indexOf(eventName) !== -1;
    };

    subject.on = function(eventName, callback, context) {
        this.observers = this.observers || {};
        eventName = eventName.split(' ');

        for (var i=0,l=eventName.length;i<l;i++) {
            this.observers[eventName[i]] = this.observers[eventName[i]] || [];
            this.observers[eventName[i]].push({
                callback: callback,
                context: context
            });
        }

        return subject;
    };

    subject.off = function(eventName, callback, context) {
        if (this.observers) { //throw new Error('One false move, baby, suddenly everything's ruined');
            eventName = eventName.split(' ');
            for (var i=0,l=eventName.length;i<l;i++) {
                if (this.observers[eventName[i]]) {
                    for (var j=0,m=this.observers[eventName[i]].length;j<m;j++) {
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

    var functionCall = function(observer, params) {
        return function() {
            observer.callback.apply(observer.context,params);
        };
    };

    subject.trigger = function(eventName) {
        var params = [].slice.call(arguments,1);
        // this is a potential breaker ;p
        if (isArray(params[0])) params = params[0];
        if (this.observers && this.observers[eventName]) {
            for (var i=0,l=this.observers[eventName].length;i<l;i++) {
                setTimeout(functionCall(this.observers[eventName][i], params),10);
            }
        }
    };

    subject.triggerSync = function(eventName) {
        var params = [].slice.call(arguments,1);
        if (isArray(params[0])) params = params[0];
        if (this.observers && this.observers[eventName]) {
            for (var i=0,l=this.observers[eventName].length;i<l;i++) {
                this.observers[eventName][i].callback.apply(this.observers[eventName][i].context,params);
            }
        }
    };

    return subject;
}

const isArray = (obj) => {
    return Array.isArray?Array.isArray(obj):(Object.prototype.toString.call(obj) === '[object Array]');
}

