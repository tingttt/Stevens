/* Todo: Implment the functions below and then export them
      using ES6 syntax. 
      DO NOT CHANGE THE FUNCTION NAMES
*/

let camelCase = (str) => {
    if (str === undefined || str === null) throw new Error("The string must exist.");
    if (typeof str !== 'string') throw new Error("The string is not of the proper type.");
    if (str.length === 0) throw new Error("The length of the string should be greater than 0.");

    const words = str.toLowerCase().split(' '); // Split into words and lowercase

    let res = ""; // First word remains lowercase

    words.forEach(word => {
        res += word.charAt(0).toUpperCase() + word.slice(1); // Capitalize first letter and add the rest
    })
    return res;
};

let replaceCharsAtIndexes = (str, idxArr) => {
    if (str === undefined || str === null) throw new Error("The string must exist.");
    if (typeof str !== 'string') throw new Error("The input must be a string.");
    if (str.length === 0 || str.trim().length === 0) throw new Error("The string cannot contain only spaces and should have a length greater than 0.");
    if (!Array.isArray(idxArr)) throw new Error("The idxArr must be an array.");
    idxArr.forEach(idx => {
        if (Number.isNaN(idx)) throw new Error("idxArr NaN");
        if (idx <= 0 || idx > str.length - 2) throw new Error("Invalid indexes in idxArr.");

    })

    // Replace characters
    let res = str;
    for (const idx of idxArr) {
        let currentIndexChar = str[idx]; //find the character at the given index
        let replacement = str[idx - 1]; //find the replacement which is the previous element of the currentIndexChar

        let substring1 = res.substring(0, idx + 1); //slice everything before currentIndexChar (include currentIndexChar)
        let substring2 = res.substring(idx + 1).replace(currentIndexChar, replacement); //only replace the rest of the string with replacement
        res = substring1 + substring2;

    }
    return res;

};

let compressString = (str) => {
    if (str === undefined || str === null) throw new Error("The string must exist.");
    if (typeof str !== 'string') throw new Error("The input must be a string.");
    if (str.length === 0 || str.trim().length === 0) throw new Error("The string cannot be empty or contain only spaces.");

    let res = '';
    let count = 1;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === str[i + 1]) {
            count++;
        } else {
            let countNumber = count > 1 ? count : '';
            res += str[i] + countNumber;
            count = 1;
        }
    }

    return res;
};



export { camelCase, replaceCharsAtIndexes, compressString }