//Here you will require route files and export the constructor method as shown in lecture code and worked in previous labs.
import staticRoutes from'./routesApi.js';

const constructorMethod = (app) => {
  app.use('/', staticRoutes);
  app.use(/(.*)/, (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;