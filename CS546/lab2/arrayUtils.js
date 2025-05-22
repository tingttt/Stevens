/* Todo: Implment the functions below and then export them
      using ES6 syntax. 
      DO NOT CHANGE THE FUNCTION NAMES
*/

let arrayStats = (array) => {

    if (!array) throw new Error("the array do not exists");
    if (!Array.isArray(array)) throw new Error("The array is not of the proper type");
    if (array.length === 0) throw new Error("The array should not be empty.");

    // Each array element is a number (can be positive, negative, decimal, zero)
    array.forEach(element => {
        if (typeof element !== 'number') {
            throw new Error("All array elements should be numbers.");
        }
    })

    // sort the array from lowest to highest numbers before performing your calculations.
    const sortedArray = [...array].sort((a, b) => a - b);

    // Calculate stats
    let sum = 0;

    sortedArray.forEach(number => {
        sum += number;
    });


    const count = sortedArray.length;
    const mean = sum / count;
    const min = sortedArray[0];
    const max = sortedArray[count - 1];
    const range = max - min;

    // Median
    let median = 0;
    //check if there is one median or two median
    if (count % 2 === 0) {
        //count mean for two median
        median = (sortedArray[count / 2 - 1] + sortedArray[count / 2]) / 2;
    } else {
        median = sortedArray[Math.floor(count / 2)];
    }
    //Mode
    let mode_count = {};
    sortedArray.forEach(element => {
        element in mode_count ? mode_count[element]++ : mode_count[element] = 1;
    })


    let maxCount = 2;
    let mode = [];
    for (const item in mode_count) {
        if (mode_count[item] > maxCount) {
            maxCount = mode_count[item];
            mode = [];
            mode.push(Number(item)); // clear exist mode list and add the new mode in list
        } else if (mode_count[item] === maxCount) {
            mode.push(Number(item)); //all max occurance add to mode list
        }
    }
    mode = mode.length == 1 ? mode[0] : mode; //if only one element return itself.
    mode = mode.length == 0 ? 0 : mode; // if there is no mode every element occur once return 0

    return {
        mean: mean,
        median: median,
        mode: mode,
        range: range,
        minimum: min,
        maximum: max,
        count: count,
        sum: sum,
    };
};

let mergeCommonElements = (...arrays) => {
    //this function takes in a variable number of arrays that's what the ...arrays signifies
    if (arrays.length < 2) throw new Error("At least TWO arrays should be supplied as input");
    arrays.forEach(array => {
        if (!Array.isArray(array)) throw new Error("Each input must be an array.");
        if (array.length === 0) throw new Error("Each array must have at least one element.");

    })

    const flattenedArray = arrays.map(array => array.flat(Infinity));
    // console.log(flattenedArray);
    flattenedArray.forEach(array => {
        for (const element of array) {
            if (typeof element !== 'number' && typeof element !== 'string') throw new Error("Each array element should be either a string,  number or an array that has either strings or numbers as elements.");

        }
    });

    let arrayMerge = (arrays) => {
        if (arrays.length === 0) {
            return [];
        }

        let common = arrays[0]; // Start with the first array

        for (let i = 1; i < arrays.length; i++) {
            common = common.filter(element => arrays[i].includes(element)); //filter out the current array elements in the next array
        }

        return common;

    };
    // sort array from lowest to highest numbers and then from lowest ASCII to highest ASCII String
    let res_arr = arrayMerge(flattenedArray).sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
            //if both are number
            return a - b; // Numerical sort
        } else if (typeof a === 'number') {
            return -1; // Numbers before strings
        } else if (typeof b === 'number') {
            return 1; // Numbers before strings
        } else {
            return a.localeCompare(b); // Alphabetical sort (ASCII order)
        }
    });
    res_arr = Array.from(new Set(res_arr)) // remove duplicate

    return res_arr;
};

let numberOfOccurrences = (...arrays) => {
    //this function takes in a variable number of arrays that's what the ...arrays signifies
    if (arrays.length === 0) throw new Error("At least one array must be provided.");

    for (const array of arrays) {
        if (!Array.isArray(array)) throw new Error("Each input must be an array.");
        if (array.length === 0) throw new Error("Each array must have at least one element.");
        for (const element of array) {
            if (typeof element !== 'number' && typeof element !== 'string') {
                throw new Error("Array elements must be either numbers or strings.");
            }
            if (typeof element === 'string' && !/^[a-zA-Z]+$/.test(element)) {
                //strict string elements to have a-zA-Z
                throw new Error("Strings must contain only letters.");
            }
        }
    }
    const res_occurrences = {};
    for (const array of arrays) {
        for (const element of array) {
            //if not exist add the element in occurance with 1 otherwise add 1
            res_occurrences[element] = res_occurrences[element] != null ? res_occurrences[element] + 1 : 1;
        }
    }

    return res_occurrences;

};






export { arrayStats, mergeCommonElements, numberOfOccurrences }