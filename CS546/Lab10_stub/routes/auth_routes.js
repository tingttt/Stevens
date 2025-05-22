//import express, express router as shown in lecture code
import {Router} from 'express';
const router = Router();
import Validation from "../helpers.js"
import * as userData from "../data/users.js"
import middleware from '../middleware.js';

router.route('/').get(async (req, res) => {
  //code here for GET
  const isLogin = req.session && req.session.user;
  var isSuperuser = null;
  
  if (isLogin) {
    isSuperuser= req.session.user.role === 'superuser';
    var themePreference = {
      backgroundColor: req.session.user.themePreference.backgroundColor,
      fontColor: req.session.user.themePreference.fontColor
    };
  }
  else{
    themePreference = {backgroundColor:"#ffffff", fontColor:"#000000"}
  }

  res.render('home', {
    title: 'Home',
    login: isLogin,
    userName : isLogin ? req.session.user.userId : null,
    superuser: isSuperuser,
    themePreference : themePreference
  });
});

router
  .route('/register')
  .get(middleware.registerRouteMiddleware,async (req, res) => {
    //code here for GET
    if (req.session && req.session.user) {
      return res.redirect(req.session.user.role === 'superuser' ? '/superuser' : '/user');
    }
    res.render('register', { title: 'Sign Up', themePreference: {backgroundColor:"#ffffff", fontColor:"#000000"} });
  
  })
  .post(async (req, res) => {
    //code here for POST
    try{

      var { firstName, lastName, userId, password, confirmPassword, favoriteQuote, backgroundColor, fontColor, role, submitButton } = req.body;
    if (!firstName || !lastName || !userId || !password || !confirmPassword || !favoriteQuote || !backgroundColor || !fontColor || !role) {
      return res.status(400).render('register', {
        title: 'Sign Up',
        Error: 'All fields are required',
        themePreference: {backgroundColor:"#ffffff", fontColor:"#000000"}
      });
    }
    var userInput ={ 
      firstName,
      lastName,
      userId,
      password,
      confirmPassword,
      favoriteQuote,
      themePreference : {backgroundColor:backgroundColor,fontColor:fontColor},
      role}

    const missingFields = Object.keys(userInput).filter(key => !userInput[key]||userInput[key]=='');
    if (missingFields.length > 0) {

      return res.status(400).render("register",{ title:"Sign Up", themePreference: {backgroundColor:"#ffffff", fontColor:"#000000"},Error: `Missing fields: ${missingFields.join(', ')}` });
    }
    
    try{
      if (userInput.password !== userInput.confirmPassword) throw new Error("Password and Confirm Password do not match");
    var firstName = Validation.checkName(userInput.firstName, "firstName");
    var lastName = Validation.checkName(userInput.lastName, "lastName");
    var userId = Validation.checkuserId(userInput.userId, "userId");
    var password = Validation.checkPassword(userInput.password, "password");
    var favoriteQuote = Validation.checkQuot(userInput.favoriteQuote, "favoriteQuote");
    var themePreference = Validation.checkTheme(userInput.themePreference, "themePreference");
    var role = Validation.checkRole(userInput.role, "role");
  }catch(e){
      return res.status(400).render('register', {title: 'Sign up',Error: e}); 
    }

    try{
    var newUser = await userData.register(
      firstName,
      lastName,
      userId,
      password,
      favoriteQuote,
      themePreference,
      role
    );}
    catch(e){
      return res.status(400).render('register', {title: 'Sign up',Error: e}); 
  }
  try{
    if (newUser && newUser.userInserted === true) {
      return res.redirect('/login');
    } else {
      return res.status(500).render('register', {
        title: 'Sign Up',
        Error: 'Internal Server Error',
        themePreference: {backgroundColor:"#ffffff", fontColor:"#000000"}
      });
    }}catch(e){  
      return res.status(400).render('register', {title: 'Sign up',Error: e}); 
    }
    
  }catch (e) {
    return res.status(400).render('register', {
      title: 'Sign Up',
      message: e
    });
  }
}
);

router
  .route('/login')
  .get( middleware.loginRouteMiddleware,async (req, res) => {
    //code here for GET

    let themePreference ={backgroundColor:"#ffffff", fontColor:"#000000"};
    res.render('login', { title: 'Login', themePreference: themePreference });
    
  })
  .post(async (req, res) => {
    //code here for POST
      var { userId, password } = req.body;
      if (!userId || !password || typeof userId !== 'string' || typeof password !== 'string') {
        return res.status(400).render('login', {
          title: 'Login',
          Error: 'User ID and Password are required',
          themePreference: {backgroundColor:"#ffffff", fontColor:"#000000"}
        });
      }
      try{
      userId = Validation.checkuserId(userId, "userId");
      password = Validation.checkPassword(password, "password");
    }catch(e){
      return res.status(400).render('login', {
        title: 'Login',
        Error: e
      });
    }
    try{

      var user = await userData.login(userId,password );
    }catch (e) {
      return res.status(400).render('login', {
        title: 'Login',
        Error: e
      });
    }
    try{
      if (user && user.userId === userId) {

        req.session.user = {
          firstName: user.firstName,
          lastName: user.lastName,
          userId: user.userId,
          favoriteQuote: user.favoriteQuote,
          themePreference: user.themePreference,
          role: user.role,
          signupDate: user.signupDate,
          lastLogin: Validation.getCurrentDate()
        };
        return res.redirect(user.role === 'superuser' ? '/superuser' : '/user');
      } else {
        return res.status(500).render('register', {
          title: 'Sign Up',
          Error: 'Internal Server Error',
          themePreference: {backgroundColor:"#ffffff", fontColor:"#000000"}
        });
      }}catch(e){  
        return res.status(400).render('register', {title: 'Sign up',Error: e}); 
      }
    

  });

router.route('/user').get(middleware.userRouteMiddleware, async (req, res) => {
  //code here for GET


  const themePreference = {
    backgroundColor: req.session.user.themePreference.backgroundColor||"#ffffff",
    fontColor: req.session.user.themePreference.fontColor||"#000000"
  };
  res.render('user', {
    title: 'User Page',
    firstName: req.session.user.firstName,
    lastName: req.session.user.lastName,
    role: req.session.user.role,
    signupDate: req.session.user.signupDate,
    lastLogin: req.session.user.lastLogin,
    favoriteQuote: req.session.user.favoriteQuote,
    currentTime: new Date().toLocaleTimeString('en-US'),
    currentDate: new Date().toLocaleDateString('en-US'),
    login: req.session.user,
    superuser: req.session.user.role === 'superuser',
    themePreference
  });
});

router.route('/superuser').get(middleware.superuserRouteMiddleware,async (req, res) => {
  //code here for GET

  const themePreference = {
    backgroundColor: req.session.user.themePreference.backgroundColor||"#ffffff",
    fontColor: req.session.user.themePreference.fontColor||"#000000"
  };
  res.render('superuser', {
    title: 'Super User Page',
    firstName: req.session.user.firstName,
    lastName: req.session.user.lastName,
    signupDate: req.session.user.signupDate,
    lastLogin: req.session.user.lastLogin,
    favoriteQuote: req.session.user.favoriteQuote,
    currentTime: new Date().toLocaleTimeString('en-US'),
    currentDate: new Date().toLocaleDateString('en-US'),
    login: req.session.user,
    superuser: req.session.user.role === 'superuser',
    themePreference
  });
});

router.route('/signout').get(middleware.signoutRouteMiddleware,async (req, res) => {
  //code here for GET
  req.session.destroy();
  res.render('signout', {
    title: 'Signed Out'
  });
});

export default router;