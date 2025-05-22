//Here is where you'll set up your server as shown in lecture code

import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import { engine } from 'express-handlebars'; // Correct import for ESM

import path from "path";

app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({ defaultLayout: 'main' })); // Use the imported 'engine'
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});