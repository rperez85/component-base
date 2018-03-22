import html from '../../../utils/es6-template';
import makeObservable from '../../../utils/makeObservable';
import { Component } from '../../../public_components/component-base/component-base.js';
import { DropdownMenu } from '../dropdownMenu/dropdownMenu.js';

const NAME = 'ButtonMenu';
const VERSION = '1.0.0';

const CLASSES = {
    item: 'item',
    subitems: 'subitems',
    removeButton: 'removeButton',
    updateButton: 'updateButton',
    updateText: 'updateText',
    seeMore: 'see-more'
};

export class ButtonMenu extends Component {
    constructor(props) {
        super(props);

        this.componentState = {
            'estadoNewButtons': this.data.text,
        };

        makeObservable(this, [           
           'updatedDataButton'
        ]); 
    }

    events () {//native component method
        $(this.$el).find(`.${CLASSES.seeMore}`).on('click', (e) => {           
            if ($(this.$el).find(`.${CLASSES.subitems}`).is(':visible')) {
                $(this.$el).find(`.${CLASSES.subitems}`).hide();
            } else {
                $(this.$el).find(`.${CLASSES.subitems}`).show();
            }

            e.preventDefault();
        });

        $(this.$el).find(`.${CLASSES.removeButton}`).on('click', (e) => {     
            
            this.modelDataBinding = {
                'text': `item ${this.data.text} borrado`
            };

           
            setTimeout(() => {
                this.modelDataBinding = {
                    'text': ''
                };
            }, 2000);

            this.remove();
        });

        $(this.$el).find(`.${CLASSES.updateButton}`).on('click', (e) => { 
            this.modelDataBinding = {
                'text': $(this.$el).find(`.${CLASSES.updateText}`).val().length ? `item ${this.data.text} modificado` : ''
            };
            setTimeout(() => {
                this.modelDataBinding = {
                    'text': ''
                };
            }, 2000);

            this.trigger('updatedDataButton',  this.data, $(this.$el).find(`.${CLASSES.updateText}`).val());
        });
    }

    removeComponent () {//native component method
        //console.log('graph removed');
    }

    beforeRender() {//native component method
        //console.log('graph before rendered')
    }

    afterRender() {//native component method
    }

    updateData() {//native component method  
    }

    updateState(state) {      
    }

    get template() {
        const dropdownMenu = () => {
            if (this.data.subItems.length) {
                return new DropdownMenu({
                    data: {
                        'subItems': this.data.subItems
                    },
                    methods: {
                        'onClick': () => console.log('dropdownMenu clicked')
                    }
                }).render();
            } else {
                return '';
            }
        };

        return html`        
            <p class="${CLASSES.item}">${this.data.text} ${this.data.subItems.length ? `<a class="${CLASSES.seeMore}">(+)</a>` : ''}</p>
            <input type="button" class="${CLASSES.removeButton}" data-value="borrar" />
            <input type="button" class="${CLASSES.updateButton}" data-value="modificar" />
            <input type="text" placeholder="texto item a modificar" class="${CLASSES.updateText}" />              
            $${dropdownMenu()}
        `;
    }
}
