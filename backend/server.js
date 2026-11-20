const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/service', require('./routes/serviceRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));
app.use('/api/booking', require('./routes/appointmentRoutes'));
app.use('/api/notification', require('./routes/notificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
    res.send('Salon Rental System API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});