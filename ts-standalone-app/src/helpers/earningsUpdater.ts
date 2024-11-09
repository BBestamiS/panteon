import { getRandomPlayers, updatePlayerBalance } from '../db.js';
import logger from '../logger.js';

export async function updateWeeklyEarningsForPlayers() {
  try {
    const players = await getRandomPlayers(100);
    for (const player of players) {
      const randomEarnings = Math.floor(Math.random() * 100) + 1;
      await updatePlayerBalance(player.id, randomEarnings);
      logger.info(`Increased balance for Player ${player.id} by ${randomEarnings}`);
    }
  } catch (error) {
    logger.error('Error updating weekly earnings: ' + (error as Error).message);
  }
}
