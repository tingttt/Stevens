//An index file that returns a function that attaches all your routes to your app
//Lecture Code Refernece -> https://github.com/stevens-cs546-cs554/CS-546/blob/master/lecture_05/routes/index.js

import peopleRoutes from './people.js';
import stocksRoutes from './stocks.js';

const constructorMethod = (app) => {
	app.use('/people', peopleRoutes);
  	app.use('/stocks', stocksRoutes);

	  app.use('*', (req, res) => {
		res.status(404).json({error: 'Route Not found'});
	  });
};

export default constructorMethod;