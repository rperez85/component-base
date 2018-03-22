import html from '../../../utils/es6-template';
import makeObservable from '../../../utils/makeObservable';
import * as array from '../../../utils/array';
import { Component } from '../../../public_components/component-base/component-base.js';
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

            this.modelDataBinding = {
                'text': 'nuevo item!'
            };

            setTimeout(() => {
                this.modelDataBinding = {
                    'text': ''
                };
            }, 2000);
           
            this.trigger('newButtonAdded', newButton);
        });


        $(this.$el).find(`#${IDS.buttonText}`).on('keyup', (e) => {
            this.modelDataBinding = {
                'text': $(e.currentTarget).val().length ? 'escribiendo...' : ''
            };
        });
    }

    removeComponent () {//native component method
        //console.log('menu removed');
    }

    beforeRender() {//native component method
        

    }

    afterRender() {//native component method
        console.log('menu just rendered');

    }

    updateData() {//native component method        
        this.componentState = {           
            'estadoMenuButtonsUpdated': this.data.buttons,
        };
    }


    get template() {        
        return html`<div>
            <h1>${this.data.completeName}</h1>
            <input type="text" id=${IDS.buttonText} />
            <input type="button" id=${IDS.addButton} data-value="añade nuevo item" />
            <div id="menu">
                <ul>
                    ${ this.data.buttons ? this.data.buttons.map((button, i) => html`
                        <li>
                            $${new ButtonMenu({
                                id: 'btn' + i,
                                data: {
                                    'text': button.text,
                                    'href':  button.href,
                                    'subItems': button.subItems ? button.subItems : ''
                                },
                                removeComponent: (data) => {    
                                console.log(this.data.buttons, data);                                                                 
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
            </div>
        </div>`;
    }
}
