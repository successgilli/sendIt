
var chai=require('chai');
var chaiHttp=require('chai-http');
var expect=require('chai').expect;
var should=require('chai').should();
let server=require('../app');
chai.use(chaiHttp);
var id;
var data;
//get parcel
describe(' test the get parcel route "/"parcels',  function(){


let param='/api/v1/parcels';

    it('should respond an empty object since empty ',(done)=>{

        chai.request(server).get(param).end((err,res)=>{
            res.should.have.status(200);
            (res.body).should.be.a('object');
            done();

        })


    })

});

//post test
describe(' test the post parcel route /parcels',  function(){


let param='/api/v1/parcels';
 data=[
  {
    name:'gilbert',
    item:'girls',
    pickup_location:'ikorodu'
  },
  {
    name:'edwin',
    item:'eggs',
    pickup_location:'cape town'
  },
  {
    name:'edwin',
    item:'men',
    pickup_location:'star city'
  },{
    name:'gilbert',
    item:'knife',
    pickup_location:'kano'
  },
  {
    name:'gilbert',
    item:'buns',
    pickup_location:'Ph city'
  }
];

    it('should respond with a json of what I sent and must generate id for each parcel',(done)=>{
      data.forEach(x=>{
          chai.request(server).post(param).send(x).end((err,res)=>{
            res.should.have.status(200);
            (res.body).should.be.a('object');
            id=res.body.id;
            (res.body).should.have.property('pickup_location');
            (res.body).should.have.property('id');
          });
      });

            done();

        })

});

//get parcel with Parcel  ID
describe(' test the get route "/parcels/:parcelsId" ',  function(){


let param='/api/v1/parcels/:parcelId';

    it('should respond with status 202 if ID not found and return not found message',(done)=>{

        chai.request(server).get(param).end((err,res)=>{
            res.should.have.status(202);
            (res.body).should.be.a('object');
            res.body.value.should.equal('not found');

        })

        done();
    })


    it('should give status of 200 if ID found and return the order data',(done)=>{
        chai.request(server).get('/api/v1/parcels/' + id).end((err,resp)=>{
          resp.should.have.status(200);
          resp.body.should.be.a('object');
          resp.body.should.have.property('id');

        })
        done();

    })


});

//get parcels of a user.
describe(' test the get route "/users/:userId/parcels" ',  function(){


let param='/api/v1/users/:userId/parcels';

    it('should respond with status 202 if user not found and return a "not found " message',(done)=>{

        chai.request(server).get(param).end((err,res)=>{
            res.should.have.status(202);
            (res.body).should.be.a('object');
            res.body.value.should.equal('not found');

        })
        done();
    })


    it('should return the parcels ordered by user if user id is found',(done)=>{


      let order=data[Math.floor((Math.random()*5))];

      chai.request(server).get('/api/v1/users/'+order.name+'/parcels').end((err,res)=>{
      //  console.log(res.body);
        console.log(order.name);
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('0');
      })
      done();
    })


});

//test route get parcels
describe("testing the route get 'api/parcels' ",function(){
  it('should be able to produce orders in the database ',(done)=>{
      chai.request(server).get('/api/v1/parcels').end((err,res)=>{
        res.body.should.have.property("0");
        res.should.have.status(200);
        id=res.body[3].id;
        res.body.should.be.a('object');
        for(i=0;i<5;i++){
            res.body[i].should.have.property('id');
            res.body[i].should.have.property('name');
          //  console.log(res.body[i]);
        }


      })
      done();
  })
});

//test put route '/parcels/:parcelId/cancel'
describe('testing the put route "api/parcels/:parcelId/cancel" ',function(){
  let param="api/v1/parcels/:parcelId/cancel";
  it('should return status 202 if parcelId not found and return a message "not found"',(done)=>{
    chai.request(server).put(param).end((err,res)=>{
      res.should.have.status(202);
      res.body.value.should.equal('not found');
    })
    done();
  })
it('should return status 200 showing the order has been deleted from the database if ID is found',(done)=>{

    console.log('first '+id);
    chai.request(server).put('api/v1/parcels/'+id+'/cancel').end((err,res)=>{
      res.should.have.status(220);
      res.body.should.be.a('object');

    })
  done();


})
});