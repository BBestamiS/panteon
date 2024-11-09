import { RowDataPacket } from 'mysql2';
import redisClient from '../redisClient.js';
import { createConnection } from '../db.js';
import logger from '../logger.js';

export async function syncPlayersToRedis(): Promise<void> {
  const connection = await createConnection();

  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT 
         p.id AS player_id,
         p.name AS player_name,
         c.country_name AS country,
         p.balance AS balance,
         we.earnings AS earnings
       FROM 
         leaderboard_db.weekly_earnings we
       JOIN 
         leaderboard_db.players p ON we.player_id = p.id
       JOIN 
         leaderboard_db.countries c ON p.country_id = c.id
       WHERE 
         we.redis_status = 0
       ORDER BY 
         we.earnings DESC`
    );

    const redisKey = 'leaderboard';

    for (const row of rows) {
      const { player_id, player_name, country, balance, earnings } = row;

      await redisClient.zadd(redisKey, earnings, player_name);

      await redisClient.hset(`player_id:${player_name}`, 'player_id', player_id.toString());

      const hashKey = `player:${player_id}`;
      await redisClient.hset(hashKey, {
        player_id: player_id.toString(),
        player_name,
        country,
        balance: balance.toString(),
        earnings: earnings.toString()
      });

      await connection.execute(
        `UPDATE leaderboard_db.weekly_earnings SET redis_status = 1 WHERE player_id = ?`,
        [player_id]
      );

      logger.info(`Synchronized player ${player_name} (ID: ${player_id}) with earnings ${earnings} to Redis.`);
    }

    logger.info('All unsynced records have been synchronized to Redis.');
  } catch (error) {
    logger.error('Error syncing players to Redis:', error);
    throw error;
  } finally {
    await connection.end(); 
  }
}
