const query = require("../db/db");
const jwt = require('jsonwebtoken');
const JWT_COOKIE_CONFiG = {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
  maxAge: 3*24*60*60*1000
}
const JWT_SECRET = process.env.JWT_KEY || 'your_jwt_key';
const JWT_EXPIRES_IN = '3d';
const register = async (req, res) => {
  const {login, email, password} = req.body;
  const isLoginExists = (await query('SELECT * FROM Users WHERE username = $1', [login])).rowCount > 0;
  if (isLoginExists) {
    return res.status(401).json({message: 'Пользователь с таким логином уже существует'});
  }
  const isEmailExists = (await query('SELECT * FROM Users WHERE email = $1', [email])).rowCount > 0;
  if (isEmailExists) {
    return res.status(401).json({message: 'Пользователь с такой почтой уже существует'})
  }
  // add user to database
  await query('INSERT INTO Users (email, username, pass_hash) VALUES ($1, $2, $3)', [email, login, password]);

  // create jwt 
  const token = jwt.sign(
    {login, email},
    JWT_SECRET,
    {expiresIn: JWT_EXPIRES_IN}
  )
  // set cookies in res
  res.cookie('token', token, JWT_COOKIE_CONFiG)
  res.status(201).json({message: 'Пользователь успешно создан'})
}
const login = async (req, res) => {
  const {login, password} = req.body;
  const user = (await query('SELECT * FROM Users WHERE username = $1', [login])).rows[0];
  if (!user) {
    return res.status(401).json({message: 'Пользователя с таким логином не существует'});
  }
  if (password !== user.pass_hash) {
    return res.status(401).json({message: 'Неверный пароль'});
  }
  const token = jwt.sign(
    {login, email: user.email},
    JWT_SECRET,
    {expiresIn: JWT_EXPIRES_IN}
  )
  res.cookie('token', token, JWT_COOKIE_CONFiG)
  res.status(200).json({message: 'OK'});
}
const check = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({message: 'Отсутствуют cookie'});
  }
  jwt.verify(token, JWT_SECRET, (err) => {
    if(err) {
      return res.status(401).json({message: 'Неверный jwt'});
    }
  })
  res.status(200).json({message: 'OK'});
}
module.exports = {
  register,
  login, 
  check
}
