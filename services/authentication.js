const JWT = require('jsonwebtoken');

const secret = "your_jwt_secret_key"; // Replace with your actual secret key
function createToken(user) {
    const payload = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };
    return JWT.sign(payload, secret, { expiresIn: '1h' });
}
 function verifyToken(token) {
    const  payload = JWT.verify(token, secret);
    return payload;
 }

 module.exports = {
    createToken, verifyToken}

