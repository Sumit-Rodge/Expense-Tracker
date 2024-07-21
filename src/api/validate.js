const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const auth =  (req,res,next) => {
    console.log(req.cookies)
    // if(!token){
    //     res.sendStatus(401);
    //     console.log("cookie dosn't exist")
    // }
    // res.status(200);
    return next();
    // try {
    //     const data = jwt.verify(token,process.env.SECRET_KEY);
    //     req.user=data;
    //     res.send(data);
    //     res.status(200);
    //     next();  
    // } catch (error) {
    //     console.log(error);
    //     res.sendStatus(401);
    // }
}

module.exports = auth;