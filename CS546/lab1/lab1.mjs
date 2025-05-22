export const questionOne = (arr) => {
    // Implement question 1 here
    let res_arr = [];
    for (let key in arr) {
        let item = arr[key]
        let res = 1;
        while (item > 1) {
            res = res * item;
            item--;
        }
        res_arr.push(res);
    }
    return res_arr; //return result
};

export const questionTwo = (arr) => {
    // Implement question 2 here
    let res_dict = {};
    arr.forEach(element => {
        let res = true;
        let divisor = element - 1;
        while (divisor > 1) { // a prime number can't be divisible by other number expcept itself and 1 
            if (element % divisor == 0) {
                res = false
            }
            divisor--;
        }
        res_dict[element] = res;
    });
    return res_dict; //return result
};

export const questionThree = (str) => {
    let res_dict = { uppercase: 0, lowercase: 0, numbers: 0, spaces: 0, otherCharacters: 0 };
    str.split("").forEach(element => {
            if (element === ' ') { //check space first because space is also a number
                res_dict.spaces++;
            } else if (!isNaN(element)) {
                res_dict.numbers++;
            } else if (element >= 'A' && element <= 'Z') { // letters are representation from its ascii number, so we can compare it
                console.log(element)
                res_dict.uppercase++;
            } else if (element >= 'a' && element <= 'z') {
                res_dict.lowercase++;
            } else {
                res_dict.otherCharacters++; // everything else is other characters
            }

        })
        // Implement question 3 here
    return res_dict; //return result
};

export const questionFour = (arr) => {
    // Implement question 4 here
    // Using Insertion Sort
    // String is an array of Chars
    for (let i = 1; i < arr.length; i++) {
        let current = arr[i];
        // Use String to unify all input type to String
        let currentFirstChar = String(current)[0];
        let j = i - 1;

        while (j >= 0 && String(arr[j])[0] > currentFirstChar) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = current;
    }
    return arr;
};

//DO NOT FORGET TO UPDATE THE INFORMATION BELOW OR IT WILL BE -2 POINTS PER FIELD THAT IS MISSING.
export const studentInfo = {
    firstName: 'Tingting',
    lastName: 'Luan',
    studentId: '20035571'
};