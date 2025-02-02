const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user-model');
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const Product=require("../models/product-model")


const isLoggedIn=async (req,res,next)=>{
    try{
        let token=req.cookies.token
        // console.log(token)
        if(!token){
            return res.redirect('/')
        }
        
        let decoded=jwt.verify(token,"secret")
        let user=await User.findOne({email:decoded.email}).select("-password")//excluding the password
        req.user=user
        next() 
    }
    
  
    catch(err){
        res.redirect("/")
    }
}


router.get("/userpage",isLoggedIn,async(req,res)=>{
    let products=await Product.find()
    // console.log(products)

    res.render("shop",{products})
  
})

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render("index")
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

router.get("/cart",isLoggedIn,async (req,res)=>{
    let user = await User.findOne({email: req.user.email}).populate('cart'); //note here we are populating the cart field this simply means that we first had the ids in the model but now we are getting the whole product object remember that reference id has to be given in the user model under the cart
    let cart=user.cart
    res.render("cart",{cart})
})

router.get("/cart/:id",isLoggedIn,async (req,res)=>{
    let id=req.params.id
    let product=await Product.findById(id)
    let user=req.user
    user.cart.push(product._id)
    await User.findByIdAndUpdate(user._id, { cart: user.cart });
    res.redirect("/user/userpage")
    
})


router.get("/add/:id",isLoggedIn,async (req,res)=>{
    let user=req.user;
    let id=req.params.id
    let product=await Product.findById(id)

})
router.get("/plus/:id",isLoggedIn,async (req,res)=>{
    let user=req.user;
    let id=req.params.id
    let product=await Product.findById(id)
    

})
router.post('/register',  async (req, res) => {

    try {
        let { fullName, email, password } = req.body;  // Changed from fullname to fullName


        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user=await User.find({email:email})
        if(user.length>0){
            return res.status(401).send("User already exists")
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json({ message: 'Error generating salt', error: err.message });
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ message: 'Error hashing password', error: err.message });
                }
                password = hash;
                try {
                    const newUser = new User({
                        fullName: fullName,  // Matches schema field name
                        email: email,
                        password: password
                    });

                    const savedUser = await newUser.save();
                    let token=jwt.sign({email,id:newUser._id},"secret")
                    res.cookie("token",token)
                    res.render("index")

                    // res.status(201).json(savedUser);
                }
                catch (error) {
                    res.status(500).json({ message: "Error registering user", error: error.message });
                }

            });
        });

    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

router.post("/login",async (req,res)=>{
    let{email,password}=req.body
    let user=await User.findOne({email:email})

    if(!user){
        return res.status(401).send("User does not exist")
    }
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token=jwt.sign({email,id:user._id},"secret")
            res.cookie("token",token)
            res.redirect("/user/userpage");
        }
        else{
            res.send("Invalid credentials") 
        }
    })

})



module.exports = router;