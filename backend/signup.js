const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/UserModel");
const verifyToken = require("./middleware");

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

router.post("/signup", verifyToken, async (req,res) => {

    try{

        const {name,email,password} = req.body;

        let userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            id:user._id,
            name:user.name,
            email:user.email,
            token: generateToken(user._id)
        });

    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }

});


router.post("/login",verifyToken, async (req,res) => {

    try{

        const {email,password} = req.body;

        let user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        const match = await bcrypt.compare(password,user.password);

        if(!match){
            return res.status(401).json({
                message:"Invalid password"
            });
        }

        res.json({
            token: generateToken(user._id),
            user
        });

    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }

});

module.exports = router;