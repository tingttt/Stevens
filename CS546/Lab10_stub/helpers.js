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
  checkName(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim().replaceAll(" ",""); //nospace allowed
    if (strVal.length==0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    if (strVal.length < 2)
        throw `Error: ${varName} must be at least 2 characters long`;
    if (strVal.length > 20)
      throw `Error: ${varName} must be at most 20 characters long`;
    return strVal;
  },
  checkuserId(userId, varName) {
    if (!userId) throw `Error: You must supply a ${varName}!`;
    if (typeof userId !== 'string') throw `Error: ${varName} must be a string!`;
    userId = userId.trim().toLowerCase();
    if (userId.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!/^[a-zA-Z0-9]+$/.test(userId))
      throw `Error: ${varName} should contain only letters or positive numbers`;
    if (userId.length < 5)
        throw `Error: ${varName} must be at least 5 characters long`;
    if (userId.length > 10)
      throw `Error: ${varName} must be at most 10 characters long`;
    return userId;
  },
  checkPassword(password,varName){ 
    if(!password) throw `Error: You must supply a ${varName}!`;
    if(typeof password != "string") throw `Error: ${varName} must be a string!`;
    password = password.trim();
    if(password.length === 0) throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (password.includes(" ")) throw "Password cannot contain spaces";

    if (!/[A-Z]/.test(password)) throw "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password)) throw "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) throw "Password must contain at least one special character";

    if(!(password.length >= 8)) throw "Password should have atleast 8 characters";
    return password;
},
checkQuot(quot, varName) {
    if (!quot) throw `Error: You must supply a ${varName}!`;
    if (typeof quot !== 'string') throw `Error: ${varName} must be a string!`;
    quot = quot.trim();
    if (quot.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (quot.length > 255)
      throw `Error: ${varName} must be at most 255 characters long`;
    if (quot.length < 20)
      throw `Error: ${varName} must be at least 20 characters long`;
    return quot;
},
checkRole(role, varName) {
    if (!role) throw `Error: You must supply a ${varName}!`;
    if (typeof role !== 'string') throw `Error: ${varName} must be a string!`;
    role = role.trim().toLowerCase(); //save to database in lower case
    if (role.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;


    let validRoles = ['user', 'superuser'];
    if (!validRoles.includes(role))
      throw `Error: ${varName} must be either 'user' or 'superuser'`;
    return role;
},
checkHex(hex, varName){
  let color = this.checkString(hex, varName);
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new Error(`${varName} must be a valid hex color code`);
  }
  return color;
},
checkTheme(theme, varName) {
    if (!theme) throw `Error: You must supply a ${varName}!`;
    if (typeof theme !== 'object' || theme === null) throw `Error: ${varName} must be an object!`;
    if (!theme.backgroundColor || !theme.fontColor) {
        throw new Error("Both backgroundColor and fontColor must be provided");
      }
    theme.backgroundColor = this.checkHex(theme.backgroundColor, "backgroundColor");
    theme.fontColor = this.checkHex(theme.fontColor, "fontColor");
    if (theme.backgroundColor === theme.fontColor) {
        throw new Error("backgroundColor and fontColor cannot be the same");
      }
    return theme;
},
getCurrentDate() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();

    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    const formattedHours = String(hours).padStart(2, '0');

    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formatdt = `${month}/${day}/${year} ${formattedHours}:${minutes}${ampm}`;
    return formatdt;
}
};

export default exportedMethods;