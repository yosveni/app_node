const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();
//const routes = require('./routes');
const app_controller = require('./app/controllers/AppController');
//var __ = require('lodash');




//new Parse.Query(ProfileBasic);

//settings
app.set('port',process.env.PORT ||3000);
app.engine('html',require('ejs').renderFile);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'./app/views'));


//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


//static files
app.use(express.static(path.join(__dirname,'./app/public/dist')));

//routes
//app.use(routes);  app\public\dist\frontend
 // Load the routes.
//app.use('/app',app_controller);
 app.use('/app',app_controller);



//start server
app.listen(app.get('port'),()=>{
    console.log('Server on',app.get('port'));
});