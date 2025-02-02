// //requir express router
// const express = require('express');
// const router = require('express').Router();
// const productmodel = require("../models/product-model")
// const User = require('../models/user-model'); 
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser'); 
// //middleware for isLoggedIn
// const isLoggedIn=async (req,res,next)=>{
//     try{
//         let token=req.cookies.token
//         // console.log(token)
//         if(!token){
//             return res.redirect('/')
//         }
        
//         let decoded=jwt.verify(token,"secret")
//         let user=await User.findOne({email:decoded.email}).select("-password")//excluding the password
//         req.user=user
//         next() 
//     }
    
  
//     catch(err){
//         res.redirect("/")
//     }
// }


// module.exports = router;