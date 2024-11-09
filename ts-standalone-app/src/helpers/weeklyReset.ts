import { getLatestWeek, addNewWeek, clearWeeklyEarnings, distributeWeeklyPrizePool } from '../db.js';
import { getCurrentWeekNumber } from '../utils/weekHelper.js';
import logger from '../logger.js';

export async function weeklyReset(): Promise<boolean> {
  try {

    const cDate = new Date();
    const currentDate = cDate.toISOString().split('T')[0];
    cDate.setDate(cDate.getDate() - 7);
    const nextDate = cDate.toISOString().split('T')[0];
    const latestWeek = await getLatestWeek();
    
    // Eğer weeks tablosunda hiç kayıt yoksa veya yeni bir haftaya geçmişsek, haftalık işlemleri başlat
    if (!latestWeek) {
      logger.info('No existing week found. Initializing the first week entry.');
      
      // İlk haftayı weeks tablosuna ekle
      await addNewWeek(nextDate);
      logger.info(`First week added to weeks table with date: ${nextDate}`);
      return true; // İlk hafta kaydı yapıldı, başka işlem yapılmasına gerek yok.
    }
    // Eğer yeni bir haftaya geçilmişse haftalık işlemleri yap
    if (latestWeek <= nextDate) {
      logger.info(`New week detected. Latest week in database: ${latestWeek}, current week: ${nextDate}`);

      await distributeWeeklyPrizePool();

      // Weekly earnings tablosunu temizle
      await clearWeeklyEarnings();

      // Yeni haftayı weeks tablosuna ekle
      await addNewWeek(currentDate);

      logger.info(`Weekly reset and archiving process completed for week ${getCurrentWeekNumber()}`);
      return true;
    } else {
      logger.info('No weekly reset needed, still in the current week.');
      return false;
    }
  } catch (error) {
    logger.error('Error during weekly reset: ' + (error as Error).message);
    throw error;
  }
}
