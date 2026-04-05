require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./src/routes/authRoutes');
const questionnaireRoutes = require('./src/routes/questionnaireRoutes');
const verifyRoutes = require('./src/routes/verifyRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const gamificationRoutes = require('./src/routes/gamificationRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/gamification', gamificationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});