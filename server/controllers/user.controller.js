const User = require('../models/User.Model');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { generateAccessToken,generateRefreshToken } = require('../utils/auth');

const createUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        const hashedPassword=await bcrypt.hash(password,10);
        const UserResponse=await User.create({name,email,password:hashedPassword});
        const user= await User.findById(UserResponse._id).select('-password');
        res.status(201).json({message:"User created successfully",user});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:"error creating admin",error});
    }
  }

  const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const UserResponse=await User.findOne({email});
        if(!UserResponse){
            return res.status(400).json({message:"User not found"});
        }
        const validPassword=await bcrypt.compare(password,UserResponse.password);
        if(!validPassword){
            return res.status(400).json({message:"invalid password"});
        }
        const accessToken=generateAccessToken(UserResponse._id);
        const refreshToken=generateRefreshToken(UserResponse._id);
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            sameSite:'None',
            secure:true
        });
        res.cookie('accessToken',accessToken,{
            httpOnly:true,
            sameSite:'None',
            secure:true
        });
        const user= await User.findById(UserResponse._id).select('-password');
        res.status(200).json({message:"login successful",user});
    }
    catch(error){
  
        res.status(500).json({message:"an error occured",error:error.message});
    }
  }  

  const updateUser=async(req,res)=>{
    const userId=req.userId;
    const {bio,phone,website,twitter,github,linkedin,goggle_scholar_id,research_gate_id,orcid_id,institution,department,position,publications,interests,disciplines,research_areas}=req.body;
    try{
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const updatedUser=await User.findByIdAndUpdate(user._id,{
            bio:bio || user.bio,
            phone:phone || user.phone,
            website:website || user.website,
            twitter:twitter || user.twitter,
            github:github || user.github,
            linkedin:linkedin || user.linkedin,
            goggle_scholar_id:goggle_scholar_id || user.goggle_scholar_id,
            research_gate_id:research_gate_id || user.research_gate_id,
            orcid_id:orcid_id || user.orcid_id,
            institution:institution || user.institution,
            department:department || user.department,
            position:position || user.position,
            publications:publications || user.publications,
            interests:interests || user.interests,
            disciplines:disciplines || user.disciplines,
            research_areas:research_areas || user.research_areas
        },{new:true});
    }catch(error){
        console.log(error);
        res.status(400).json({message:"error updating user",error});
    }
  }
  const getUser=async(req,res)=>{
    const userId=req.userId;
    try{
        const user=await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({user});
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:"error getting user",error});
    }
    }

  module.exports = {
    createUser,
    loginUser,
    updateUser,
    getUser
  }

