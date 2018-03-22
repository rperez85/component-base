import html from '../../../utils/es6-template';
import { Component } from '../../../public_components/component-base/component-base.js';

const NAME = 'DropdownMenu';
const VERSION = '1.0.0';

export class DropdownMenu extends Component {
    constructor(props) {
        super(props);           

    }

    events () {//native component method       
    }

    removeComponent () {//native component method  
    }

    beforeRender() {//native component method
    }

    afterRender() {//native component method
        console.log('DropdownMenu just rendered');
    }

    updateData() {//native component method  
    }

    get template() {
         
        return html`
            <ul class="subitems" style="display: none">
                ${ this.data.subItems.map(subItem => html`
                    <a href="${subItem.href}">$${subItem.text}</a>`
                )}        
            </ul>`;
    }
}


