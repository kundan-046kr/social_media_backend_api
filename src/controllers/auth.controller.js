const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const test = (req, res)=>{
    res.json({
        message: "Server is working"
    })
}


const signup = async (req, res) => {
    const {name, email, password} = req.body
    
    if(!name || !email || !password){
        return res.status(400).json({
            error: "All fields are required"
        })
    }
    if(password.length < 6){
        return res.status(400).json({
            error: "password must have atleast 6 characters"
        })
    }

    try {
        const emailLower = email.toLowerCase()

        const existingUser = await User.findOne({email: emailLower})

        if(existingUser){
            return res.status(400).json({
                error: "User already exists with the provided email"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email: emailLower,
            password: hashedPassword,
        })

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error: "Something went wrong"
        })
    }
}

const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({
            error: "All fields are required"
        })
    }
    
    try {
        const emailLower = email.toLowerCase()
        const existingUser = await User.findOne({email: emailLower})

        if(!existingUser){
            return res.status(400).json({
                error: "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)

        if(!isMatch){
            return res.status(400).json({
                error: "Invalid credentials"
            })
        }

        const token = jwt.sign({
            id: existingUser._id,
        }, process.env.JWT_SECRET, {expiresIn:'1d'})

        res.cookie("token", token)

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
            }
        })
    } catch (error) {
        console.log("error ", error.message)
        res.status(500).json({
            error: "Something went wrong"
        })
    }
}

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            message: "Access granted",
            user
        });
    } catch (error) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}

module.exports = {test, signup, login, profile}