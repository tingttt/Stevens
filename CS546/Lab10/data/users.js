import bcrypt from "bcrypt";
import Validation from "../helpers.js"
import {users} from "../config/mongoCollections.js";
const saltRounds = 16;
//import mongo collections, bcrypt and implement the following data functions
export const register = async (
  firstName,
  lastName,
  userId,
  password,
  favoriteQuote,
  themePreference,
  role
) => {
  if(!firstName || !lastName ||
    !userId || !password ||
    !favoriteQuote || 
    !themePreference ||
    !role) 
  throw "All fields are required";

  firstName = Validation.checkName(firstName, "firstName");
  lastName = Validation.checkName(lastName, "lastName");
  userId = Validation.checkuserId(userId, "userId");
  password = Validation.checkPassword(password, "password");
  favoriteQuote = Validation.checkQuot(favoriteQuote, "favoriteQuote");
  themePreference = Validation.checkTheme(themePreference, "themePreference");
  role = Validation.checkRole(role, "role");

  const userCollection = await users();
  const finduser = await userCollection.findOne({'userId': userId});
  if (finduser) throw "This userId already exists";

  let hashpassword = await bcrypt.hash(password, saltRounds);

  let newUser = {
    firstName: firstName,
    lastName: lastName,
    userId: userId,
    password: hashpassword,
    favoriteQuote: favoriteQuote,
    themePreference: themePreference,
    role: role,
    signupDate: Validation.getCurrentDate(),
    lastLogin: Validation.getCurrentDate()
    
  };

  const insertInfo = await userCollection.insertOne(newUser);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw " User was unable to Sign up MongoDB Server Error"; // Not sure about this part confirm once
  else return {userInserted: true};
};

export const login = async (userId, password) => {
  if(!userId || !password) throw "All fields are required";
  userId = Validation.checkuserId(userId, "userId");
  password = Validation.checkPassword(password, "password");
  const userCollection = await users();
  const user = await userCollection.findOne({ userId: userId });
  if (!user) throw "Either userId or password is incorrect"; // if no user found


  
  const match = await bcrypt.compare(password, user.password);
  if(match){ 
    await userCollection.updateOne(
      { userId: userId },
      { $set: { lastLogin: Validation.getCurrentDate() } } );
    return user;
  }
  else throw "Either userId or password is incorrect"; 
};
