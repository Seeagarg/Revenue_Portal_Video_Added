const jwt=require("jsonwebtoken")
module.exports={
    auth:(req,res,next)=>{
        const BearerToken=req.headers.authorization;
        if(BearerToken){
            const token=BearerToken.split('Bearer ')[1];
            if(token){
                try{
                    const user=jwt.verify(token,process.env.JWT_SECRET);
                    console.log("header user",user);
                    req.user=user;
                    return next();

                }catch(err){
                    res.status(403).send({message:"invalid token"});
                }
            }else{
                res.status(403).send({message:"authorization token must be Bearer [token]"});
            }  
        }else{
            res.status(403).send({message:"authorization header must be provided"});   
        }
    }
}