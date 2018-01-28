
const ifEq = () => { return (v1, v2, options) => {
        if(v1 === v2) {
            return options.fn(this);
        }

        return options.inverse(this);    
    }
}

const ifNotEq = () => { return (v1, v2, options) => {
    if(v1 !== v2) {
        return options.fn(this);
    }

    return options.inverse(this);    
}
}

const ifGreaterThan = () => { return (v1, v2, options) => {
        if(v1 > v2) {
            return options.fn(this);
        }

        return options.inverse(this);
    }
}

const ifLessThan = () => { return (v1, v2, options) => {
        if(v1 < v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    }
}

const bucleFor = () => { return (from, to, incr, block) => {
        let accum = '';

        for(let i = from; i < to+1; i += incr) {
            accum += block.fn(i);
        }
            
        return accum;
    }
}

const operation = () => { return (type, v1, v2, options) => {
        if (type === '+') {
            return (v1 + v2);
        }

        if (type === '-') {
            return (v1 - v2);
        }
    }
}

const replace = () => { return (txt, symbolToReplace, replaceFor, options) => {
    return txt.replace(symbolToReplace, replaceFor);
    }
}

const toLowerCase = () => { return (txt, options) => {
    return txt.toLowerCase();
    }
}

const length = () => { return (num, options) => {
    return +num.length;
}
}


export { ifEq, ifNotEq, ifGreaterThan, ifLessThan, bucleFor, operation, replace, toLowerCase, length };