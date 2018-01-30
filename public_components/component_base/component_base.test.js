import { Component } from './component-base.js';

describe('ComponentBase Spec', () => {   
    let component;
    var destinyTest;

    beforeEach(()=>{
        destinyTest = $('<div id="destiny">');
        $(document.body).append(destinyTest);


        component = new Component({
            destiny: '#destiny',
            data: {
                'text': 'boton 1',
                'href': '#'
            }
        });

        component.template = '<div></div>';
    });

    it('props siempre es inmutable aunque se modifique el data', function () {
        component._data = {}

        expect(component.data).not.toEqual(component.props.data);
    });

   
    it('reactividad: al cambiar una propiedad del data se re-delegan los eventos', function () {
        spyOn(component, '_delegateEventsAfterRender');
        component.addData({});
        expect(component._delegateEventsAfterRender).toHaveBeenCalled();
    });


    it('change data event: tras cambiar una propiedad del data se llama al método "updateData"', function () {       
        spyOn(component, 'updateData');
        component.addData({});
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

    it('remove component: tras borrar un componente se resetea el data', function () {        
        component.remove();
        expect($.isEmptyObject(component._data)).toBe(true);
    });

    it('native methods: tras renderizar un componente se delegan los métodos nativos de éste', function () {
        spyOn(component, '_nativeMethods');
        component.render();
        expect(component._nativeMethods).toHaveBeenCalled();
    });

    it('componente es insertado es insertado en el dom tras lanzarse render()', function () {
        component.render();
        expect($(`[data-component-id="${component.props.id}"]`).length > 0).toBe(true);
    });

    it('inline-style es insertado debe crearse atributo style en el div del componente con las propiedades css ', function () {
        component.inlineCss = {'color': 'red'};
        component.render();
        expect($(`[data-component-id="${component.props.id}"]`).attr('style') != 'undefined' && $(`[data-component-id="${component.props.id}"]`).attr('style') != '').toBe(true);
    });

    it('componentState: tras cambiar el estado del componente se llama al método "updateState"', function () {       
        spyOn(component, 'updateState');
        component.componentState = {}
        expect(component.updateData).toHaveBeenCalled();
    });
});
