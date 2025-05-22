//Here you will import route files and export them as used in previous labs.

import arraySortRouter from './arraySort.js';
import express from 'express';
import path from 'path';
import {static as staticDir} from 'express';


const constructorMethod = (app) => {
  app.use('/', arraySortRouter);
  app.use('/static', staticDir('static'));
  app.use('/public', staticDir('public'));

  app.use((req, res) => {
    res.status(404).send('Not found');
  });
}

export default constructorMethod;

