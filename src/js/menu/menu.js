import html from '../../../utils/es6-template';
import makeObservable from '../../../utils/makeObservable';
import * as array from '../../../utils/array';
import { Component } from '../../../public_components/component_base/component_base.js';
import { ButtonMenu } from '../buttonMenu/buttonMenu.js';

const NAME = 'Menu';
const VERSION = '1.0.0';

const IDS = {
    addButton: 'add-button',
    buttonText: 'button-text'
};

export class Menu extends Component {
    constructor(props) {
        super(props);

        this.inlineCss = {
            'background-color': '#F5F5F5',
            'padding': '20px'           
        };

        this.componentState = {
            'estadoMenuButtonsInitial': this.data.buttons,            
        };

        makeObservable(this, [           
           'newButtonAdded'
        ]); 
    }

    events () {//native component method
        $(this.$el).find(`#${IDS.addButton}`).on('click', () => {
            const buttonText = $(this.$el).find(`#${IDS.buttonText}`).val();

            if (!buttonText) {
                return;
            }

            let newButton = {
                'text': buttonText,
                'href': '#',
                'subItems':  [{
                    'text': 'subitem 1',
                    'href': '#'
                },
                {
                    'text': 'subboton 2',
                    'href': '#'
                }]
            };

            let arrButtons = [...this.data.buttons || {}, newButton];

            this.addData({
                'buttons': arrButtons
            });
           
            this.trigger('newButtonAdded', newButton);
        });
    }

    removeComponent () {//native component method
        //console.log('menu removed');
    }

    beforeRender() {//native component method
        this.addData({
            'completeName': `Ejemplo de componente ${this.data.name}` 
        }, false);

    }

    afterRender() {//native component method
        //console.log('menu just rendered');
    }

    updateData() {//native component method        
        this.componentState = {           
            'estadoMenuButtonsUpdated': this.data.buttons,
        };
    }


    get template() {        
        return html`
            <h1>${this.data.completeName}</h1>
            <input type="text" id=${IDS.buttonText} />
            <input type="button" id=${IDS.addButton} value="añade nuevo item" />
            <div id="menu">
                <ul>
                    ${ this.data.buttons ? this.data.buttons.map(button => html`
                        <li>
                            $${new ButtonMenu({
                                data: {
                                    'text': button.text,
                                    'href':  button.href,
                                    'subItems': button.subItems ? button.subItems : ''
                                },
                                removeComponent: (data) => {                                    
                                    //when the element is deleted, the data must be updated:                                   
                                    this.addData({
                                        'buttons': array.removeFromArray(this.data.buttons, data)
                                    });                                                                             
                                }
                            }).on('updatedDataButton', (buttonMenuData, text) => {
                                if (text) {                                 
                                    this.addData({
                                        'buttons': array.updateFromArray(this.data.buttons, buttonMenuData, {
                                            'text': text,
                                            'href': '#',
                                            'subItems':  []
                                        })
                                    });  
                                }                                
                            }).render()}
                        </li>`
                     ) : ''}                    
                </ul>
            </div>`;
    }
}
