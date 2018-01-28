const Handlebars = require('handlebars');

export class Template {

    constructor(template) {        
        this._template = template;        
    }

    set template(template) {       
        this._template = template;
    }

    get template() {
        return this._template;
    }

    get handlebars() {
        return Handlebars;
    }
    
    registerHelper(name, helper) {
        if (!name || typeof name !== 'string') {
            throw new TypeError('name is not correctly defined.');
        }

        if (!helper || typeof helper !== 'function') {
            throw new TypeError('helper is not correctly defined.');
        }

        return Handlebars.registerHelper(name, helper);
    }

    render(data) {        
        const template = $(this._template).html();
        const compiledTemplate = Handlebars.compile(template);

        return compiledTemplate(data);
    }

} 