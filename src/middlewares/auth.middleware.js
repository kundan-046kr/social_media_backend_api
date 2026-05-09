const jwt = require('jsonwebtoken');

const tokenVerification = (req, res, next) => {
    // const token = req.cookies?.token|| req.headers.authorization?.split(" ")[1];

    const authHeader = req.headers.authorization;

    const token =
        req.cookies?.token ||
        (authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null);

    if(!token){
        return res.status(401).json({
            error: "Unauthorized Access"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
        
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({
            error: "Unauthorized Access"
        });
    }
}

module.exports = {tokenVerification};