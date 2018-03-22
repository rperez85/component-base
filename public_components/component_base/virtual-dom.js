var tovdom = require('to-virtual-dom');

function parseVdom(vDom) {    
    var vDomObj = {};

    const parseProps = (props) => {        
        var formattedProps = {};

        for (let i in props) {            
            if (i === 'className') {                            
                formattedProps.class = props[i];
            } else if (i === 'dataset') {                
                for (let j in props[i]) {  
                    if (j === 'value') {
                        formattedProps['value'] =  props[i][j];
                    } else {
                        formattedProps['data-' + j] =  props[i][j];    
                    }    
                }
            } else if (i === 'style') {   
                let styleString = [];

                for (let j in props[i]) {
                    styleString.push(j + ':' + props[i][j]);
                }

                formattedProps.style =  styleString.join('; ');
            } else {
                formattedProps[i] = props[i];            
            }
        }

        return formattedProps;
    };

    if (vDom.tagName) {
        vDomObj.type = vDom.tagName.toLowerCase();
    }

    if (vDom.properties) {
        vDomObj.props = !$.isEmptyObject(vDom.properties) ? parseProps(vDom.properties) : null;
    }

    if (vDom.children && vDom.children.length) {        
        vDomObj.children = [];

        for (const value of vDom.children) {
            vDomObj.children.push(parseVdom(value));
        }
    }

    if (vDom.text) {
        vDomObj = vDom.text;
    }

    return vDomObj;
}


function sanitizeHtml(html) {
    return html.replace(/\>\s+\</g,'><').replace(/\s+/g,' ').trim();
}


function convertToVdom (tmpl) {
    return parseVdom(tovdom(sanitizeHtml(tmpl)));
}


var svgNodeChildrenManager = (function() {
    var children = [];
    
    return {
        set: function (child) {
            if (!child.length) {
                children = [];
                return;
            }

            for (const a of child) {
                children.push(a);

                if (a.children && a.children.length) {
                    this.set(a.children);
                }
            }
        },
        get: function() {
            return children;
        },

        remove: function(index) {
            children.splice(index, 1);
        }
    }
})();


function createElementByType(node) {    
    var $el = document.createElement(node.type);

    if (node.type === 'svg') {       
        $el = document.createElementNS('http://www.w3.org/2000/svg', node.type);
        svgNodeChildrenManager.set(node.children);
    }

    if (svgNodeChildrenManager.get().length) {        
        for (let i = 0; i < svgNodeChildrenManager.get().length; i++) {
            if (isEquivalent(node, svgNodeChildrenManager.get()[i])) {
                $el = document.createElementNS('http://www.w3.org/2000/svg', node.type);
                svgNodeChildrenManager.remove(i);
            }
        }
    }

    return $el;
};


function createElement(node) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }

    var $el = createElementByType(node);

    //set attributes
    for(var a in node.props) {
        if (!/^[;.:=].*/.test(a)) {
            $el.setAttribute(a, node.props[a]);
        }        
    }
  
    if (node.children) {
        node.children
          .map(createElement)
          .forEach($el.appendChild.bind($el));
    }
    
    return $el;
}


function isEquivalent (a, b) {
    var aProps = (typeof a === 'object' && a != null) ? Object.getOwnPropertyNames(a) : {};
    var bProps = (typeof b === 'object' && b != null) ? Object.getOwnPropertyNames(b) : {};

    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    return true;
}


function changed(node1, node2) {    
    return typeof node1 !== typeof node2 ||
           typeof node1 === 'string' && node1 !== node2 ||
           node1.type !== node2.type ||
           !isEquivalent(node1.props, node2.props)
}


function updateElement($parent, newNode, oldNode, index = 0) {  
    if (!oldNode) {
        $parent.appendChild(
          createElement(newNode)
        );
    } else if (!newNode) {
        $parent.removeChild(
          $parent.childNodes[index]
        );
    } else if (changed(newNode, oldNode)) {        
        $parent.replaceChild(
          createElement(newNode),
          $parent.childNodes[index]
        );
    } else if (newNode.type) {
        if (!newNode.children){
            newNode.children = [];
        }
        
        if (!oldNode.children){
            oldNode.children = [];
        }

        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        for (let i = 0; i < newLength || i < oldLength; i++) {           
            updateElement(
              $parent.childNodes[index],
              newNode.children[i],
              oldNode.children[i],
              i
            );
        }
    }
}


export { convertToVdom, updateElement }
