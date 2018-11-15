import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app' ;
chai.use(chaiHttp);
let expect =chai.expect;
let should =chai.should();

//id and data kept here for reference through out
let id;
let data;

//test get welcome message routes
describe("test for welcome route",()=>{
  it("should return a string ",(done)=>{
    chai.request(server).get('/api/v1').end((req,res)=>{
      res.body.should.be.equal('welcome to Gilberts API. nav to "/parcels " for all orders, post ur order to "/parcels", get all orders by a user from "/users/userName/parcels", cancel order from "/parcels/parcelID/cancel" and get specific parcel with "/parcel/parcelsID" ');
      res.should.have.status(200);
    })
    done();
  })
})

//get parcel rote test
describe(' test the get parcel route "/"parcels', ()=>{


let param='/api/v1/parcels';

    it('should respond an empty object since empty ',(done)=>{

        chai.request(server).get(param).end((err,res)=>{
            res.should.have.status(200);
            (res.body).should.be.a('array');


        })

        done();

    })

});

//test for post /parcels route
describe(' test the post parcel route /parcels', ()=>{


let param='/api/v1/parcels';
//default values kept in array to be used to simulate multiple post requests
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

    it('should respond with status 201 showing order has been created and a json of what I sent and must generate id for each parcel',(done)=>{
//post each data in array above to the post parcel route and ensure the response is json of the post
      data.forEach(x=>{
          chai.request(server).post(param).send(x).end((err,res)=>{
            res.should.have.status(201);
            (res.body).should.be.a('object');
            id=res.body.id;
            (res.body).should.have.property('pickup_location');
            (res.body).should.have.property('id');
          });
      });

            done();

        })

});

// test for the get parcel with Parcel  ID
describe(' test the get route "/parcels/:parcelsId" ', ()=>{


let param='/api/v1/parcels/:parcelId';

    it('should respond with status 404 if ID not found and return not found message',(done)=>{

        chai.request(server).get(param).end((err,res)=>{
            res.should.have.status(404);
            (res.body).should.be.a('object');
            res.body.value.should.equal('not found');

        })

        done();
    })


    it('should give status of 200 if ID found and return the order data',(done)=>{
        chai.request(server).get('/api/v1/parcels/'+id).end((err,resp)=>{
          resp.should.have.status(200);
          resp.body.should.be.a('object');
          resp.body.should.have.property('id');

        })
        done();

    })


});

// test  for the get parcels of a user route.
describe(' test the get route "/users/:userId/parcels" ', ()=>{


let param='/api/v1/users/:userId/parcels';

    it('should respond with status 404 if user not found and return a "not found " message',(done)=>{

        chai.request(server).get(param).end((err,res)=>{
            res.should.have.status(404);
            (res.body).should.be.a('object');
            res.body.value.should.equal('not found');

        })
        done();
    })


    it('should return the parcels ordered by user if user id is found',(done)=>{

      //randomly select an object/order from the array data above for querry test of userName
      let order=data[Math.floor((Math.random()*5))];
      //querry the user name of the order/object gotten above to see if we get all orders made by the user
      chai.request(server).get('/api/v1/users/'+order.name+'/parcels').end((err,res)=>{
      //  console.log(res.body);
        console.log(order.name);
        res.should.have.status(200);
        res.should.be.a('object');
        //ensure that we get at least one parcel order since user is expected to be in database
        res.body.should.have.property('0');
      })
      done();
    })


});

//test the route for get parcels to return all orders in database/structure
  describe("testing the route get 'api/parcels' ",()=>{
    it('should be able to produce orders in the database ',(done)=>{
        chai.request(server).get('/api/v1/parcels').end((err,res)=>{
          res.body.should.have.property("0");
          res.should.have.status(200);
          id=res.body[3].id;
          res.body.should.be.a('array');
          //test that all data returned are valid
          for(let i=0;i<5;i++){
              res.body[i].should.have.property('id');
              res.body[i].should.have.property('name');
            //  console.log(res.body[i]);
          }


        })
        done();
    })
  });

//test put route '/parcels/:parcelId/cancel'
  describe('testing the put route api/parcels/:parcelId/cancel',function(){
    let param='/api/v1/parcels/:parcelId/cancel';
    it('should return status 404 if parcelId not found and return a message "not found"',(done)=>{
      chai.request(server).put(param).end((err,res)=>{
        res.should.have.status(404);
        res.body.value.should.equal('not found');
      })
      done();
    })
  it('should return deleted json showing that data is deleted from database if ID is found',(done)=>{

      console.log('first '+id);
      chai.request(server).put('/api/v1/parcels/'+id+'/cancel').end((err,res)=>{
        res.body.should.be.a('array');
        res.body[0].should.have.property('id');
        //console.log(res.body);
      })
    done();


  })
  });