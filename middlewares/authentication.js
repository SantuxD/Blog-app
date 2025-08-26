const{ verifyToken } = require("../services/authentication");
function checkForAuthenticationCookie(cookieName){
    return (req,res,next) =>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            res.locals.user = null;
            return next();
    }
    try{
        const userPayload = verifyToken(tokenCookieValue);
        req.user = userPayload;
    }catch(error){
        console.error("Error verifying token:", error);
        res.locals.user = null;
    }
   return  next();
    };

}
module.exports = { checkForAuthenticationCookie };