# R-Shief Web App
This web app serves the:
* R-Shief Dashboard
* The Good Glitch Bibliography Visualization

You can use the ```Dockerfile``` in this repo for your own service builds if you so please, but before anything will work, you will need to place a ```secrets.js``` file in the ```config/``` directory with the following information:
```
module.exports = {
  dbSecrets: {
    host: "rshief.mysql.db.ip",
    port: "dbport",
    user: "dbuser",
    password: "dbpassword",
    database: "rshiefschema"
  },
  sessionSecrets: {
    secret: "some long keyphrase with which cookies will be encrypted"
  }
}
```

# For Developers
This documentation assumes that a mysql 8.0 database with the R-Shief schema and subroutines is available over the internet.

To spin the server up for development, cd into the root of this repo, make sure all dependencies are installed with ```npm i```, and run ```npm run-script start:dev```. This will make the node server automatically restart the server and re-compile the source code when changes are detected. You should now be able to find the dashboard at localhost:3000/dashboard and the bibliography visualization at localhost:3000/bibviz.

# Tour
The backend is a node server using the ExpressJS framework for routing and middleware. Look in app.js or dashboardRouter.js to find the majority of the backend processing. The dashboard assumes that a mysql 8

The function ```res.render``` will look in the ```views``` folder for a pug template file, which is basically HTML, but with python-esque whitespace delimiting instead of closing tags. The dashboard and bibviz template files will include a 'bundle' javascript located in ```public/javascripts```. These are the compiled scripts, and are not meant to be edited. To make changes, spin the server up in dev mode (```npm run-script start:dev```) and edit the source files in the ```src``` folder. They will automatically be re-compiled, minified, transpiled, and bundled by Webpack (and Babel).

The Bibliography Visualization uses THREE.js for WEBGL rendering.

The Dashboard frontend is done in a React style, with Bootstrap styling (unfortunately I hadn't adopted React early enough to decide on Reactstrap).

Everything is written in plain old Javascript, but I do make use of ES6 syntax (classes, promises). Webpack/Babel take care of the compatibility concerns there.
