//You will code the route in this file
//Lecture Code Refernece -> https://github.com/stevens-cs546-cs554/CS-546/tree/master/lecture_05/routes

//You can import your getStocks() function in the /data/data.js file 3 to return the list of stocks and call it in the /stocks route.  You can also import your getStockById(id) function and call it in the :/id route.

import {Router} from 'express';
const router = Router();
import * as Data from '../data/data.js';
import validation from '../helpers.js';

router.route('/')
// Implement GET Request Method and send a JSON response See lecture code!
.get(async (req, res) => {
    try {
      let stocksList = await Data.getStocks();
      return res.json(stocksList);
    } catch (e) {
      return res.sendStatus(500);
    }
  })
router.route('/:id')
//Implement GET Request Method and send a JSON response See lecture code!
.get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, 'ID URL Param');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      let stock = await Data.getStockById(req.params.id);
      return res.json(stock);
    } catch (e) {
        return res.status(404).json({error: e});
    }
  })

export default router;
