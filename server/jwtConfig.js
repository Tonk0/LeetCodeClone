const JWT_COOKIE_CONFiG = {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
  maxAge: 3*24*60*60*1000
}
const JWT_SECRET = process.env.JWT_KEY || 'your_jwt_key';
const JWT_EXPIRES_IN = '3d';

module.exports = {
  JWT_COOKIE_CONFiG,
  JWT_SECRET,
  JWT_EXPIRES_IN
}