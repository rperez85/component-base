import * as vdom from './virtual-dom.js';

/**
 * This is Component.
 */
export class Component {
    /**
     * creates a instance of Component.
     * @constructor
     * @param {props} object - object props.
     */
    constructor(props) {
        this.props = Object.freeze({
            destiny: props.destiny,
            data: props.data,
            id: props.id || generateUniqueId(),
            containerClass: props.containerClass || '',
            updateData: props.updateData || function () { },
            updateState: props.updateState || function () { },
            emittedModelDataBinding: props.emittedModelDataBinding || function () { },
            beforeRender: props.beforeRender || function () { },
            afterRender: props.afterRender || function () { },
            removeComponent: props.removeComponent || function () { },
            inlineCss: props.inlineCss || {},
            methods: {
                onClick: props.methods && props.methods.onClick ? props.methods.onClick : function () { },
                onMouseOver: props.methods && props.methods.onMouseOver ? props.methods.onMouseOver : function () { },
                onKeyPress: props.methods && props.methods.onKeyPress ? props.methods.onKeyPress : function () { }
            }
        });

        this._data = Object.assign({}, this.props.data, {});
        this._state = {};
        this._modelDataBinding = {};
        this._destiny = this.props.destiny;
        this._inlineCss = this.props.inlineCss;
        this._addComponentEmittedModelDataBinding(this.props.emittedModelDataBinding, componentsWithModelDataBinding);

        this.props.beforeRender(this);
        this.beforeRender(this);
    }

    /**
    * @returns {object} data
    */
    get data() {
        return this._data;
    }

    /**
    * @param {object} data - this extends of main data and re-render component
    */
    addData(data, allowBubblingEvents = true) {
        this._data = Object.assign({}, this._data, data);
        vdom.updateElement(this.$parentEl, vdom.convertToVdom(this.template), vdom.convertToVdom(this.$parentEl.innerHTML));
        
        if (allowBubblingEvents) {
            this._delegateEventsAfterRender();
        }
        this.updateData(this._data, this);
        this.props.updateData(this._data, this);
    }

    /**
    * @returns {string} destiny
    */
    get destiny() {
        return this._destiny;
    }

    /**
     *  @param {string} destiny
     */
    set destiny(destiny) {
        this._destiny = destiny;
    }

    /**
     *  @param {object} inlineCss
     */
    set inlineCss(inlineCss) {
        this._inlineCss = inlineCss;
    }

    /**
    * @returns {object} componentState
    */
    get componentState() {
        return componentState;
    }

    /**
     * @param {object} state - this extends of main state and trigger it
     */
    set componentState(state) {//saves states of component from child to parent
        this._state = Object.assign({}, state, this._state);
        componentState = Object.assign(this._state, componentState, state);
        this.updateState(componentState, this);
        this.props.updateState(componentState, this);
    }


    get modelDataBinding() {
        return this._modelDataBinding;
    }

    set modelDataBinding(data) {
        this._modelDataBinding = Object.assign({}, this._modelDataBinding, data);

        for (const component of componentsWithModelDataBinding) {
            component.props.emittedModelDataBinding(this._modelDataBinding, component, this);
            component.emittedModelDataBinding(this._modelDataBinding, component, this);
        }
    }

    /**
     * @returns {string} destiny
     */
    get $destiny() {
        if (!this._destiny) {
            return;
        }

        return document.querySelector(this._destiny);
    }

    /**
     * @returns {object} $el - collection elements
     */
    get $el() {        
        return document.querySelectorAll(`[data-component-id="${this.props.id}"]`);
    }

     /**
     * @returns {object} $el - parent element
     */
    get $parentEl() {
        return document.querySelector('[data-component-id="' + this.props.id + '"]');
    }

    /**
    * @emits {remove} Emit a remove event
    */
    remove() {
        const removedData = this._data;        
        this._data = {};
        
        for (var $els of this.$el) {
            $els.remove();
        }

        this.props.removeComponent(removedData, this._data, this);
        this.removeComponent(removedData, this._data, this);
    }

    _addComponentEmittedModelDataBinding(component, arrDataBindingComponents) {
        if (component.name === 'emittedModelDataBinding') {
            arrDataBindingComponents.push(this);
        }
    }

    _nativeMethods() {        
        [].forEach.call(this.$el, ($el) => {
            $el.addEventListener('click', (ev) => this.props.methods.onClick(ev, this._data));
            $el.addEventListener('mouseover', (ev) => this.props.methods.onMouseOver(ev, this._data));
            $el.addEventListener('keypress', (ev) => this.props.methods.onKeyPress(ev, this._data));
        });
    }

    _applyInlineCss() {
        if (!this._inlineCss) {
            return;
        }

        for (let style in this._inlineCss) {
            this.$el.style[style] = this._inlineCss[style];
        }
    }

    _delegateEventsAfterRender() {
        if (!this.$el.length) {
            return;
        }

        this._applyInlineCss();
        this._nativeMethods();
        this.events();
        this.afterRender(this._data, this);
        this.props.afterRender(this._data, this);
    }

    _checkIfDestinyExistsInDom() {
        if (this.$destiny.length === 0) {
            throw Error(`destiny ${this._destiny} for component ${this.props.id} doesn´t exist in dom.`);
        }
    }

    _checkIfTemplateExists() {
        if (!this.template || this.template === '') {
            throw Error(`the template hasn´t been defined.`);
        }
    }

    events() { }

    removeComponent() { }

    beforeRender() { }

    afterRender() { }

    updateData() { }

    updateState() { }

    emittedModelDataBinding() { }

    render() {
        this._checkIfTemplateExists();

        if (this._destiny) {
            this._checkIfDestinyExistsInDom();

            this.$destiny.innerHTML = `<div data-component-id="${this.props.id}" ${this.props.containerClass ? `class="${this.props.containerClass}"` : ''}></div>`;
            vdom.updateElement(this.$parentEl, vdom.convertToVdom(`${this.template}`));

            this._delegateEventsAfterRender();
            resolveAppendComponent();

            return;
        }

        awaitForResolveAppendComponent().then(this._delegateEventsAfterRender.bind(this));

        return `<div data-component-id="${this.props.id}" ${this.props.containerClass ? `class="${this.props.containerClass}"` : ''}>${this.template}</div>`;
    }
}

let resolveAppendComponent, componentState = {}, componentsWithModelDataBinding = [], generateUniqueId = () => `cmp_${Math.random().toString(36).slice(2)}gid`;

const promiseAppendComponent = new Promise(_resolve => {
    resolveAppendComponent = _resolve;
});

async function awaitForResolveAppendComponent() {
    return promiseAppendComponent;
}
