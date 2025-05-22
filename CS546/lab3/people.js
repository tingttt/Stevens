//Export the following functions using ES6 Syntax
import axios from 'axios';
async function getPeople() {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/448017f5cb43e0d590adb744e676f4b5/raw/495e09557914db5d2f40141aaef60113eb19bb41/people.json')
    return data // this will be the array of people objects
}


const getPersonById = async(id) => {
    if (typeof id !== 'string' || id == null) throw new Error('ID must exist and be a string.');

    const trim_Id = id.trim(); // Trim lall whitespace
    if (trim_Id.length === 0) throw new Error('ID cannot be empty or just spaces.');
    let peopleData = await getPeople();
    let selectedData = peopleData.filter(item => item.id === trim_Id);
    if (selectedData.length == 0) throw new Error('person not found');

    return selectedData;

};

const sameJobTitle = async(jobTitle) => {
    if (typeof jobTitle !== 'string' || jobTitle == null) throw new Error('Job title must be a string.');
    const trimJobTitle = jobTitle.trim();
    if (trimJobTitle.length === 0) throw new Error('Job title cannot be empty or just spaces.');

    let peopleData = await getPeople();
    let selectedData = peopleData.filter(item => item.job_title.toUpperCase() === trimJobTitle.toUpperCase());
    if (selectedData.length <= 2) throw new Error("at least two people should have the same job title")


    return selectedData;
};


const getPostalCodes = async(city, state) => {
    if (typeof city !== 'string' || typeof state !== 'string' || state == null || city == null) throw new Error("city and state must exist and they must be strings");

    let standardizedCity = city.trim();
    let standardizedState = state.trim();
    if (standardizedCity.length == 0 || standardizedState.length == 0) throw new Error("city and state can't be just empty spaces");

    let peopleData = await getPeople();

    let selectedData = peopleData.filter(item => (item.city.toUpperCase() === standardizedCity.toUpperCase() && item.state.toUpperCase() === standardizedState.toUpperCase()));
    if (selectedData.length == 0) throw new Error("There are no postal_codes for the given city and state combination");
    selectedData = selectedData.map(item => item.postal_code);
    selectedData = selectedData.sort((a, b) => parseInt(a) - parseInt(b));

    return selectedData;
};

const sameCityAndState = async(city, state) => {
    if (typeof city !== 'string' || typeof state !== 'string') throw new Error("city and state must exist and they must be strings");
    let standardizedCity = city.trim();
    let standardizedState = state.trim();
    if (standardizedCity.length == 0 || standardizedState.length == 0) throw new Error("city and state can't be just empty spaces");

    let peopleData = await getPeople();

    let selectedData = peopleData.filter(item => (item.city.toUpperCase() === standardizedCity.toUpperCase() && item.state.toUpperCase() === standardizedState.toUpperCase()));
    if (selectedData.length < 2) {
        throw new Error("There are not at least two people who live in the same city and state.");
    }

    selectedData = selectedData.map(item => item.first_name + " " + item.last_name);

    selectedData.sort((a, b) => {
        const lastName_A = a.split(" ");
        const lastName_B = b.split(" ");
        return lastName_A[1].localeCompare(lastName_B[1]); //use local compare to compare two string, lastname is the second element in split
    });

    return selectedData;
};

export { getPersonById, sameJobTitle, getPostalCodes, sameCityAndState };
// let res = await getPersonById("fa36544d-bf92-4ed6-aa84-7085c6cb0440");
// console.log(res);
// await getPersonById(-1); // Throws Error 
// await getPersonById(1001); // Throws Error 
// await getPersonById(); //Throws Error
// let res = await getPersonById('7989fa5e-5617-43f7-a931-46036f9dbcff'); // Throws person not found Error
// console.log(res);

// await sameJobTitle("Help Desk Operator");
// await sameJobTitle("HELP DESK OPERATOR");
//  Returns:
// [
// {id:"71b58028-2d43-447a-9911-925d15fc5936", first_name:"Dionis", last_name:"Morson", email:"dmorsonw@newsvine.com", phone_number:"813-647-2585", address:"98753 Surrey Way", city:"Tampa", state:"Florida", postal_code:"33647", company_id:"216602a1-032f-4a0c-8e01-84e32d3d9e26", department:"Business Development", job_title:"Help Desk Operator"},
// {id:"d7fdb4b4-e5d8-46be-831e-cdd3966d9da7", first_name:"Jillana", last_name:"Defries", email:"jdefriesa7@reference.com", phone_number:"570-774-0588", address:"50 Veith Avenue", city:"Wilkes Barre", state:"Pennsylvania", postal_code:"18763", company_id:"bc50e7ff-8a3f-42a8-a99e-2fe686d0923f", department:"Training", job_title:"Help Desk Operator"},
// {id:"5773c99d-655b-46b6-9655-80406cabffd0", first_name:"Barrett", last_name:"Bachs", email:"bbachsq6@parallels.com", phone_number:"516-387-4592", address:"078 Lindbergh Place", city: "Port Washington", state:"New York", postal_code:"11054", company_id:"da1c6c44-c35a-4d10-a9e6-1c816c99e0e5", department:"Business Development", job_title:"Help Desk Operator"}
// ]

// await sameJobTitle(); // Throws Error
// await sameJobTitle("Staff Accountant IV"); // Throws Error since there are not two people with that job title
// await sameJobTitle(123); // Throws Error
// await sameJobTitle(["Help Desk Operator"]); // Throws Error 
// await sameJobTitle(true); // Throws Error

// await getPostalCodes("Salt Lake City", "Utah"); // Returns: ['84130', '84135', '84145']
// await getPostalCodes(); // Throws Error
// await getPostalCodes(13, 25); // Throws Error
// let res = await getPostalCodes("Bayside", "New York"); // Throws Error: There are no postal_codes for the given city and state combination
// console.log(res);
// await sameCityAndState("Salt Lake City", "Utah"); // Returns: ['Vonnie Faichney', 'Townie Sandey',  'Eolande Slafford']
// await sameCityAndState(); // Throws Error
// await sameCityAndState("    ", "      "); // Throws Error
// await sameCityAndState(2, 29); // Throws Error
// await sameCityAndState("Bayside", "New York"); // Throws Error: there are not two people who live in the same city and state