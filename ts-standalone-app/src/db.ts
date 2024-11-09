import mysql, { RowDataPacket } from 'mysql2/promise';
import config from './config.js';
import { Player } from './types.js';
import logger from './logger.js';
import redisClient from './redisClient.js';

export async function createConnection() {
  const connection = await mysql.createConnection(config.db);
  logger.info('Database connection established.');
  return connection;
}

// Son hafta verisini getirir
export async function getLatestWeek(): Promise<string | null> {
  const connection = await createConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(`SELECT DATE_FORMAT(week_start, '%Y-%m-%d') AS week_start FROM weeks ORDER BY week_start DESC LIMIT 1`);
    return rows.length > 0 ? rows[0].week_start : null;
  } catch (error) {
    logger.error('Error fetching latest week from weeks table: ' + (error as Error).message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Yeni hafta verisi ekler
export async function addNewWeek(date: string): Promise<void> {
  const connection = await createConnection();
  try {
    await connection.execute(`INSERT INTO weeks (week_start) VALUES (?)`, [date]);
    logger.info(`New week added with date: ${date}`);
  } catch (error) {
    logger.error('Error adding new week: ' + (error as Error).message);
    throw error;
  } finally {
    await connection.end(); 
  }
}

// Rastgele oyuncular getirir
export async function getRandomPlayers(limit: number = 10): Promise<Player[]> {
  const connection = await createConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(`SELECT * FROM players ORDER BY RAND() LIMIT ?`, [limit]);
    logger.info(`Fetched ${rows.length} random players.`);
    return rows as Player[];
  } catch (error) {
    logger.error('Error fetching random players: ' + (error as Error).message);
    throw error;
  } finally {
    await connection.end(); 
  }
}

// İlk 100 oyuncuyu arşivle
export async function distributeWeeklyPrizePool(): Promise<void> {
  const connection = await createConnection();
  try {
    
    const [row] = await connection.query<RowDataPacket[]>(`
        SELECT 
            ROW_NUMBER() OVER (ORDER BY prize DESC) AS rank,
            we.player_id,
            we.earnings,
            w.id as week_id,
            CASE 
                WHEN ranking = 1 THEN w.money_pool * 0.20
                WHEN ranking = 2 THEN w.money_pool * 0.15
                WHEN ranking = 3 THEN w.money_pool * 0.10
                ELSE w.money_pool * 0.55 / 97
            END AS prize
        FROM 
            (SELECT 
                player_id,
                earnings,
                ROW_NUMBER() OVER (ORDER BY earnings DESC) AS ranking
            FROM 
                leaderboard_db.weekly_earnings
            ORDER BY 
                earnings DESC
            LIMIT 100) AS we
        JOIN 
            leaderboard_db.weeks AS w ON w.id = (SELECT id FROM leaderboard_db.weeks ORDER BY id DESC LIMIT 1)
    `);

    for (const player of row) {
      const { player_id, prize, earnings, rank, week_id} = player;
      // Oyuncunun balance değerini prize miktarı kadar artırma
      await connection.execute(
        `UPDATE players SET balance = balance + ? WHERE id = ?`,
        [prize, player_id]
      );

      const query = `INSERT INTO weekly_earnings_archive (week_id, rank, player_id, earnings, prize) VALUES (?, ?, ?, ?, ?)`;
      await connection.execute(query, [week_id, rank, player_id, earnings, prize]);

      logger.info(`Distributed prize of ${prize} to player ${player_id}`);
    }

    logger.info('All prizes have been distributed to the top 100 players.');
    logger.info('Top 100 players archived successfully.');
  } catch (error) {
    logger.error('Error archiving top 100 players: ' + (error as Error).message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Oyuncunun bakiyesini günceller
export async function updatePlayerBalance(playerId: number, amount: number): Promise<void> {
  const connection = await createConnection();
  
  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE players SET balance = balance + ? WHERE id = ?`,
      [amount, playerId]
    );


    await connection.execute(
      `INSERT INTO weekly_earnings (player_id, earnings)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE 
       earnings = earnings + VALUES(earnings),
       redis_status = 0
      `,
      [playerId, amount]
    );

    const [hasWeeklyEarningsData] =  await connection.query<RowDataPacket[]>(`SELECT player_id FROM leaderboard_db.weekly_earnings LIMIT 1`);

    if(hasWeeklyEarningsData.length > 0){
      await connection.execute(
          `UPDATE weeks 
          SET money_pool = (SELECT SUM(earnings) * 0.02 FROM leaderboard_db.weekly_earnings)
          ORDER BY id DESC
          LIMIT 1;`
      );
    }

    await connection.commit();
    logger.info(`Updated balance and weekly earnings for player ${playerId} by ${amount}`);
  } catch (error) {
    await connection.rollback();
    logger.error(`Error updating balance and weekly earnings for player ${playerId}: ` + (error as Error).message);
    throw error;
  } finally {
    await connection.end(); 
  }
}

// weekly_earnings tablosunu temizler
export async function clearWeeklyEarnings(): Promise<void> {
  const connection = await createConnection();

  try {
    await connection.execute(`TRUNCATE TABLE weekly_earnings`);
    logger.info('Weekly earnings table cleared.');

    await redisClient.del('leaderboard');
    logger.info('Redis leaderboard cache cleared.');
  } catch (error) {
    logger.error('Error clearing weekly earnings table and Redis cache: ' + (error as Error).message);
    throw error;
  } finally {
    await connection.end(); 
  }
}
