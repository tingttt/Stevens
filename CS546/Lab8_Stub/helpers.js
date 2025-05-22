const Marvelpublickey = 'f8834ef4848f460e57dacb7bd7a6612e';
const Marvelprivatekey = '0434c04c41e1af6741afff99d9555f919e9558ec';

const exportedMethods = {
    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== 'string') throw `Error:${varName} must be a string`;
        id = id.trim();
        if (id.length === 0)
            throw `Error: ${varName} cannot be an empty string or just spaces`;
        // if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
    },

    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
            throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
    },

    checkStringArray(arr, varName) {
        //We will allow an empty array for this,
        //if it's not empty, we will make sure all tags are strings
        if (!arr || !Array.isArray(arr))
            throw `You must provide an array of ${varName}`;
        for (let i in arr) {
            if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
                throw `One or more elements in ${varName} array is not a string or is an empty string`;
            }
            arr[i] = arr[i].trim();
        }

        return arr;
    },
    checkNumber(number, varName) {
        if (!number) throw `${varName} Input must be provided`;
        if (typeof strVal === 'string' && number.trim().length === 0)
            throw 'Input cannot be just spaces';
        number = Number(number) // Convert string to Int
        if (!number) throw "ID Must Be a Number";
        if (!Number.isInteger(number)) throw " ID Must Be an Integer"
        if (typeof number !== "number") throw 'input must be a number';
        return number;
    }
};

export default { exportedMethods, Marvelpublickey, Marvelprivatekey };