var express=require('express');
var route=express.Router();
var db=require('../model/db.js');
  var dat=db.x();
  var i=1;

//cross origin resource sharing

/*  route.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); */

route.get('/parcels',function(req,res){
  //res.header("Access-Control-Allow-Origin", "*");
  res.status('200').json({...dat});

})

route.get('/parcels/:parcelsId',function(req,res){
    let index=0;
    let requiredIndex='unmatched';
    dat.forEach(x=>{
      if(req.params.parcelsId==x.id){
        requiredIndex=index;
      }
      index++;
    })
      if(requiredIndex==='unmatched'){
        let message={
          value:'not found'
        };
        res.status('202').send(message);
      }
      else{

          res.status('200').json(dat[requiredIndex]);
      }

})




module.exports=route;
