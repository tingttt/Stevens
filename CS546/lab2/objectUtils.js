/* Todo: Implment the functions below and then export them
      using ES6 syntax. 
      DO NOT CHANGE THE FUNCTION NAMES
*/

let deepEquality = (obj1, obj2) => {
    // That obj1 and obj2 exists and is of proper type (an Object).  If not, throw and error. 
    // array can be type object so if detect array throw error
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null || Array.isArray(obj2) || Array.isArray(obj1)) throw new Error("Inputs must be objects.");

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if all keys in keys1 are present in keys2
    if (!keys1.every(key => keys2.includes(key))) {
        return false;
    }

    // check for each key val in two objects
    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // objects
        if (typeof val1 === 'object' && typeof val2 === 'object') {
            if (!deepEquality(val1, val2)) {
                // Recursively compare each key-value pair
                return false;
            }
        }
        // not objects
        else if (val1 !== val2) {
            return false;
        }

    }
    return true;
};

let commonKeysValues = (obj1, obj2) => {

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null || Array.isArray(obj2) || Array.isArray(obj1)) {
        throw new Error("Inputs must be objects.");
    }

    let common = {};

    for (const key in obj1) {
        if (obj2[key] != null) { // Check if both objects have the key
            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                const nestedCommon = commonKeysValues(obj1[key], obj2[key]);
                // if nested common is returning, means they have common ,check if they are the same
                if (Object.keys(nestedCommon).length == Object.keys(obj1).length) {
                    common[key] = nestedCommon;
                    common = {...common, ...nestedCommon };
                }
            } else if (obj1[key] === obj2[key]) {
                common[key] = obj1[key];
            }
        }
    }

    return common;
};

let calculateObject = (object, func) => {

    if (typeof object !== 'object' || object === null || Array.isArray(object)) throw new Error("The object must be of object type.");
    if (typeof func !== 'function') throw new Error("The func must be function type.");
    // That the object values are all numbers (positive, negative, decimal).  If not, throw an error
    for (const key in object) {
        if (typeof object[key] !== 'number' || Number.isNaN(object[key])) {
            throw new Error("the object values should all be numbers (positive, negative, decimal).");
        }
    }

    // init result object and add calculated result to it.
    const res = {};
    for (const key in object) {
        const evaluatedFucRes = func(object[key]);
        if (Number.isNaN(evaluatedFucRes)) throw new Error("Not valid result");
        if (evaluatedFucRes < 0) throw new Error("CAn't take the squar root of a negative number");
        const sqrtVal = Math.sqrt(evaluatedFucRes);
        res[key] = sqrtVal.toFixed(2); // Round to 2 decimal
    }

    return res;
};







export { deepEquality, commonKeysValues, calculateObject }