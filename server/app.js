const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const cookieParser = require('cookie-parser');

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));



app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);  

module.exports = app;
