import express from 'express';

import bodyParser from 'body-parser';
import {route} from './routes/api';


let app=express();





app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use('/api/v1',route);




module.exports=app.listen(process.env.PORT || 8080, function(){
  console.log('we are on port 8080');
});