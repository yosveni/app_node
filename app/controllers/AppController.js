const router = require('express').Router();
var Parse = require('parse/node');
const config = require('../../config/config');

Parse.initialize(config.name);
Parse.serverURL = config.database;
var ProfileBasic = Parse.Object.extend("ProfileBasic");



 /*Index Page */
 router.get('/index', function(req,res) {    
    // res.render('index.html');
    res.sendFile(path.join(__dirname+'app/public/dist/index.html'));
 });

//get users data
router.get('/profiles',(req,res,next)=>{  
        var query = new Parse.Query(ProfileBasic);  
        var arr_json = [];
       query.find().then(function(results){
           //console.log(results.length);
        for (var i = 0; i < results.length; i++) {       
          //console.log(results[i].get("currentLocation")._latitude);     
            arr_json.push({
                'id':results[i].id,
                'name':results[i].get("displayName"),
                'photo':results[i].get("profilePhoto"),
               'lat':results[i].get("currentLocation")._latitude,
                'lng':results[i].get("currentLocation")._longitude,
            })
           
        }
        //console.log(arr_json);
        res.send(arr_json);  
       });
      
    });

module.exports = router;

