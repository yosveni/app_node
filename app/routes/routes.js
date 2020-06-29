const router = require('express').Router();

router.get('/',(req,res,next)=>{
    res.render('index.html');
});

/*router.get('/cats',(res,res,next)=>{
    res.send({
        cats: [{ name: 'lilly' }, { name: 'lucy' }]
      });
});*/


module.exports = router;
