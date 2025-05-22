// Setup server, session and middleware here.

/*
Middlewares
You will have the following middleware functions:

This middleware will apply to the root route / (note, a middleware applying to the root route is the same as a middleware that fires for every request) and will do one of the following:
This middleware will log to your console for every request made to the server, with the following information:
Current Timestamp: new Date().toUTCString()
Request Method: req.method
Request Path: req.path
Some string/boolean stating if a user is authenticated
If logged in, the users status (superuser or user)
    There is no precise format you must follow for this. The only requirement is that it logs the data stated above.

     An example would be:

    [Sun, 14 Apr 2019 23:56:06 GMT]: GET / (Non-Authenticated)

     [Sun, 14 Apr 2019 23:56:14 GMT]: POST /login (Non-Authenticated)

     [Sun, 14 Apr 2019 23:56:19 GMT]: GET /userProfile (Authenticated Super User)

     [Sun, 14 Apr 2019 23:56:44 GMT]: GET / (Authenticated User)

Then call next

3. This middleware will only be used for the GET /login route and will do one of the following:    
     A. If the user is authenticated AND they have a role of superuser, the middleware function will redirect them to the /superuser route,
     B. If the user is authenticated AND they have a role of user, you will redirect them to the /user route.
     C. If the user is NOT authenticated, you will allow them to get through to the GET /login route. A logged in user should never be able to access the sign in form.

4. This middleware will only be used for the GET /login route and will do one of the following:
     A. If the user is authenticated AND they have a role of superuser, the middleware function will redirect them to the /superuser route,
     B. If the user is authenticated AND they have a role of user, you will redirect them to the /user route.
     C. If the user is NOT authenticated, you will allow them to get through to the GET /signupuser route. A logged in user should never be able to access the registration form.

5. This middleware will only be used for the GET /user route and will do one of the following:
     A. If a user is not logged in, you will redirect to the GET /login route.
     B. If the user is logged in, the middleware will "fall through" to the next route calling the next() callback. (Users with both roles superuser or user should be able to access the /user route, so you simply need to make sure they are authenticated in this middleware.)

6. This middleware will only be used for the GET /superuser route and will do one of the following: 
    A. If a user is not logged in, you will redirect to the GET /login route.
    B. If a user is logged in, but they are not an super user, you end the response right in the middleware function and render a HTML error page saying that the user does not have permission to view the page, and the page must issue an HTTP status code of 403. (provide a link to the /user page, since they are logged in, just not an super user)
   C. If the user is logged in AND the user has a role of superuser, the middleware will "fall through" to the next route calling the next() callback.
 ONLY USERS WITH A ROLE of superuser SHOULD BE ABLE TO ACCESS THE /superuser ROUTE!

7. This middleware will only be used for the GET /signout route and will do one of the following:   
     If a user is not logged in, you will redirect to the GET /login route.
     If the user is logged in, the middleware will "fall through" to the next route calling the next() callback.



*/

import Validation from './helpers.js';
import middleware from './middleware.js';
import { engine } from 'express-handlebars';

import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';

app.use(express.json());

app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({ defaultLayout: 'main' })); // Use the imported 'engine'
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthenticationState',
    secret: "BLABLABLABLA",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 60000}
  })
);
app.use(middleware.loggingMiddleware); 

   

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});