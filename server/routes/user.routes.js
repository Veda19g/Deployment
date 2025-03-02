const express = require("express");
const {createUser,loginUser,updateUser,getUser}=require("../controllers/user.controller");
const {authMiddleware}=require("../middlewares/auth.middleware");
const router=express.Router();
router.post("/create",createUser);
router.post("/login",loginUser);
router.post("/update",authMiddleware,updateUser);
router.get("/get-details",authMiddleware,getUser);

module.exports=router;