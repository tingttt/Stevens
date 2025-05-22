//Here you will import route files and export them as used in previous labs
import characterRoutes from './characters.js';
import path from 'path';
import { static as staticDir } from 'express';

const constructorMethod = (app) => {
    app.use('/', characterRoutes);
    app.use('/public', staticDir('public'));

    app.use(/(.*)/, (req, res) => {
        res.status(404).render('error', {
            title: "404 Not Valid Page",
            message: "This page does not implemented yet."
        });
    });

};

export default constructorMethod;