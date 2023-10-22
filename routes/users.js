var express = require('express');
var router = express.Router();
var productHelper =require('../helpers/Product-helpers')
var userHelper = require('../helpers/user-helpers.js')
var login={};
const loginCheck=(req, res, next)=>{
if(req.session.user){
  next();
  }
  else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user= req.session.user
 // let cartCount=0
 if(user){
cartCount= await userHelper.getCartCount(user._id)
productHelper.getAllProducts().then((product)=>{

  res.render('./user/view-user-product', { product,admin:false,user,cartCount});
}); 

 }else{


productHelper.getAllProducts().then((product)=>{

  res.render('./user/view-user-product', { product,admin:false,user});
}); 
}
});
router.get('/login',(req, res)=>{
  
  res.render('./user/login',{"EmailErr":login.EmailErr,"PasswordErr":login.PasswordErr});
  
})
router.get('/signup',(req, res)=>{
  res.render('./user/Signup');
})
router.post('/signup',(req, res)=>{
  userHelper.doSignup(req.body).then((response)=>{
   //   console.log(req.body)
   console.log(response)
   
   req.session.user=req.body
  req.session.userloggedIn=true;
   res.redirect('/')
  })
})
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
//console.log("redponse="+response)
login =response.login

    if(response.login.status){
      
      req.session.user=response.user
      req.session.userloggedIn=true;
    
    // console.log("working")
     res.redirect ('/')
    }else{
      res.redirect('/login')
    
    }
  })
})
router.get('/logout',(req, res)=>{
  req.session.user=null
  req.session.userloggedIn=false
  res.redirect('/login')
})
router.get('/cart',loginCheck,async(req, res)=>{
let cartCount=0
//console.log('cart')
if(req.session.user){
cartCount= await userHelper.getCartCount(req.session.user._id)}
  let products=await userHelper.getCartProducts(req.session.user._id)
  
//  console.log(cartCount)
  let totalPrice=await userHelper.totalPrice(req.session.user._id,cartCount)
  
res.render('./user/cart',{products,user:req.session.user,totalPrice,cartCount})
})
router.get('/add-to-cart/:id',loginCheck, async (req, res)=>{
//console.log('api log')

  userHelper.addToCart(req.params.id, req.session.user._id).then(()=>{
  //  res.redirect('/')
  res.json({status:true})
  })
})
router.get('/sub/',async(req, res)=>{
  
let total= await userHelper.totalPrice(req.session.user._id,req.params.id)
userHelper.decCartItem(req.query.id,req.query.Qty,req.session.user._id).then(()=>{
  res.json({status:true,total})
})
  
})
router.get('/add/:id',async (req, res)=>{
//  console.log("post "+req.body)
let data=req.body;
console.log(req.params.id)

//console.log("price"+totalPriceProduct)
  userHelper.addCartItem(req.params.id,req.session.user._id).then(async()=>{

let total= await userHelper.totalPrice(req.session.user._id,req.params.id)
//console.log(total)
res.json({status:true,total})
   // console.log(data)
  })
})
router.get('/remove/',async(req, res)=>{
 // console.log('f ok')
  id=req.query.id
  productHelper.removeCartProduct(req.session.user._id,id).then(()=>{
    res.redirect('/cart' )
console.log('removed')
  })

  
})
router.get('/order/',loginCheck,async (req, res)=>{
 let products=await userHelper.getCartProducts(req.session.user._id)
  let totalPrice=await userHelper.totalPrice(req.session.user._id)
  
cartCount= await userHelper.getCartCount(req.session.user._id)
  
  
  res.render('./user/place-order',{products,totalPrice,cartCount,user:req.session.user})
})

router.post('/place-order',async(req, res)=>{
 // console.log(req.body)
 let product=await userHelper.getCartProductsList(req.body.userId)
 
  let orderDetails= await userHelper.getOrderDetails(req.session.user._id)
 let totalPrice=await userHelper.totalPrice(req.body.userId)
  userHelper.placeOrder(req.body,product,totalPrice).then((respons)=>{
   console.log(req.body.paymentMethod)
    if(req.body['paymentMethod']=="COD"){
      console.log('pay')
      res.json({status:true})
   // res.json({cod:true})
   }
    else{
userHelper.generateRazorPay(orderDetails._id,totalPrice).then((response)=>{
  res.json({response})
})
      
    }
 })
})
router.get('/place-order/success',(req, res)=>{
  res.render('./user/order-success')
})
router.get('/orders',loginCheck,async(req,res)=>{
let orders=await userHelper.getUserOrders(req.session.user._id)
//console.log(orders)
  res.render('./user/orders',{user:req.session
  .user,orders})
})
router.get('/orders/product/:id',loginCheck,async(req, res)=>{
let  proId=req.params.id
  let product = await userHelper.getProduct(proId)
  let orderDetails= await userHelper.getOrderDetails(req.session.user._id)
  
  
  res.render('./user/product-details',{user:req.session.user,product,orderDetails})
//  console.log(orderDetails,product)
})
router.post('/verify-payment',loginCheck, (req, res)=>{
  console.log("verifyPayment")
 // console.log(req.body)
  userHelper.verifyPayment(req.body).then(()=>{
    userHelper.changePaymentStatus(req.body.receipt).then(()=>{
      console.log('place order')
      res.json({status:true})
    })
  }).catch((err)=>{
    console.log(err)
    res.json({status:false})
  }) 
})
module.exports = router;
