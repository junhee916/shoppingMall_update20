const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    try{
        // token header 유무
        const token = req.headers.authorization.split(' ')[1];
        // token 검증
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.userData = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            msg : 'Auth failed'
        })
    }
}
