const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userDetailsRoutes');
// const verifyEmailRoutes = require('./routes/verifyEmailRoutes')
const { swaggerUi, swaggerSpec } = require('./swaggerConfig'); // Import your swagger config
const userDetailsRoutes = require('./routes/userDetailsRoutes'); 

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api',userDetailsRoutes);

// app.use('api/verifyemail' ,verifyEmailRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
