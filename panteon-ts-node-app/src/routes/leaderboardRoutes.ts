import { Router } from 'express';
import { getLeaderboardWithUser } from '../controllers/leaderboardController.js';

const router = Router();

router.get('/leaderboard', getLeaderboardWithUser);

export default router;
