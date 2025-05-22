/*
Using client-side JavaScript only (/public/js/form_process.js), you will add an event listener and then listen for the form's submit event; when the form is submitted, you will:

1. Prevent the default behavior of the form.

2. Get the value of the input text element.  
    You should be expecting a variable number of arrays typed into the input separated by commas:  For example: [3, 0, 1, 2, 4], [1, 2, 8, 15], [6, 3, 10, 25, 29]

    All array elements should be whole numbers (negative and 0 are allowed), no decimals. If any of the elements in any of the arrays is not a whole number, you will display an error on the page in the paragraph element that has the id of "error"

    Each array should have at least one element that is a whole number (negative and 0 are allowed), no decimals. (so no empty arrays)

    You can ignore any extra commas between array inputs for example, inputting: [3, 0, 1, 2, 4],, [1, 2, 8, 15], [6, 3, 10, 25, 29], 

    There should be at least one array inputted. 

    If there is/are empty element(s) in the ANY of the arrays that were inputted, you must display an error and not continue.  For example, inputting: [3, 0, 1, , 4], [1, 2, 8, 15] [6, 3, 10, 25, 29]

3. You will then return a single array that has all the values from the arrays inputted sorted from lowest to highest number with no duplicates (so unique elements).  For example:  If our input was: [3, 0, 1, 2, 4], [1, 2, 8, 15], [6, 3, 10, 25, 29] You would return:  [0, 1, 2, 3, 4, 6, 8, 10, 15, 25, 29]

4. Add a list item to the #input_sorted list of result of the sort you have just completed. You will alternate the class for each list item using the classes is-odd and is-even (described below), starting with is-odd first.


If the user does not have a value for the input when they submit, you should not continue processing and instead should inform them of an error somehow or if they enter anything besides an single array or a list of arrays.

Do not forget to hide the error paragraph if the input was valid.  So for example, if I enter in input that is invalid, the application will how the error paragraph with text explaining the issue; for example "Input cannot just be spaces!".  Then if I re-input the input, but this time it was valid, the error paragraph should get hidden. (look at the Simple Dom Example from Lecture 8's lecture code to see an example of that)

YOU MUST USE THE SAME EXACT NAME/ID ATTRIBUTES AS STATED IN THE ASSIGNMENT, THE GRADING SCRIPT WILL BE LOOKING FOR THESE ELEMENTS BY ID AND NAME SO IF YOU DO NOT NAME THEM EXACTLY WHAT IS STATED, YOU WILL GET THE POINTS OFF FOR IT. 

You can use either the DOM API or jQuery (or a mix of both) for the assignment. 


*/


let myForm = document.getElementById('arraySortForm');
let arrayInput = document.getElementById('array_input');
let errorPara = document.getElementById('error');
let myOl = document.getElementById('input_sorted');
let frmLabel = document.getElementById('array_input_label');

var itemCounter=0;

if (myForm) {
  myForm.addEventListener('submit', (event) => {

    event.preventDefault();


    errorPara.style.display = 'none';
    errorPara.textContent = '';

    let arrayTrim = arrayInput.value.trim();

    // no input
    if (!arrayTrim|| arrayTrim === "") {
        showError('Input cannot be empty!');
        return;
      }

    // Check if it is valid array
    var arrayElements = arrayTrim.split(/,\s*(?=\[)/).map(item => item.trim());


    if (arrayElements.length === 0) {
        showError('At least one array must be inputted.');
        return;
    }


    var resArray = [];
    for (const array of arrayElements) {
        var validnumArr = checkArray(array) 
        if (validnumArr === null) {
            return;
        }
        for (let i=0;i<validnumArr.length;i++){
            if(!resArray.includes(validnumArr[i])){
            resArray.push(validnumArr[i])
        };
        }
    }

    var sortedArray = resArray.sort((a, b) => a - b);

    addLi(sortedArray);
  });
}

function checkArray(array) {
    array = array.trim();
    // Check if the array is empty
    if (array.length === 0) {
      showError('Each array cannot be empty!');
      return null;
    }

    // Trim any trailing commas from the array string
    while (array.endsWith(',')) {
        array = array.slice(0, -1).trim();
    }

    if (!array.startsWith('[') || !array.endsWith(']') ) { 
        showError('Each array is not in array format!');
        return null;
      }

    var elementsList = array.slice(1, -1);

    if (elementsList.includes('[') || elementsList.includes(']')) { 
        showError('Nested array is not allowed!');
        return null;
      }

    elementsList=elementsList.split(',').map(item => item.trim());
    
    var validNumbers = [];
    for (const element of elementsList) {
        const trimmedElement = element.trim();

        if (trimmedElement === '' ) {
            showError('Each element in array should not be empty!');
          return null;
        }
        const num = Number(trimmedElement);
        if (isNaN(num)) {
            showError('Each element in array should be a number!');
          return null; 
        }
        
        if (!Number.isInteger(num)){
        showError('Each element in array should be a integer!');
          return null;
         }
        validNumbers.push(num);
      }
  return validNumbers;
}
function addLi(sortedArray) {
    let li = document.createElement('li');
    
    li.innerHTML = `[${sortedArray.join(', ')}]`;
    
    li.className = itemCounter % 2 === 0 ? 'is-odd' : 'is-even';
    itemCounter++;

      myOl.appendChild(li);
      myForm.reset();
      arrayInput.focus();
  }

function showError(message) {
    errorPara.textContent = message;
    errorPara.style.display = 'block';
  }