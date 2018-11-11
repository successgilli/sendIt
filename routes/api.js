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

route.get('/',function(req,res){
  let message={
    value: 'welcome to Gilberts API. nav to "/parcels " for all orders, post ur order to "/parcels", get all orders by a user from "/users/userName/parcels", cancel order from "/parcels/parcelID/cancel" and get specific parcel with "/parcel/parcelsID" '
  };
  res.status('200').send(message.value);
})

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
        res.status('404').send(message);
      }
      else{

          res.status('200').json(dat[requiredIndex]);
      }

})

route.get('/users/:userId/parcels',function(req,res){
  let tempData=[ ];
  let found='no';
  dat.forEach(x=>{
    if(x.name==req.params.userId){
      tempData.push(x);
      found='yes';
    }
  })
  if(found==='yes'){
    res.status('200').send({...tempData});
  }else{
    let message={
      value:'not found'
    };
    res.status('404').send(message);

  }

})

route.put('/parcels/:parcelId/cancel',function(req,res){
  let index=0;
  let cancelIndex='unmatched';
  dat.forEach(x=>{
    if(req.params.parcelId==x.id){
      cancelIndex=index;
    }
    index++;
  });
  if(cancelIndex ==='unmatched'){
    let message={
      value:'not found'
    };
      res.status('404').send(message);
  }
  else{
    let tempdata=[];
    tempdata.push(dat[cancelIndex]);
    dat.splice(cancelIndex,1);
    res.status('200').json({...tempdata});
  }


})

route.post('/parcels',function(req,res){

  var x=req.body;
  x.id=Math.floor((Math.random()*10000000+i));
  dat.push(x);
  i++;
  res.status('201').json(req.body);

})





module.exports=route;
