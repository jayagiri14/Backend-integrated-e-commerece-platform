const express = require('express');
const Owner = require('../models/owner-model.js');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt=require("jsonwebtoken")
// Get all owners
router.get('/', async (req, res) => {
    try {
        const owners = await Owner.find();
        res.render("master")
    } catch (error) {
        res.status(500).json({ message: "Error fetching owners", error: error.message });
    }
});


router.post('/register',  (req, res) => {
    try {
        let { name, email, password } = req.body;
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
                    const newOwner = new Owner({ name, email, password });
                    const savedOwner = await newOwner.save();
                    let token=jwt.sign({email,id:newOwner._id},"secret")
                                        res.cookie("token",token)
                                        res.redirect("/")
                    
                } catch (err) {
                    res.status(500).json({ message: "Error saving owner", error: err.message });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating owner", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(401).json({ message: "Invalid email" });
        }
        else{
             bcrypt.compare(password,owner.password,(err,result)=>{
                    if(result){
                        let token=jwt.sign({email,id:owner._id},"secret")
                        res.cookie("token",token)
                        res.redirect("/product")
                    }
                    else{
                        res.send("Invalid credentials") 
                    }
                })
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

module.exports = router;

