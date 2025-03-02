const jwt=require("jsonwebtoken");
require('dotenv').config();
 

function generateAccessToken(userId){
    console.log(process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign({userId:userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'30m'});
}
function generateRefreshToken(userId){
    return jwt.sign({userId:userId},process.env.REFRESH_TOKEN_SECRET);
}
function verifyToken(token,secret){
    try{
        const decoded=jwt.verify(token,secret);
        console.log(decoded);
        return decoded; 
    }catch(error){
        console.log("token verification failed",error);
    }
}
module.exports={
    generateAccessToken,
    generateRefreshToken,
    verifyToken
}