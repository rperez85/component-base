# Component-base


Ejemplo de uso de un componente base del que extienden las clases de es6 y cuya finalidad es aportar al desarrollador los recursos y características principales que poseen los frameworks modernos basados en componentes para desarollo de aplicaciones complejas.



##### Instalación del ejemplo:
```javascript
 > git clone https://github.com/rperez85/component-base.git
 > npm install
 > npm run start:dev
```

## Caracteristicas principales
- Inmutabilidad de propiedades
- Reactividad
- Ciclo de vida de los componentes
- Manejo de estados
- Propagación de eventos desde el hijo









## Uso básico

```javascript
//index.js:

import { App } from './app.js';

const app = new App({
    id: 'app-example', //no es obligatorio, si no lo pones se crea un data-id dinámico
    destiny: '#root',
    data: {
        message: 'Hola Mundo!'
    }, 
});
app.render();
```

```javascript
//app.js:

export class App extends Component {
    constructor(props) {
      super(props);
}
	
get template() { 
    return html`
      <p>${this.data.message}</p>`;
    }
}
```






## Reactividad
Al cambiar o añadir alguna propiedad nueva al data, el componente se renderiza automáticamente:
```javascript
//...
app.addData({
    message: 'Hola de nuevo!'
});
//...
```

#### Borrado de data: 
Cuando se trata de un array de objetos, en ciertas ocasiones para borrar el data de un componente debemos acceder al padre y eliminarlo desde ahí volviendo a lanzar el método 'addData' y pasándole la función 'removeFromArray'. Esto es así porque los datos del componente a borrar son servidor desde el padre y el data de éste necesita actualizarse. 

```javascript
//...
app.addData({
    'listaDeDatos': array.removeFromArray(this.data.listaDeDatos, datoABorrar)
});
//...
```

**Si los datos que alimentan ese componente son servidos desde éste, simplemente lanzaríamos el método 'remove()'.


#### Modificación de data: 
Cuando se trata de un array de objetos se sigue la misma lógica que en el borrado del data, pero pasándole la función 'updateFromArray' con tres parámetros: 

```javascript
//...
app.addData({
    'listaDeDatos': array.updateFromArray(this.data.listaDeDatos, datoAModificar, datoModificado)
});
//...
```



## Uso de lógica en el template
Gracias a la función 'html' y al uso de los 'Template Strings' de es6, podemos añadir lógica a los templates: bucles, condicionales...

```javascript
get template() {
    return html`
        <ul class="item-list">
            ${ this.data.items.map(item => html`
                <a href="${item.href}">$${item.text}</a>`
            )}        
        </ul>`;
}
```
**Por otro lado, si se desea, también es posible importar cualquier framework de templates tipo handlebars, t.js, ...




## Métodos nativos de los componentes
Por el momento sólo existen estos tres: onClick, onMouseOver y onKeyPress. Aunque en un futuro se podrán añadir los que sean necesarios.
```javascript
//index.js:

const app = new App({
    id: 'app-example',
    destiny: '#root',
    data: {
        message: 'Hola Mundo!'
    }, 
    methods: {
        'onClick': (e, data) => {
            console.log(`component clicked: ${data}`);
        },
        'onMouseOver': (e, data) => {
            console.log(`mouse over component: ${data}`);
        },
        'onKeyPress': (e, data) => {
            console.log(`key ${e.which} pressed on component`);
        }
    }
});
app.render();
```
**El component-base también admite métodos observables:




## Ciclo de vida de los componentes
A través del ciclo de vida de los componentes puedes manejar su comportamiento en un momento preciso. Este ciclo de vida se puede manejar tanto desde la instancia del componente (llamado a través del props), como dentro de la propia clase de dicho componente:

```javascript
//index.js:

import { App } from './app.js';

const app = new App({
    id: 'app-example',
    destiny: '#root',
    data: {
        message: 'Hola Mundo!'
    }, 
    beforeRender: () => {
        //el componente aún no ha sido renderizado
    },
    afterRender: (data) => {         
        //el componente ya ha sido renderizado
    },
    updateData: (data) => {
        //se ha modificado el objeto data y se nos notifica 
    },
    updateState: (state) => {
        //se ha modificado el estado de alguno de los componentes 
    },
    removeComponent: (data) => {            
        //el componente ha sido borrado
    }
});

app.render();
```
```javascript
//app.js:

export class App extends Component {
    constructor(props) {
        super(props);
}

beforeRender() {
}

afterRender() {
}

updateData() {		
}

removeComponent(){	
}

get template() { 
    return html`
        <p>${this.data.message}</p>`;
    }
}
```




## Composicion de componentes anidados
El motivo principal del uso de un sistema del componentes es el desarrollo de aplicaciones complejas donde se puedan renderizar componentes dentro de otros componentes y que, de igual modo, sus propios eventos se transmitan desde los hijos para poder ser manejados desde la vista si se requiriese:

**En el siguiente ejemplo vamos a construir una tabla dinámica donde al hacer click en cada una de las columnas nos devuelva el texto que contiene:

```javascript
//index.js

import { Table } from './table.js';

const table = new Table({
    id: 'component-table',
    destiny: '#root',
    data: {
        'list': [{
            name: 'eric',
            surname: 'clapton',
            style: 'blues/rock'
        },
        {
            name: 'buddy',
            surname: 'guy',
            style: 'blues'
        },
        {
            name: 'bob',
            surname: 'dylan',
            style: 'folk'
        }]
    }
});

table.on('columnTableClicked', (data) => {
    console.log(`the column says: ${data}`); 
});

table.render();
```

```javascript
//table.js

import { Row } from './row.js';

export class Table extends Component {
    constructor(props) {
        super(props);

        makeObservable(this, [
            'columnTableClicked'
        ]); 
    }

    get template() {        
        return html`
            <div class="table">
                ${ this.data.list.map(row => html`
                    $${new Row({
                        data: {
                           'row': row
                        }
                    }).on('columnClicked', (data) => {
                        this.trigger('columnTableClicked', data);
                    }).render()}`
                )} 
            </div>`;
        }
}
```

```javascript
//row.js

import { Column } from './column.js';

export class Row extends Component {
    constructor(props) {
        super(props);

            makeObservable(this, [
                'columnClicked'
            ]); 
    }

    get template() {        
        return html`
            <ul>
                ${ Object.values(data.row).map(column => html`
                    $${new Column({
                        data: {
                            'column': column
                        },
                        methods: {
                            'onClick': (e, data) => {
                                this.trigger('columnClicked', data);
                             }
                        }
                    }).render()}`
                )} 
            </ul>`;
    }
}
```

```javascript
//column.js

export class Column extends Component {
    constructor(props) {
        super(props);
    }

    get template() {        
        return html`
	    <li>${data.column}</li>`;     
    }
}
```




## Registro de estados de los componentes
Es posible registrar uno o varios estados de los componentes y que además éstos puedan mutar de hijos a padres manteniéndose visibles desde cualquier lugar de la aplicación. Además, desde la vista se dispara el evento 'updateState' cada vez que algún componente cambia de estado. 

```javascript
//component.js

//...
this.componentState = {
    'initialState':  'estado ...'            
};
//...
```

```javascript
//index.js

//...
updateState: (state) => {
    console.log(`state has been updated!: ${JSON.stringify(state)}`);
}
//...
```




## Estilos independientes por componente
A través de la propiedad 'inlineCss' es posible customizar el estilo del componente añadiendole clases css a través de estilos en línea.

```javascript
//component.js

//...
this.inlineCss = {
    'background-color': '#F5F5F5',
    'padding': '20px'
};
//...
```




## Binding de datos de un componente desde cualquier parte de la aplicación
Desde un componente se pueden guardar datos en un store y despacharlos desde cualquier otro componente de la misma aplicación que esté escuchando.

```javascript
//component.js

//...
this.modelDataBinding = {'total': 10};
//...
```

```javascript
//index.js:

const app = new App({    
    data: {
        message: 'Hola Mundo!'
    }, 
    emittedModelDataBinding: (data) => {
        console.log(data.total); //10
    }
});
app.render();
```










