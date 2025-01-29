const jwt = require('jsonwebtoken');
const CustomError = require("../middlewares/CustomError");
const User = require("../models/userModel")

const validateToken = async(req,res,next)=>{
    try{
        const getToken = req.headers.authorization || req.headers.Authorization;
        let token;

        if(getToken && getToken.startsWith("Bearer")){
            token = getToken.split(" ")[1];
        }

        if(!token){
            return next(new CustomError("No token found.",404));
        }

        const decodeToken = jwt.verify(token,process.env.SECRET_KEY);
        console.log(decodeToken);

        const findUser = await User.findById(decodeToken.id);

        if(!findUser){
            return next(new CustomError("No user found on access token.",404));
        }

        req.user = findUser;
        next();

    }catch(error){
        next(error);
    }
}

module.exports = validateToken;