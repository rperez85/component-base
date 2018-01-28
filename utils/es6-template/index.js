//const html = (literalSections, ...substs)  => {    
const htmlEscape = (str) => {
    return str.replace(/&/g, '&')
        .replace(/>/g, '>')
        .replace(/</g, '<')
        .replace(/"/g, '"')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;');
}

export default (literalSections, ...substs) => {
    let raw = literalSections.raw;

    let result = '';

    substs.forEach((subst, i) => {        
        let lit = raw[i];

        if (Array.isArray(subst)) {
            subst = subst.join('');
        }

        if (lit.endsWith('$')) {
            subst = isNaN(subst) ? htmlEscape(subst) : subst;
            lit = lit.slice(0, -1);
        }
        result += lit;
        result += subst;
    });   
    result += raw[raw.length - 1];

    return result;
};

