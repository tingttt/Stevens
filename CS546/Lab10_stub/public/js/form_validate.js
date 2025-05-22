// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!
document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    


    function checkName(strVal, varName) {
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
    }
    function checkuserId(userId, varName) {
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
    }
    function checkPassword(password,varName){ 
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
  }
  function checkQuot(quot, varName) {
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
  }
  function checkRole(role, varName) {
      if (!role) throw `Error: You must supply a ${varName}!`;
      if (typeof role !== 'string') throw `Error: ${varName} must be a string!`;
      role = role.trim().toLowerCase(); //save to database in lower case
      if (role.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  
  
      let validRoles = ['user', 'superuser'];
      if (!validRoles.includes(role))
        throw `Error: ${varName} must be either 'user' or 'superuser'`;
      return role;
  }
  function checkHex(hex, varName){
    let color = this.checkString(hex, varName);
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
      throw new Error(`${varName} must be a valid hex color code`);
    }
    return color;
  }
  function checkTheme(theme, varName) {
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
  }


    if (signinForm) {
      const errorMessage = document.getElementById('error_message');
        signinForm.addEventListener('submit', (event) => {
            var userId = document.getElementById('userId').value;
            var password = document.getElementById('password').value;

          try {
            userId = checkuserId(userId, "userId");
            password = checkPassword(password, "password");

          }catch(e){
            event.preventDefault();
            errorMessage.textContent = e;
            errorMessage.style.color = 'red';
          }
        });
    }
    if (signupForm) {
      const errorMessage = document.getElementById('error_message');
        signupForm.addEventListener('submit', (event) => {
            var firstName = document.getElementById('firstName').value;
            var lastName = document.getElementById('lastName').value;
            var userId = document.getElementById('userId').value;
            var password = document.getElementById('password').value;
            var confirmPassword = document.getElementById('confirmPassword').value;
            var favoriteQuote = document.getElementById('favoriteQuote').value;
            var backgroundColor = document.getElementById('backgroundColor').value;
            var fontColor = document.getElementById('fontColor').value;
            var role = document.getElementById('role').value;

            try {
                firstName = checkName(firstName, "firstName");
                lastName = checkName(lastName, "lastName");
                userId = checkuserId(userId, "userId");
                password = checkPassword(password, "password");
                confirmPassword = checkPassword(confirmPassword, "confirmPassword");
                favoriteQuote = checkQuot(favoriteQuote, "favoriteQuote");
                themePreference = checkTheme({backgroundColor:backgroundColor,fontColor:fontColor}, "themePreference");
                role = checkRole(role, "role");
                if (password !== confirmPassword) {
                    throw new Error("Password and Confirm Password do not match");
                }
            }
            catch (e) {
                event.preventDefault();
                errorMessage.textContent = e;
                errorMessage.style.color = 'red';
            }
          
          
          })
    }

  });