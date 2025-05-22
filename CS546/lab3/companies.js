//Export the following functions using ES6 Syntax
import axios from 'axios';
async function getPeople() {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/448017f5cb43e0d590adb744e676f4b5/raw/495e09557914db5d2f40141aaef60113eb19bb41/people.json')
    return data // this will be the array of people objects
}
async function getCompanies() {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/90b56a2abf10cfd88b2310b4a0ae3381/raw/f43962e103672e15f8ec2d5e19106e9d134e33c6/companies.json')
    return data // this will be the array of people objects
}
const listEmployees = async(companyName) => {
    if (typeof companyName !== 'string' || companyName == null) {
        throw new Error("companyName must exist and be a string.");
    }
    companyName = companyName.trim();
    if (companyName.length == 0) {
        throw new Error("companyName cannot be empty or contain only spaces.");
    }

    const companiesData = await getCompanies();
    const peopleData = await getPeople();
    // only once company should find
    const company = companiesData.find(company => company.name.toUpperCase() === companyName.toUpperCase());

    if (company == null) throw new Error("Company not found.");

    let employees = peopleData.filter(employee => employee.company_id === company.id);

    if (employees.length > 0) {
        employees = employees.map(employee => employee.first_name + " " + employee.last_name);
        employees.sort((a, b) => {
            const lastName_A = a.split(" ");
            const lastName_B = b.split(" ");
            return lastName_A[1].localeCompare(lastName_B[1]);
        });
    } else {
        employees = []; //if empty add a empty array
    }
    let res = {...company, employees };

    return res;


};

const sameIndustry = async(industry) => {
    if (typeof industry !== 'string' || industry == null) throw new Error('industry must exist and be a string.');

    let standardizedIndustry = industry.trim();
    if (standardizedIndustry.length == 0) throw new Error("industry can not be just empty spaces");


    const companiesData = await getCompanies();

    const companies = companiesData.filter(company => company.industry.toUpperCase() === standardizedIndustry.toUpperCase());

    if (companies.length === 0) {
        throw new Error("No companies found in that industry.");
    }
    return companies;


};

const getCompanyById = async(id) => {

    if (typeof id !== 'string' || id == null) throw new Error('ID must exist and be a string.');
    let trimId = id.trim();
    if (trimId.length == 0) throw new Error("Id can not be just empty spaces");


    const companiesData = await getCompanies();

    const company = companiesData.filter(company => company.id === id);

    if (company.length == 0) throw new Error("Company not found.");
    return company;
};

export { listEmployees, sameIndustry, getCompanyById };
// await listEmployees("Yost, Harris and Cormier")
//Would return:{id:"fb90892a-f7b9-4687-b497-d3b4606faddf", name:"Yost, Harris and Cormier", street_address:"71055 Sunbrook Circle", city:"Austin", state:"TX", postal_code: "78715", industry:"Apparel" , employees: ["Jenda Rubens"]}

// await listEmployees("Kemmer-Mohr")
// //Would return:{id:"74f11ba3-7253-4146-b5a8-2f7139fe50bf", name:"Kemmer-Mohr", street_address:"534 Lyons Drive", city:"Cincinnati", state:"OH", postal_code: "45999", industry:"Industrial Machinery/Components", employees:['Janessa Arpino', 'Antoni Bottjer']}

// await listEmployees("Will-Harvey")
// //Would return:{id:"746d3cfe-c7b0-4927-ab0b-ecfaf1ef53f8", name:"Will-Harvey", street_address:"818 Russell Court", city:"Jackson", state :"MS", postal_code: "39296", industry:"Major Banks", employees: []}

// await listEmployees('foobar') // Throws Error: No company name with foobar
// await listEmployees(123) // Throws Error


// await sameIndustry('Auto Parts:O.E.M.');
// [

// {id:"b0d53628-9e28-4aed-8559-b105296baf03", name:"Haag, Oberbrunner and Bins", street_address:"810 Butternut Point", city:"Hampton", state":"VA", postal_code: "23668", industry:"Auto Parts:O.E.M."},

// {id:"ddd9d6ec-035c-4809-9978-5117f39376b0", name:"Hayes-Barton", street_address:"27 Montana Lane", city:"Kansas City", state:"MO", postal_code: "64187", industry:"Auto Parts:O.E.M."},

// {id:"fbcae17b-481f-411b-8351-92ac66f1e3a1", name:"Schuster-Lang", street_address:"71599 Marquette Court", city:"Chicago", state:"IL", postal_code: "60604", industry:"Auto Parts:O.E.M."},

// {id:"29ac19a4-999b-4354-bc52-2ef03798c02a", name:"Tillman and Sons", street_address:"6 Hollow Ridge Trail", city:"Charleston", state:"WV", postal_code: "25389", industry:"Auto Parts:O.E.M."},

// {id:"b7a487a9-87a8-4c1c-a84d-ad1ba35fb52a", name:"Mertz, Blanda and Hills", street_address:"67926 Mockingbird Alley", city:"Huntington", state:"WV", postal_code: "25770", industry:"Auto Parts:O.E.M."},

// {id:"44f8ea72-24ec-44fd-b57e-8fc8053c127a", name:"Lubowitz Group", street_address:"42 Porter Hill", city:"Melbourne", state:"FL", postal_code: "32919", industry:"Auto Parts:O.E.M."},

// {id:"1ec4dade-fd59-472f-b44e-74910a5828f6", name:"Schimmel-Hickle", street_address:"67350 Derek Road", city:"Jacksonville", state:"FL", postal_code: "32277", industry:"Auto Parts:O.E.M."}

// ]

// await sameIndustry(43); // Throws Error
// await sameIndustry(' '); // Throws error
// await sameIndustry('Foobar Industry'); // Throws error No companies in that industry
// await sameIndustry(); // Throws Error


// await getCompanyById("fb90892a-f7b9-4687-b497-d3b4606faddf");
// Returns: 
// {id:"fb90892a-f7b9-4687-b497-d3b4606faddf", name:"Yost, Harris and Cormier", street_address:"71055 Sunbrook Circle", city:"Austin", state:"TX", postal_code:"78715", industry:"Apparel"}

// await getCompanyById(-1); // Throws Error 
// await getCompanyById(1001); // Throws Error 
// await getCompanyById(); // Throws Error
// await getCompanyById('7989fa5e-5617-43f7-a931-46036f9dbcff'); // Throws company not found Error