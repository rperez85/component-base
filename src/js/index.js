import "babel-polyfill";
import { Menu } from './menu/menu.js';


$(() => {
    //async function foo () {
    //    const result = await fetch("https://api/", { method: "GET" }); 
    //    return result;
    //}

    //bar().then()...;

    const menu = new Menu({
        id: 'menu',
        destiny: '#root',
        data: {
            'name': 'items',
            'buttons': [{
                'text': 'item 1',
                'href': '#',
                'subItems':  [{
                    'text': 'subitem 1',
                    'href': '#'
                },
                {
                    'text': 'subitem 2',
                    'href': '#'
                },
                {
                    'text': 'subitem 3',
                    'href': '#'
                }]
            },
            {
                'text': 'item 2',
                'href': '#',
                'subItems': []
            },
            {
                'text': 'item 3',
                'href': '#',
                'subItems':  [{
                    'text': 'subitem 1',
                    'href': '#'
                }]
            }]
        },
        beforeRender: () => {
            console.log('component before rendered');
        },
        afterRender: (data) => {         
        },
        updateData: (data) => {
            console.log(`data has been updated!: ${JSON.stringify(data)}`);      
        },
        updateState: (state) => {
            console.log(`state has been updated!: ${JSON.stringify(state)}`);
        },
        removeComponent: (data) => {            
        },        
        methods: {
            'onClick': (e, data) => {
                console.log(data);//click all component content
            }
        }        
    });
     
    menu.on('newButtonAdded', (btn) => {
        console.log('nuevo botón añadido: ' + btn); 
    });
    
    menu.render();

    setTimeout(() => {
        menu.addData({
            'buttons': [{
                'text': 'boton 1',
                'href': '#',
                'subItems':  []
            },
            {
                'text': 'boton 3',
                'href': '#',
                'subItems':  [{
                    'text': 'subboton 1',
                    'href': '#'
                }]
            }]
        });
        //menu.remove();
    }, 2000);
});