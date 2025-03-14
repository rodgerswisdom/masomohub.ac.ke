const User = require('../models/user_model');
// const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class Auth{
  
    static async signup(req, res){
   
        const {f_name, l_name, email, password, major, role} = req.body; 
        
        let hashedPassword = await bcrypt.hash(password,10);
        
        let user =  await User.findOne({email});

        if(user){
            return res.status(400).send("User already Exists");
        } else{
            try{
                const user = new User({
                    f_name,
                    l_name,
                    email,
                    password: hashedPassword,
                    major,
                    role 
                })

            const response = await user.save();
            res.status(201).json({message: `Sign up successful: ${response}`});
            }catch(e){
                res.status(500).json({e: 'Registration Failed'});
                console.error(e);
            }
        }
    }

    /**
     * JWT token is generated when user logs
     * in and is used to authenticate the user 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async login(req, res){
        try{
            const {email, password} = req.body;

            let user =  await User.findOne({email});

            if(!user){
                return res.status(401).send("You dont have an account. Sign up");
            } 

            let comparePassword = await bcrypt.compare(password, user.password);

            if(!comparePassword){
                res.status(401).json({error:"Wrong Password"});
            }

            const token = jwt.sign({user_id:user._id}, 'my_secret', {expiresIn:60*60});
            
            res.status(200).json({token});
        } catch(e){
                res.status(500).json({error:"Login failed"});
        }
        
    }

}

module.exports = Auth;
