const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://abhi:hacker.abhi@cluster0.rfzif0y.mongodb.net/?retryWrites=true&w=majority";
var objectId=require('mongodb').ObjectId
// Create a MongoClient with a MongoClientOptions object to set the Stable API version


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});





var db=require('../Config/connection').get

module.exports={
  addProduct:(product, callback)=>{
 //   console.log(product)
    client.db('shopping-cart').collection('product').insertOne(product).then((data)=>{
   //  console.log(data.insertedId.toString() )
      callback(data.insertedId.toString()) 
    }) 
  }, 
  getAllProducts:()=>{
    return new Promise(async(resolve, reject)=>{
      let product=await client.db('shopping-cart').collection('product').find().toArray()
/*let productsId=await client.db('shopping-cart').collection('product').find({},{"_id":0}).toArray()*/
let id =product._id 


    resolve(product)
      
    })
  }, 
  deleteProduct:(proId)=>{
    return new Promise ((resolve, reject)=>{
      console.log(proId)
      client.db('shopping-cart').collection('product').deleteOne({_id:new objectId(proId)}).then((response)=>{
     //   console.log(response)
     resolve(response)
      })
    })
  }, 
  getProduct:(proId)=>{
    return new Promise((resolve, reject)=>{
      

    let product=client.db('shopping-cart').collection('product').findOne({_id:new objectId(proId)})
 //   console.log(product)
    resolve(product)
    })
    
  }, 
  updateProduct:(proId, proDetails)=>{
    return new Promise((resolve, reject)=>{
    console.log(proId)
    client.db('shopping-cart').collection('product').updateOne({_id:new objectId(proId)},{
      $set:{
        _id:new objectId(proId), 
        name:proDetails.name, 
        price:proDetails.price,
       category:proDetails.category,         
       des:proDetails.des
      }
    }).then((response)=>{
      resolve(response)
    })
    }) 
  }, 
  removeCartProduct:(userId, proId) =>{
    return new Promise((resolve, reject)=>{
client.db('shopping-cart').collection('cart').updateOne(
      {user:new objectId(userId)},
    {$pull:
    {products:
    {item:new objectId(proId)}
    }
    })
    resolve()
    })
  }
}