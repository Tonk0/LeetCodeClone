require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use('/auth', authRoutes)

app.listen(port || 3000, () => {
  console.log('✅ server is running on ' + port)
})