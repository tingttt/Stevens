/* TODO: Import the functions from your three modules here and write two test cases for each function.. You should have a total of 18 test cases. 
do not forget that you need to create the package.json and add the start command to run app.js as the starting script and the type module property*/
// Mean Tests
import * as arrayUtils from './arrayUtils.js'
import * as objectUtils from './objectUtils.js'
import * as stringUtils from './stringUtils.js'



// arrayUtils
// arrayStats
try {
    // Should Pass
    let res = arrayUtils.arrayStats([9, 15, 25.5, -5, 5, 7, 10, 5, 11, 30, 4, 1, -20]); // Returns: { mean: 7.5, median: 7, mode: 5, range: 50, minimum: -20, maximum: 30, count: 13, sum: 97.5 }
    console.log(res);
    console.log('arrayStats passed successfully');
} catch (e) {
    console.error('arrayStats failed test case');
}

try {
    // Should Fail
    let res = arrayUtils.arrayStats("banana"); // throws an error
    console.log(res);
    console.error('arrayStats did not error');
} catch (e) {
    console.log('arrayStats failed successfully');
}
// mergeCommonElements
try {
    // Should Pass
    let res = arrayUtils.mergeCommonElements([3, 4, 1, -2, -4, Infinity], [3, 45, 1, 24, -4, Infinity], [112, "-4", 0, 1, 3, Infinity]) //returns [1, 3]
    console.log(res);
    console.log('mergeCommonElements passed successfully');
} catch (e) {
    console.error('mergeCommonElements failed test case');
}

try {
    // Should Fail
    let res = arrayUtils.mergeCommonElements([1, 2, 3], [], [4, 5, 6]) // throws an error
    console.log(res);
    console.error('mergeCommonElements did not error');
} catch (e) {
    console.log('mergeCommonElements failed successfully');
}
// numberOfOccurrences
try {
    // Should Pass
    let res = arrayUtils.numberOfOccurrences([1, 2, 3], [4, 5, 6, 1], [2, 5, 6, 3]); // Should return: {'1': 2, '2': 2, '3': 2, '4': 1, '5': 2, '6': 2} 
    console.log(res);
    console.log('numberOfOccurrences passed successfully');
} catch (e) {
    console.error('numberOfOccurrences failed test case');
}

try {
    // Should Fail
    let res = arrayUtils.numberOfOccurrences(["key", "value"], [], ["key", "value"]); // Throws an error 
    console.log(res);
    console.error('numberOfOccurrences did not error');
} catch (e) {
    console.log('numberOfOccurrences failed successfully');
}
//stringUtils
// camelCase
try {
    // Should Pass
    let res = stringUtils.camelCase('my function rocks'); // Returns: "myFunctionRocks"
    console.log(res);
    console.log('camelCase passed successfully');
} catch (e) {
    console.error('camelCase failed test case');
}

try {
    // Should Fail
    let res = stringUtils.camelCase(["Hello", "World"]); // Throws Error
    console.log(res);
    console.error('camelCase did not error');
} catch (e) {
    console.log('camelCase failed successfully');
}
// replaceCharsAtIndexes
try {
    // Should Pass
    let res = stringUtils.replaceCharsAtIndexes("mississippi", [1, 4, 7]); //Returns: "missmssspps"
    console.log(res);
    console.log('replaceCharsAtIndexes passed successfully');
} catch (e) {
    console.error('replaceCharsAtIndexes failed test case');
}

try {
    // Should Fail
    let res = stringUtils.replaceCharsAtIndexes("foobar", [0]); // Throws Error
    console.log(res);
    console.error('replaceCharsAtIndexes did not error');
} catch (e) {
    console.log('replaceCharsAtIndexes failed successfully');
}
// compressString
try {
    // Should Pass
    let res = stringUtils.compressString("aaabbccc___");  // Returns: "a3b2c3" 
    console.log(res);
    console.log('compressString passed successfully');
} catch (e) {
    console.error('compressString failed test case');
}

try {
    // Should Fail
    let res = stringUtils.compressString("");  // Throws error 
    console.log(res);
    console.error('compressString did not error');
} catch (e) {
    console.log('compressString failed successfully');
}

// objectUtils
// deepEquality
try {
    // Should Pass
    const forth = { a: { sA: "Hello", sB: "There", sC: "Class" }, b: 7, c: true, d: "Test" }
    const fifth = { c: true, b: 7, d: "Test", a: { sB: "There", sC: "Class", sA: "Hello" } }
    let res = objectUtils.deepEquality(forth, fifth); // true
    console.log(res);
    console.log('deepEquality passed successfully');
} catch (e) {
    console.error('deepEquality failed test case');
}

try {
    // Should Fail
    let res = objectUtils.deepEquality([1, 2, 3], [1, 2, 3]); // throws error 
    console.log(res);
    console.error('deepEquality did not error');
} catch (e) {
    console.log('deepEquality failed successfully');
}
// commonKeysValues
try {
    // Should Pass
    const first = { name: { first: "Patrick", last: "Hill" }, age: 46 };
    const second = { school: "Stevens", name: { first: "Patrick", last: "Hill" } };
    let res = objectUtils.commonKeysValues(first, second); // returns  {name: {first: "Patrick", last: "Hill"}, first: "Patrick", last: "Hill"} 
    console.log(res);
    console.log('commonKeysValues passed successfully');
} catch (e) {
    console.error('commonKeysValues failed test case');
}

try {
    // Should Fail
    let res = objectUtils.commonKeysValues([1, 2, 3], [1, 2, 3]); // throws error 
    console.log(res);
    console.error('commonKeysValues did not error');
} catch (e) {
    console.log('commonKeysValues failed successfully');
}
// calculateObject
try {
    // Should Pass
    let res = objectUtils.calculateObject({ a: 3, b: 7, c: 5 }, n => n * 2); /* Returns:{a: 2.45,b: 3.74,c: 3.16}*/
    console.log(res);
    console.log('calculateObject passed successfully');
} catch (e) {
    console.error('calculateObject failed test case');
}

try {
    // Should Fail
    let res = objectUtils.calculateObject({ a: 3, b: -7, c: 5.65 }, n => n * 2);
    console.log(res);
    console.error('calculateObject did not error');
} catch (e) {
    console.log('calculateObject failed successfully');
}