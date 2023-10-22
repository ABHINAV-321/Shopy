const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://abhi:hacker.abhi@cluster0.rfzif0y.mongodb.net/?retryWrites=true&w=majority";
var objectId=require('mongodb').ObjectId
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const bcrypt = require('bcrypt');
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});





var db=require('../Config/connection').get

module.exports={
  doAdminLogin:(Data)=>{
    return new Promise(async(resolve,reject)=>{
   //   let loginStatus=false;
   console.log('adminLogin')
      let response={}
      
     let login={}
      let admin=await client.db('shopping-cart').collection('admin').findOne({Email:Data.Email})
   //   console.log(userData)
     // console.log(user)
    if(admin){
        bcrypt.compare(Data.Password,admin.Password).then((status)=>{
          if(status){
            
            // remove it 
            
            
            
          //  console.log(status)
            response.admin=admin;
            login.status=true;
            response.login=login;
            resolve(response);
          //  console.log(resolve)
          //  console.log(response)
            console.log("Login success");
          }else{
            login.status=false;
            login.PasswordErr=true;
            login.EmailErr=false;
            response.login=login;
            console.log("login failed pswd err")
            resolve(response);
          }
        })
      }else{
        login.status=false;
        login.PasswordErr=false;
        login.EmailErr=true;
    //    response.status=false;
        response.login=login;
        resolve(response);
    //    console.log(user)
        console.log('login failed email wrong')
      }
  //    console.log("responce in user helper "+response)
    })
   }
}