/*
This file is where you will import your functions from the two other files and run test cases on your functions by calling them with various inputs.  We will not use this file for grading and is only for your testing purposes to make sure:

1. Your functions in your 2 files are exporting correctly.

2. They are returning the correct output based on the input supplied (throwing errors when you're supposed to, returning the right results etc..).

Note: 
1. You will need an async function in your app.js file that awaits the calls to your function like the example below. You put all of your function calls within main each in its own try/catch block. and then you just call main().
2. Do not create any other files beside the 'package.json' - meaning your zip should only have the files and folder in this stub and a 'package.json' file.
3. Submit all files (including package.json) in a zip with your name in the following format: LastName_FirstName.zip.
4. DO NOT submit a zip containing your node_modules folder.

import people from "./people.js");

async function main(){
    try{
        const peopledata = await people.getPeople();
        console.log (peopledata);
    }catch(e){
        console.log (e);
    }
}

call main
main();
*/
import * as people from "./people.js";
import * as companies from "./companies.js";

async function main() {

    // Tests for getPersonById
    try {
        const person = await people.getPersonById("fa36544d-bf92-4ed6-aa84-7085c6cb0440");
        console.log(person);
    } catch (e) {
        console.log(e);
    }

    // Test cases for invalid inputs (should throw errors)
    const invalidPersonIds = [-1, 1001, null, '7989fa5e-5617-43f7-a931-46036f9dbcff'];
    for (const id of invalidPersonIds) {
        try {
            await people.getPersonById(id);
            console.error(`getPersonById - Error: Should have thrown an error for ID ${id}`);
        } catch (e) {
            console.log(e);
        }
    }

    // Tests for sameJobTitle
    try {
        const result = await people.sameJobTitle("HELP DESK OPERATOR");
        console.log(result);
    } catch (e) {
        console.log(e);
    }

    // Test cases for invalid inputs (should throw errors)
    const invalidJobTitles = [null, "Staff Accountant IV", 123, ["Help Desk Operator"], true];
    for (const title of invalidJobTitles) {
        try {
            await people.sameJobTitle(title);
            console.error(`sameJobTitle - Error: Should have thrown an error for title ${title}`);
        } catch (e) {
            console.log(e);
        }
    }

    // Tests for getPostalCodes
    try {
        const codes = await people.getPostalCodes("Salt Lake City", "Utah");
        console.log(codes);
    } catch (e) {
        console.log(e);
    }

    try {
        await people.getPostalCodes();
    } catch (e) {
        console.log(e);
    }

    try {
        await people.getPostalCodes(13, 25);
    } catch (e) {
        console.log(e);
    }

    try {
        await people.getPostalCodes("Bayside", "New York");
    } catch (e) {
        console.log(e);
    }

    // Tests for sameCityAndState
    try {
        const result = await people.sameCityAndState("Salt Lake City", "Utah");
        console.log(result);
    } catch (e) {
        console.log(e);
    }

    try {
        await people.sameCityAndState();
    } catch (e) {
        console.log(e);
    }

    try {
        await people.sameCityAndState("    ", "      ");
    } catch (e) {
        console.log(e);
    }

    try {
        await people.sameCityAndState(2, 29);
    } catch (e) {
        console.log(e);
    }

    try {
        await people.sameCityAndState("Bayside", "New York");
    } catch (e) {
        console.log(e);
    }

    // Tests for listEmployees

    // Valid company names
    try {
        const result1 = await companies.listEmployees("Yost, Harris and Cormier");
        console.log(result1);
    } catch (e) {
        console.log(e);
    }

    try {
        const result2 = await companies.listEmployees("Kemmer-Mohr");
        console.log(result2);
    } catch (e) {
        console.log(e);
    }

    try {
        const result3 = await companies.listEmployees("Will-Harvey");
        console.log(result3);
    } catch (e) {
        console.log(e);
    }

    // Test cases for invalid inputs (should throw errors)
    try {
        await companies.listEmployees('foobar');
    } catch (e) {
        console.log(e);
    }

    try {
        await companies.listEmployees(123);
    } catch (e) {
        console.log(e);
    }

    // Tests for sameIndustry
    try {
        const result = await companies.sameIndustry('Auto Parts:O.E.M.');
        console.log(result);
    } catch (e) {
        console.log(e);
    }

    // Test cases for invalid inputs (should throw errors)
    try {
        await companies.sameIndustry(43);
    } catch (e) {
        console.log(e);
    }

    try {
        await companies.sameIndustry(' ');
    } catch (e) {
        console.log(e);
    }

    try {
        await companies.sameIndustry('Foobar Industry');
    } catch (e) {
        console.log(e);
    }

    try {
        await companies.sameIndustry();
    } catch (e) {
        console.log(e);
    }

    // Tests for getCompanyById
    try {
        const company = await companies.getCompanyById("fb90892a-f7b9-4687-b497-d3b4606faddf");
        console.log(company);
    } catch (e) {
        console.log(e);
    }

    // Test cases for invalid inputs (should throw errors)
    const invalidCompanyIds = [-1, 1001, null, '7989fa5e-5617-43f7-a931-46036f9dbcff'];
    for (const id of invalidCompanyIds) {
        try {
            await companies.getCompanyById(id);
            console.error(`getCompanyById - Error: Should have thrown an error for ID ${id}`);
        } catch (e) {
            console.log(e);
        }
    }

}

main();