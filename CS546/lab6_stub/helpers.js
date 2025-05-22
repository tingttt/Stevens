//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
import {ObjectId} from 'mongodb';

const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
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
  checkReleasedDate(dateReleased){
 // Date Released validation
 const dateSplits = dateReleased.split("/");
 if (dateSplits.length !== 3) throw new Error("Date Released must be in mm/dd/yyyy format.");

 const month = parseInt(dateSplits[0], 10);
 const day = parseInt(dateSplits[1], 10);
 const year = parseInt(dateSplits[2], 10);

 if (isNaN(month) || isNaN(day) || isNaN(year)) {
   throw new Error("Date Released must be a valid date.");
 }

 const date = new Date(year, month - 1, day);
// check if date exist
 if (
   date.getMonth() !== month - 1 || // month start at 0
   date.getDate() !== day ||
   date.getFullYear() !== year
 ) {
   throw new Error("Date Released must be a valid date.");
 }

 const currentDate = new Date();
 const yearRangeMin = 1900;
 const yearRangeMax = currentDate.getFullYear() + 2;

 if (year < yearRangeMin || year > yearRangeMax) {
   throw new Error(`Date Released must be between 01/01/1900 and 12/31/2027.`);
 }
 return dateReleased;


  },
  checkRunTime(runtime){
 // Runtime validation
 // const runtimeRegex = /^(?:(\d+)h\s*)?(\d+)min$/;
 const runtimeRegex = /^(\d+)h\s+(\d+)min$/;
 const match = runtime.trim().match(runtimeRegex);
 
 if (!match) {
   throw new Error("Runtime input not match pattern");
 }
 
 const hours = match[1] ? parseInt(match[1], 10) : 0;
 const minutes = parseInt(match[2], 10);
 
 if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes > 59 || (hours === 0 && minutes < 31)) {
   throw new Error("Runtime input not valid");
 }
 return runtime;
  },
  checkRating(rating) {
    if (typeof rating !== 'number') {
      throw new Error('Rating must be a number.');
    }
  
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5 (inclusive).');
    }
  
    // Check if rating has more than one decimal place
    if (!Number.isInteger(rating) && !Number.isInteger(rating * 10)) {
      throw new Error('Rating must have at most one decimal place.');
    }
    return rating;
  },
 
  
  
};

export default exportedMethods;