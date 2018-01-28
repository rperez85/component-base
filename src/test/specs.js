(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = exports.Component = function () {
    function Component(props) {
        _classCallCheck(this, Component);

        this.props = Object.freeze({
            destiny: props.destiny,
            data: props.data,
            id: props.id || modules.utils.generateUniqueId('cmp_'),
            updateData: props.updateData || function () {},
            updateState: props.updateState || function () {},
            beforeRender: props.beforeRender || function () {},
            afterRender: props.afterRender || function () {},
            removeComponent: props.removeComponent || function () {},
            inlineCss: props.inlineCss || {},
            methods: {
                onClick: props.methods && props.methods.onClick ? props.methods.onClick : function () {},
                onMouseOver: props.methods && props.methods.onMouseOver ? props.methods.onMouseOver : function () {}
            }
        });

        this._data = Object.assign({}, this.props.data, {});
        this._state = {};
        this._destiny = this.props.destiny;
        this._inlineCss = this.props.inlineCss;

        this.props.beforeRender();
        this.beforeRender();

        this.events();
    }

    _createClass(Component, [{
        key: 'remove',
        value: function remove() {
            var hasBeenRemovedFromData = false;

            if (this._destiny) {
                this._data = {};
                this.render();
                hasBeenRemovedFromData = true;
            } else {
                console.warn('you have removed a component: don´t forget to remove the data into the parent of the removed component child.');
            }

            this.props.removeComponent(this._data, hasBeenRemovedFromData);
            this.removeComponent(this._data, hasBeenRemovedFromData);
        }
    }, {
        key: '_nativeMethods',
        value: function _nativeMethods() {
            var _this = this;

            $(this.$el).on('click', function (ev) {
                return _this.props.methods.onClick(ev, _this._data);
            });
            $(this.$el).on('mouseover', function (ev) {
                return _this.props.methods.onMouseOver(ev, _this._data);
            });
        }
    }, {
        key: '_applyInlineCss',
        value: function _applyInlineCss() {
            if (!this._inlineCss) {
                return;
            }

            this.$el.css(this._inlineCss);
        }
    }, {
        key: '_delegateEventsAfterRender',
        value: function _delegateEventsAfterRender() {

            if (!this.$el.length) {
                return;
            }

            this._applyInlineCss();
            this._nativeMethods();
            this.events();
            this.afterRender(this._data);
            this.props.afterRender(this._data);
        }
    }, {
        key: '_checkIfDestinyExists',
        value: function _checkIfDestinyExists() {
            if (this.$destiny.length === 0) {
                throw Error('destiny ' + this._destiny + ' for component ' + this.props.id + ' doesn\xB4t exist in dom.');
            }
        }
    }, {
        key: '_checkIfTemplateExists',
        value: function _checkIfTemplateExists() {
            if (!this.template || this.template === '') {
                throw Error('the template hasn\xB4t been defined.');
            }
        }
    }, {
        key: 'events',
        value: function events() {}
    }, {
        key: 'removeComponent',
        value: function removeComponent() {}
    }, {
        key: 'beforeRender',
        value: function beforeRender() {}
    }, {
        key: 'afterRender',
        value: function afterRender() {}
    }, {
        key: 'updateData',
        value: function updateData() {}
    }, {
        key: 'updateState',
        value: function updateState() {}
    }, {
        key: 'render',
        value: function render() {
            this._checkIfTemplateExists();

            if (this._destiny) {
                this._checkIfDestinyExists();

                if (!this.$el.length) {
                    this.$destiny.append('<div data-component-id="' + this.props.id + '">' + this.template + '</div>');
                } else {
                    this.$el.replaceWith('<div data-component-id="' + this.props.id + '">' + this.template + '</div>');
                }
                this._delegateEventsAfterRender();

                resolveAppendComponent();

                return;
            }

            awaitForResolveAppendComponent().then(this._delegateEventsAfterRender.bind(this));

            return '<div data-component-id="' + this.props.id + '">' + this.template + '</div>';
        }
    }, {
        key: 'data',
        get: function get() {
            return this._data;
        },
        set: function set(data) {
            this._data = Object.assign({}, this._data, data);
            this.updateData(this._data);
            this.props.updateData(this._data);

            //for do that reactive, when data is updated call render again.
            this.render();
        }
    }, {
        key: 'method',
        get: function get() {
            return;
        }
    }, {
        key: 'destiny',
        get: function get() {
            return this._destiny;
        },
        set: function set(destiny) {
            this._destiny = destiny;
        }
    }, {
        key: 'inlineCss',
        set: function set(inlineCss) {
            this._inlineCss = inlineCss;
        }
    }, {
        key: 'componentState',
        get: function get() {
            return componentState;
        },
        set: function set(state) {
            //saves states of component from child to parent
            this._state = Object.assign({}, state, this._state);
            componentState = Object.assign(this._state, componentState, state);
            this.updateState(componentState);
        }
    }, {
        key: '$destiny',
        get: function get() {
            if (!this._destiny) {
                return;
            }

            return $(this._destiny);
        }
    }, {
        key: '$el',
        get: function get() {
            return $('[data-component-id="' + this.props.id + '"]');
        }
    }]);

    return Component;
}();

var resolveAppendComponent = void 0,
    componentState = {};

var promiseAppendComponent = new Promise(function (_resolve) {
    resolveAppendComponent = _resolve;
});

async function awaitForResolveAppendComponent() {
    return promiseAppendComponent;
}

},{}],2:[function(require,module,exports){
'use strict';

var _component_base = require('./component_base.js');

describe('ComponentBase Spec', function () {
    var component = void 0;
    var destinyTest;

    beforeEach(function () {
        destinyTest = $('<div id="destiny">');
        $(document.body).append(destinyTest);

        component = new _component_base.Component({
            destiny: '#destiny',
            data: {
                'text': 'boton 1',
                'href': '#'
            }
        });

        component.template = '<div></div>';
    });

    it('props siempre es inmutable aunque se modifique el data', function () {
        component._data = {};

        expect(component.data).not.toEqual(component.props.data);
    });

    it('reactividad: al cambiar una propiedad del data se renderiza de nuevo el componente', function () {
        spyOn(component, 'render');
        component.data = {};
        expect(component.render).toHaveBeenCalled();
    });

    //it('propagación de eventos de hijos a padre', function () {

    //});

    it('change data event: tras cambiar una propiedad del data se llama al método "updateData"', function () {
        spyOn(component, 'updateData');
        component.data = {};
        expect(component.updateData).toHaveBeenCalled();
    });

    //it('before render: al instanciar un componente sin tener que haberse renderizado aún se invoca al evento "beforeRender"', function () {
    //    spyOn(component, 'beforeRender');
    //    expect(component.beforeRender).toHaveBeenCalled();
    //});

    it('after render: tras renderizar un componente en el dom se llama al método "afterRender"', function () {
        spyOn(component, 'afterRender');
        component.render();
        expect(component.afterRender).toHaveBeenCalled();
    });

    it('remove component: tras borrar un componente en el dom se llama al método "removeComponent"', function () {
        spyOn(component, 'removeComponent');
        component.remove();
        expect(component.removeComponent).toHaveBeenCalled();
    });

    it('remove component: tras borrar un componente si existe "destiny" se llama al método "render" para actualizar el componente', function () {
        spyOn(component, 'render');
        component.remove();
        expect(component.render).toHaveBeenCalled();
    });

    it('native methods: tras renderizar un componente se delegan los métodos nativos de éste', function () {
        spyOn(component, '_nativeMethods');
        component.render();
        expect(component._nativeMethods).toHaveBeenCalled();
    });

    it('componente es insertado es insertado en el dom tras lanzarse render()', function () {
        component.render();
        expect($('[data-component-id="' + component.props.id + '"]').length > 0).toBe(true);
    });

    it('inline-style es insertado debe crearse atributo style en el div del componente con las propiedades css ', function () {
        component.inlineCss = { 'color': 'red' };
        component.render();
        expect($('[data-component-id="' + component.props.id + '"]').attr('style') != 'undefined' && $('[data-component-id="' + component.props.id + '"]').attr('style') != '').toBe(true);
    });
});

},{"./component_base.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb21wb25lbnRzXFxjb21wb25lbnRfYmFzZVxcY29tcG9uZW50X2Jhc2UuanMiLCJjb21wb25lbnRzXFxjb21wb25lbnRfYmFzZVxcY29tcG9uZW50X2Jhc2UudGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNDYSxTLFdBQUEsUztBQUNULHVCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFDZixhQUFLLEtBQUwsR0FBYSxPQUFPLE1BQVAsQ0FBYztBQUN2QixxQkFBUyxNQUFNLE9BRFE7QUFFdkIsa0JBQU0sTUFBTSxJQUZXO0FBR3ZCLGdCQUFJLE1BQU0sRUFBTixJQUFZLFFBQVEsS0FBUixDQUFjLGdCQUFkLENBQStCLE1BQS9CLENBSE87QUFJdkIsd0JBQVksTUFBTSxVQUFOLElBQW9CLFlBQVcsQ0FBRSxDQUp0QjtBQUt2Qix5QkFBYSxNQUFNLFdBQU4sSUFBcUIsWUFBVyxDQUFFLENBTHhCO0FBTXZCLDBCQUFjLE1BQU0sWUFBTixJQUFzQixZQUFXLENBQUUsQ0FOMUI7QUFPdkIseUJBQWEsTUFBTSxXQUFOLElBQXFCLFlBQVcsQ0FBRSxDQVB4QjtBQVF2Qiw2QkFBaUIsTUFBTSxlQUFOLElBQXlCLFlBQVcsQ0FBRSxDQVJoQztBQVN2Qix1QkFBVyxNQUFNLFNBQU4sSUFBbUIsRUFUUDtBQVV2QixxQkFBUztBQUNMLHlCQUFTLE1BQU0sT0FBTixJQUFpQixNQUFNLE9BQU4sQ0FBYyxPQUEvQixHQUF5QyxNQUFNLE9BQU4sQ0FBYyxPQUF2RCxHQUFpRSxZQUFXLENBQUUsQ0FEbEY7QUFFTCw2QkFBYSxNQUFNLE9BQU4sSUFBaUIsTUFBTSxPQUFOLENBQWMsV0FBL0IsR0FBNkMsTUFBTSxPQUFOLENBQWMsV0FBM0QsR0FBeUUsWUFBVyxDQUFFO0FBRjlGO0FBVmMsU0FBZCxDQUFiOztBQWdCQSxhQUFLLEtBQUwsR0FBYSxPQUFPLE1BQVAsQ0FB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QUFNQSxPQUFHLDRGQUFILEVBQWlHLFlBQVk7QUFDekcsY0FBTSxTQUFOLEVBQWlCLGlCQUFqQjtBQUNBLGtCQUFVLE1BQVY7QUFDQSxlQUFPLFVBQVUsZUFBakIsRUFBa0MsZ0JBQWxDO0FBQ0gsS0FKRDs7QUFNQSxPQUFHLDJIQUFILEVBQWdJLFlBQVk7QUFDeEksY0FBTSxTQUFOLEVBQWlCLFFBQWpCO0FBQ0Esa0JBQVUsTUFBVjtBQUNBLGVBQU8sVUFBVSxNQUFqQixFQUF5QixnQkFBekI7QUFDSCxLQUpEOztBQU1BLE9BQUcsc0ZBQUgsRUFBMkYsWUFBWTtBQUNuRyxjQUFNLFNBQU4sRUFBaUIsZ0JBQWpCO0FBQ0Esa0JBQVUsTUFBVjtBQUNBLGVBQU8sVUFBVSxjQUFqQixFQUFpQyxnQkFBakM7QUFDSCxLQUpEOztBQU1BLE9BQUcsdUVBQUgsRUFBNEUsWUFBWTtBQUNwRixrQkFBVSxNQUFWO0FBQ0EsZUFBTywyQkFBeUIsVUFBVSxLQUFWLENBQWdCLEVBQXpDLFNBQWlELE1BQWpELEdBQTBELENBQWpFLEVBQW9FLElBQXBFLENBQXlFLElBQXpFO0FBQ0gsS0FIRDs7QUFLQSxPQUFHLHlHQUFILEVBQThHLFlBQVk7QUFDdEgsa0JBQVUsU0FBVixHQUFzQixFQUFDLFNBQVMsS0FBVixFQUF0QjtBQUNBLGtCQUFVLE1BQVY7QUFDQSxlQUFPLDJCQUF5QixVQUFVLEtBQVYsQ0FBZ0IsRUFBekMsU0FBaUQsSUFBakQsQ0FBc0QsT0FBdEQsS0FBa0UsV0FBbEUsSUFBaUYsMkJBQXlCLFVBQVUsS0FBVixDQUFnQixFQUF6QyxTQUFpRCxJQUFqRCxDQUFzRCxPQUF0RCxLQUFrRSxFQUExSixFQUE4SixJQUE5SixDQUFtSyxJQUFuSztBQUNILEtBSkQ7QUFLSCxDQW5GRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu79cclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLnByb3BzID0gT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICAgICAgICAgIGRlc3Rpbnk6IHByb3BzLmRlc3RpbnksXHJcbiAgICAgICAgICAgIGRhdGE6IHByb3BzLmRhdGEsXHJcbiAgICAgICAgICAgIGlkOiBwcm9wcy5pZCB8fCBtb2R1bGVzLnV0aWxzLmdlbmVyYXRlVW5pcXVlSWQoJ2NtcF8nKSxcclxuICAgICAgICAgICAgdXBkYXRlRGF0YTogcHJvcHMudXBkYXRlRGF0YSB8fCBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgICAgICB1cGRhdGVTdGF0ZTogcHJvcHMudXBkYXRlU3RhdGUgfHwgZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgYmVmb3JlUmVuZGVyOiBwcm9wcy5iZWZvcmVSZW5kZXIgfHwgZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICAgICAgYWZ0ZXJSZW5kZXI6IHByb3BzLmFmdGVyUmVuZGVyIHx8IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgICAgIHJlbW92ZUNvbXBvbmVudDogcHJvcHMucmVtb3ZlQ29tcG9uZW50IHx8IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgICAgIGlubGluZUNzczogcHJvcHMuaW5saW5lQ3NzIHx8IHt9LFxyXG4gICAgICAgICAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiBwcm9wcy5tZXRob2RzICYmIHByb3BzLm1ldGhvZHMub25DbGljayA/IHByb3BzLm1ldGhvZHMub25DbGljayA6IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgICAgICAgICBvbk1vdXNlT3ZlcjogcHJvcHMubWV0aG9kcyAmJiBwcm9wcy5tZXRob2RzLm9uTW91c2VPdmVyID8gcHJvcHMubWV0aG9kcy5vbk1vdXNlT3ZlciA6IGZ1bmN0aW9uKCkge31cclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2RhdGEgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLmRhdGEsIHt9KTsgIFxyXG4gICAgICAgIHRoaXMuX3N0YXRlID0ge307XHJcbiAgICAgICAgdGhpcy5fZGVzdGlueSA9IHRoaXMucHJvcHMuZGVzdGlueTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2lubGluZUNzcyA9IHRoaXMucHJvcHMuaW5saW5lQ3NzOyAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnByb3BzLmJlZm9yZVJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuYmVmb3JlUmVuZGVyKCk7ICAgICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5ldmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZGF0YShkYXRhKSB7ICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLl9kYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGF0YSwgZGF0YSk7ICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGVEYXRhKHRoaXMuX2RhdGEpO1xyXG4gICAgICAgIHRoaXMucHJvcHMudXBkYXRlRGF0YSh0aGlzLl9kYXRhKTtcclxuXHJcbiAgICAgICAgLy9mb3IgZG8gdGhhdCByZWFjdGl2ZSwgd2hlbiBkYXRhIGlzIHVwZGF0ZWQgY2FsbCByZW5kZXIgYWdhaW4uXHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTsgIFxyXG4gICAgfVxyXG5cclxuICAgIGdldCBtZXRob2QoKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRlc3RpbnkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc3Rpbnk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGRlc3RpbnkoZGVzdGlueSkge1xyXG4gICAgICAgIHRoaXMuX2Rlc3RpbnkgPSBkZXN0aW55O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBpbmxpbmVDc3MoaW5saW5lQ3NzKSB7XHJcbiAgICAgICAgdGhpcy5faW5saW5lQ3NzID0gaW5saW5lQ3NzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjb21wb25lbnRTdGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gY29tcG9uZW50U3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNvbXBvbmVudFN0YXRlKHN0YXRlKSB7Ly9zYXZlcyBzdGF0ZXMgb2YgY29tcG9uZW50IGZyb20gY2hpbGQgdG8gcGFyZW50XHJcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgdGhpcy5fc3RhdGUpO1xyXG4gICAgICAgIGNvbXBvbmVudFN0YXRlID0gT2JqZWN0LmFzc2lnbih0aGlzLl9zdGF0ZSwgY29tcG9uZW50U3RhdGUsIHN0YXRlKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlKGNvbXBvbmVudFN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgJGRlc3RpbnkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9kZXN0aW55KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAkKHRoaXMuX2Rlc3RpbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCAkZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuICQoYFtkYXRhLWNvbXBvbmVudC1pZD1cIiR7dGhpcy5wcm9wcy5pZH1cIl1gKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmUoKSB7ICAgICAgICBcclxuICAgICAgICBsZXQgaGFzQmVlblJlbW92ZWRGcm9tRGF0YSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fZGVzdGlueSkge1xyXG4gICAgICAgICAgICB0aGlzLl9kYXRhID0ge307XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7ICBcclxuICAgICAgICAgICAgaGFzQmVlblJlbW92ZWRGcm9tRGF0YSA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCd5b3UgaGF2ZSByZW1vdmVkIGEgY29tcG9uZW50OiBkb27CtHQgZm9yZ2V0IHRvIHJlbW92ZSB0aGUgZGF0YSBpbnRvIHRoZSBwYXJlbnQgb2YgdGhlIHJlbW92ZWQgY29tcG9uZW50IGNoaWxkLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnByb3BzLnJlbW92ZUNvbXBvbmVudCh0aGlzLl9kYXRhLCBoYXNCZWVuUmVtb3ZlZEZyb21EYXRhKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUNvbXBvbmVudCh0aGlzLl9kYXRhLCBoYXNCZWVuUmVtb3ZlZEZyb21EYXRhKTsgIFxyXG4gICAgfVxyXG5cclxuICAgIF9uYXRpdmVNZXRob2RzKCkgeyAgICAgICAgICAgICAgXHJcbiAgICAgICAgJCh0aGlzLiRlbCkub24oJ2NsaWNrJywgKGV2KSA9PiB0aGlzLnByb3BzLm1ldGhvZHMub25DbGljayhldiwgdGhpcy5fZGF0YSkpO1xyXG4gICAgICAgICQodGhpcy4kZWwpLm9uKCdtb3VzZW92ZXInLCAoZXYpID0+IHRoaXMucHJvcHMubWV0aG9kcy5vbk1vdXNlT3ZlcihldiwgdGhpcy5fZGF0YSkpO1xyXG4gICAgfVxyXG5cclxuICAgIF9hcHBseUlubGluZUNzcygpIHsgICAgICAgIFxyXG4gICAgICAgIGlmICghdGhpcy5faW5saW5lQ3NzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJGVsLmNzcyh0aGlzLl9pbmxpbmVDc3MpICAgIFxyXG4gICAgfVxyXG5cclxuICAgIF9kZWxlZ2F0ZUV2ZW50c0FmdGVyUmVuZGVyKCkge1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuJGVsLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9hcHBseUlubGluZUNzcygpO1xyXG4gICAgICAgIHRoaXMuX25hdGl2ZU1ldGhvZHMoKTsgICAgXHJcbiAgICAgICAgdGhpcy5ldmVudHMoKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuYWZ0ZXJSZW5kZXIodGhpcy5fZGF0YSk7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5hZnRlclJlbmRlcih0aGlzLl9kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBfY2hlY2tJZkRlc3RpbnlFeGlzdHMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuJGRlc3RpbnkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBkZXN0aW55ICR7dGhpcy5fZGVzdGlueX0gZm9yIGNvbXBvbmVudCAke3RoaXMucHJvcHMuaWR9IGRvZXNuwrR0IGV4aXN0IGluIGRvbS5gKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2NoZWNrSWZUZW1wbGF0ZUV4aXN0cygpIHtcclxuICAgICAgICBpZiAoIXRoaXMudGVtcGxhdGUgfHwgdGhpcy50ZW1wbGF0ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYHRoZSB0ZW1wbGF0ZSBoYXNuwrR0IGJlZW4gZGVmaW5lZC5gKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXZlbnRzKCkge31cclxuXHJcbiAgICByZW1vdmVDb21wb25lbnQoKSB7fVxyXG4gICAgXHJcbiAgICBiZWZvcmVSZW5kZXIoKSB7fVxyXG5cclxuICAgIGFmdGVyUmVuZGVyKCkge31cclxuXHJcbiAgICB1cGRhdGVEYXRhKCkge31cclxuXHJcbiAgICB1cGRhdGVTdGF0ZSgpIHt9XHJcbiAgXHJcbiAgICByZW5kZXIoKSB7ICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuX2NoZWNrSWZUZW1wbGF0ZUV4aXN0cygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLl9kZXN0aW55KSB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuX2NoZWNrSWZEZXN0aW55RXhpc3RzKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuJGVsLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGVzdGlueS5hcHBlbmQoYDxkaXYgZGF0YS1jb21wb25lbnQtaWQ9XCIke3RoaXMucHJvcHMuaWR9XCI+JHt0aGlzLnRlbXBsYXRlfTwvZGl2PmApOyAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5yZXBsYWNlV2l0aChgPGRpdiBkYXRhLWNvbXBvbmVudC1pZD1cIiR7dGhpcy5wcm9wcy5pZH1cIj4ke3RoaXMudGVtcGxhdGV9PC9kaXY+YCk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGVFdmVudHNBZnRlclJlbmRlcigpOyAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXNvbHZlQXBwZW5kQ29tcG9uZW50KCk7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBcclxuICAgICAgICBcclxuICAgICAgICBhd2FpdEZvclJlc29sdmVBcHBlbmRDb21wb25lbnQoKS50aGVuKHRoaXMuX2RlbGVnYXRlRXZlbnRzQWZ0ZXJSZW5kZXIuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBgPGRpdiBkYXRhLWNvbXBvbmVudC1pZD1cIiR7dGhpcy5wcm9wcy5pZH1cIj4ke3RoaXMudGVtcGxhdGV9PC9kaXY+YDsgXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5sZXQgcmVzb2x2ZUFwcGVuZENvbXBvbmVudCwgY29tcG9uZW50U3RhdGUgPSB7fTsgXHJcblxyXG5jb25zdCBwcm9taXNlQXBwZW5kQ29tcG9uZW50ID0gbmV3IFByb21pc2UoX3Jlc29sdmUgPT4ge1xyXG4gICAgcmVzb2x2ZUFwcGVuZENvbXBvbmVudCA9IF9yZXNvbHZlO1xyXG59KTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGF3YWl0Rm9yUmVzb2x2ZUFwcGVuZENvbXBvbmVudCAoKSB7XHJcbiAgICByZXR1cm4gcHJvbWlzZUFwcGVuZENvbXBvbmVudDtcclxufVxyXG4iLCLvu79pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudF9iYXNlLmpzJztcclxuXHJcbmRlc2NyaWJlKCdDb21wb25lbnRCYXNlIFNwZWMnLCAoKSA9PiB7ICAgXHJcbiAgICBsZXQgY29tcG9uZW50O1xyXG4gICAgdmFyIGRlc3RpbnlUZXN0O1xyXG5cclxuICAgIGJlZm9yZUVhY2goKCk9PntcclxuICAgICAgICBkZXN0aW55VGVzdCA9ICQoJzxkaXYgaWQ9XCJkZXN0aW55XCI+Jyk7XHJcbiAgICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQoZGVzdGlueVRlc3QpO1xyXG5cclxuXHJcbiAgICAgICAgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudCh7XHJcbiAgICAgICAgICAgIGRlc3Rpbnk6ICcjZGVzdGlueScsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICd0ZXh0JzogJ2JvdG9uIDEnLFxyXG4gICAgICAgICAgICAgICAgJ2hyZWYnOiAnIydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb21wb25lbnQudGVtcGxhdGUgPSAnPGRpdj48L2Rpdj4nO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3Byb3BzIHNpZW1wcmUgZXMgaW5tdXRhYmxlIGF1bnF1ZSBzZSBtb2RpZmlxdWUgZWwgZGF0YScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb21wb25lbnQuX2RhdGEgPSB7fVxyXG5cclxuICAgICAgICBleHBlY3QoY29tcG9uZW50LmRhdGEpLm5vdC50b0VxdWFsKGNvbXBvbmVudC5wcm9wcy5kYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgXHJcblxyXG4gICAgaXQoJ3JlYWN0aXZpZGFkOiBhbCBjYW1iaWFyIHVuYSBwcm9waWVkYWQgZGVsIGRhdGEgc2UgcmVuZGVyaXphIGRlIG51ZXZvIGVsIGNvbXBvbmVudGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc3B5T24oY29tcG9uZW50LCAncmVuZGVyJyk7XHJcbiAgICAgICAgY29tcG9uZW50LmRhdGEgPSB7fTtcclxuICAgICAgICBleHBlY3QoY29tcG9uZW50LnJlbmRlcikudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy9pdCgncHJvcGFnYWNpw7NuIGRlIGV2ZW50b3MgZGUgaGlqb3MgYSBwYWRyZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBcclxuICAgIC8vfSk7XHJcblxyXG4gICAgaXQoJ2NoYW5nZSBkYXRhIGV2ZW50OiB0cmFzIGNhbWJpYXIgdW5hIHByb3BpZWRhZCBkZWwgZGF0YSBzZSBsbGFtYSBhbCBtw6l0b2RvIFwidXBkYXRlRGF0YVwiJywgZnVuY3Rpb24gKCkgeyAgICAgICBcclxuICAgICAgICBzcHlPbihjb21wb25lbnQsICd1cGRhdGVEYXRhJyk7XHJcbiAgICAgICAgY29tcG9uZW50LmRhdGEgPSB7fTtcclxuICAgICAgICBleHBlY3QoY29tcG9uZW50LnVwZGF0ZURhdGEpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vaXQoJ2JlZm9yZSByZW5kZXI6IGFsIGluc3RhbmNpYXIgdW4gY29tcG9uZW50ZSBzaW4gdGVuZXIgcXVlIGhhYmVyc2UgcmVuZGVyaXphZG8gYcO6biBzZSBpbnZvY2EgYWwgZXZlbnRvIFwiYmVmb3JlUmVuZGVyXCInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyAgICBzcHlPbihjb21wb25lbnQsICdiZWZvcmVSZW5kZXInKTtcclxuICAgIC8vICAgIGV4cGVjdChjb21wb25lbnQuYmVmb3JlUmVuZGVyKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICAvL30pO1xyXG5cclxuICAgIGl0KCdhZnRlciByZW5kZXI6IHRyYXMgcmVuZGVyaXphciB1biBjb21wb25lbnRlIGVuIGVsIGRvbSBzZSBsbGFtYSBhbCBtw6l0b2RvIFwiYWZ0ZXJSZW5kZXJcIicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzcHlPbihjb21wb25lbnQsICdhZnRlclJlbmRlcicpO1xyXG4gICAgICAgIGNvbXBvbmVudC5yZW5kZXIoKTtcclxuICAgICAgICBleHBlY3QoY29tcG9uZW50LmFmdGVyUmVuZGVyKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmVtb3ZlIGNvbXBvbmVudDogdHJhcyBib3JyYXIgdW4gY29tcG9uZW50ZSBlbiBlbCBkb20gc2UgbGxhbWEgYWwgbcOpdG9kbyBcInJlbW92ZUNvbXBvbmVudFwiJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNweU9uKGNvbXBvbmVudCwgJ3JlbW92ZUNvbXBvbmVudCcpO1xyXG4gICAgICAgIGNvbXBvbmVudC5yZW1vdmUoKTtcclxuICAgICAgICBleHBlY3QoY29tcG9uZW50LnJlbW92ZUNvbXBvbmVudCkudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JlbW92ZSBjb21wb25lbnQ6IHRyYXMgYm9ycmFyIHVuIGNvbXBvbmVudGUgc2kgZXhpc3RlIFwiZGVzdGlueVwiIHNlIGxsYW1hIGFsIG3DqXRvZG8gXCJyZW5kZXJcIiBwYXJhIGFjdHVhbGl6YXIgZWwgY29tcG9uZW50ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzcHlPbihjb21wb25lbnQsICdyZW5kZXInKTtcclxuICAgICAgICBjb21wb25lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgZXhwZWN0KGNvbXBvbmVudC5yZW5kZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCduYXRpdmUgbWV0aG9kczogdHJhcyByZW5kZXJpemFyIHVuIGNvbXBvbmVudGUgc2UgZGVsZWdhbiBsb3MgbcOpdG9kb3MgbmF0aXZvcyBkZSDDqXN0ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzcHlPbihjb21wb25lbnQsICdfbmF0aXZlTWV0aG9kcycpO1xyXG4gICAgICAgIGNvbXBvbmVudC5yZW5kZXIoKTtcclxuICAgICAgICBleHBlY3QoY29tcG9uZW50Ll9uYXRpdmVNZXRob2RzKS50b0hhdmVCZWVuQ2FsbGVkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnY29tcG9uZW50ZSBlcyBpbnNlcnRhZG8gZXMgaW5zZXJ0YWRvIGVuIGVsIGRvbSB0cmFzIGxhbnphcnNlIHJlbmRlcigpJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbXBvbmVudC5yZW5kZXIoKTtcclxuICAgICAgICBleHBlY3QoJChgW2RhdGEtY29tcG9uZW50LWlkPVwiJHtjb21wb25lbnQucHJvcHMuaWR9XCJdYCkubGVuZ3RoID4gMCkudG9CZSh0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdpbmxpbmUtc3R5bGUgZXMgaW5zZXJ0YWRvIGRlYmUgY3JlYXJzZSBhdHJpYnV0byBzdHlsZSBlbiBlbCBkaXYgZGVsIGNvbXBvbmVudGUgY29uIGxhcyBwcm9waWVkYWRlcyBjc3MgJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbXBvbmVudC5pbmxpbmVDc3MgPSB7J2NvbG9yJzogJ3JlZCd9O1xyXG4gICAgICAgIGNvbXBvbmVudC5yZW5kZXIoKTtcclxuICAgICAgICBleHBlY3QoJChgW2RhdGEtY29tcG9uZW50LWlkPVwiJHtjb21wb25lbnQucHJvcHMuaWR9XCJdYCkuYXR0cignc3R5bGUnKSAhPSAndW5kZWZpbmVkJyAmJiAkKGBbZGF0YS1jb21wb25lbnQtaWQ9XCIke2NvbXBvbmVudC5wcm9wcy5pZH1cIl1gKS5hdHRyKCdzdHlsZScpICE9ICcnKS50b0JlKHRydWUpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXX0=
