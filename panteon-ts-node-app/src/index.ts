import express from 'express';
import dotenv from 'dotenv';
import playersRoute from './routes/players.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import logger from './logger.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});


app.use(express.json());

app.use('/players', playersRoute);
app.use('/api', leaderboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
