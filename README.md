# Component-base

[TOCM]

Ejemplo de uso de un componente base del que extienden las clases de es6 y cuya finalidad es aportar al desarrollador los recursos y características principales que poseen los frameworks modernos basados en componentes para desarollar aplicaciones complejas de una forma más sencilla.



##### Instalación del ejemplo:
```javascript
 > git clone https://github.com/rperez85/component-base.git
 > npm install
 > npm run start:dev
```

### Caracteristicas principales
- Inmutabilidad de propiedades
- Reactividad
- Ciclo de vida de los componentes
- Manejo de estados
- Propagación de eventos desde el hijo




------------





### Uso básico

```javascript
//index.js:
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
			<p>${message}</p>`;
	}
}
```


------------



### Reactividad
Al cambiar o añadir alguna propiedad nueva al data, el componente se renderiza automáticamente:
```javascript
//...
app.addData({
	message: 'Hola de nuevo!'
});
```

Por defecto la función reactiva está activada, pero si se quisiera desactivar (para uso asíncrono, peticiones ajax...), sólo habría que setear el último parámetro a *false*:
```javascript
//...
app.addData({
    message: 'Hola de nuevo!'
}, false);
```


------------


### Uso de lógica en el template
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
**Por otro lado, si se desea también es posible importar cualquier framework de templates tipo handlebars, t.js, ...

------------


### Métodos nativos de los componentes
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

------------


### Ciclo de vida de los componentes
A través del ciclo de vida de los componentes puedes manejar su comportamiento en un momento preciso. Este ciclo de vida se puede manejar tanto desde la instancia del componente (llamado a traves del props), como dentro de la propia clase de dicho componente:

```javascript
//index.js:
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
      <p>${message}</p>`;
  }
}
```

------------


### Composicion de componentes anidados
El motivo principal del uso de un sistema del componentes es desarrollar aplicaciones complejas donde se pueda llamar fácilmente a un componente dentro de otro a traves del render y que sus propios eventos se transmitan desde el hijo hasta el padre para poder ser manejados en la vista:

**En el siguiente ejemplo vamos a construir una tabla dinámica donde al hacer click en cada una de las columnas nos devuelva el texto que contiene:

```javascript
//index.js
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
				 
table.on('ColumnTableClicked', (data) => {
	console.log(`the column says: ${data}`); 
});
 
table.render();
```

```javascript
//table.js
export class Table extends Component {
	constructor(props) {
		super(props);

		makeObservable(this, [
			'ColumnTableClicked'
		]); 
	}
	
	get template() {        
		return html`
			<div class="table">
				${ this.data.list.map(row => html`
					new Row({
						data: {
							'row': row
						}
					}).on('columnClicked', (data) => {
						this.trigger('ColumnTableClicked', data);
					}).render()`
				 )} 
			</div>`;
	}
}
```

```javascript
//row.js
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
				${ this.data.row.map(column => html`
					new Column({
						data: {
							'column': column
						},
						 methods: {
							 'onClick': (e, data) => {
								this.trigger('columnClicked', data);
							}
                    	}
					}).render()`
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
			<li>${this.data.column}</li>`;
	}
}
```

------------


### Registro de estados de los componentes
Es posible registrar uno o varios estados de los componente y que además puedan mutar de hijo a padre manteniéndose visibles desde cualquier lugar de la aplicación. Además, desde la vista se dispara el evento 'updateState' cada vez que algún componente cambia de estado. 

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

------------


### Estilos independientes por componente
A través de la propiedad 'inlineCss' podemos customizar el estilo del componente en cuestión añadiendole clases css a través de estilos en línea.

```javascript
//component.js
//...
this.inlineCss = {
	'background-color': '#F5F5F5',
	'padding': '20px'
};
//...
```



------------






