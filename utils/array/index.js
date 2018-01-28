
const removeFromArray = (array, element) => {   
    return array.filter((e) => {
        return !isEquivalent(element, e);
    });
}

const updateFromArray = (array, element, elemenToUpdate) => {   
    return array.map((e) => {
        return isEquivalent(element, e) ? e = elemenToUpdate : e;
    });
}

const isEquivalent = (a, b) => {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

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

export { removeFromArray, updateFromArray }