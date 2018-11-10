var express=require('express');

var bodyParser=require('body-parser');
const routes=require('./routes/api');

var app=express();





app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use('/api/v1',routes);




module.exports=app.listen(process.env.port || 3000, function(){
  console.log('we are on prot 3000');
});
