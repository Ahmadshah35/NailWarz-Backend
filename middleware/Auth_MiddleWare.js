const JWT = require('jsonwebtoken');
const User = require('../models/UserModal');

const checkUserAuth = async (req, res, next) => {
  // Extract the authorization header
  const { authorization } = req.headers;


  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Bearer scheme
      const token = authorization.split(' ')[1];
      console.log("token",token)
      if (!token) {
        return res.send({ success: false, message: "Token not found" });
      }

      // Verify the token
      const { _id } = JWT.verify(token, process.env.secretKey);

      
      // Get the user from the token
      req.user = await User.findById(_id).select('-password');
      
      // Call the next middleware
      next();
    } catch (err) {
      console.error('Error verifying token:', err.message);
      return res.send({ success: false, message: "Unauthorized access" });
    }
  } else {
    return res.send({ success: false, message: "Authorization header not found" });
  }
};

module.exports = checkUserAuth;
