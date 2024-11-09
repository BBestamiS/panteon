
import logger from './logger.js';
import { weeklyReset } from './helpers/weeklyReset.js';
import { updateWeeklyEarningsForPlayers } from './helpers/earningsUpdater.js';
import { syncPlayersToRedis } from './helpers/redisSync.js';
import { getCurrentWeekNumber } from './utils/weekHelper.js';

async function main() {
  while (true) {
    try {
      const isNewWeek = await weeklyReset();

      if (isNewWeek) {
        logger.info(`New week detected. Week ${getCurrentWeekNumber()} started.`);
      }

      // Haftalık kazançları güncelle
      await updateWeeklyEarningsForPlayers();
      await syncPlayersToRedis();

      // 5 saniye bekle
      logger.info('Waiting for 5 seconds before the next iteration.');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      logger.error('Error in main process: ' + (error as Error).message);
      // Hata oluştuğunda 5 saniye bekleyip tekrar dene
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

// Uygulamayı çalıştır
main().catch((error) => {
  logger.error('Unexpected error in main:', error);
});