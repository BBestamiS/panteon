import { Request, Response } from 'express';
import redisClient from '../redisClient.js';
import logger from '../logger.js';

export const getLeaderboardWithUser = async (req: Request, res: Response): Promise<void> => {
  const playerName = req.query.playerName as string | undefined;

  try {
    const redisKey = 'leaderboard';

    // 1. İlk 100 oyuncuyu `ZSET`'ten al ve bilgilerini `HASH` yapısından getir
    const topPlayers = await redisClient.zrevrange(redisKey, 0, 99, 'WITHSCORES');
    const leaderboard = [];

    for (let i = 0; i < topPlayers.length; i += 2) {
      const name = topPlayers[i];
      const score = topPlayers[i + 1];

      // `player_name` kullanarak `player_id`'yi al
      const playerData = await redisClient.hgetall(`player_id:${name}`);
      const playerId = playerData.player_id;

      // `player_id` ile oyuncunun diğer bilgilerini al
      const playerDetails = await redisClient.hgetall(`player:${playerId}`);

      leaderboard.push({
        playerName: name,
        score,
        playerId: playerDetails.player_id,
        country: playerDetails.country,
        balance: playerDetails.balance,
        rank: (i / 2) + 1
      });
    }

    // 2. Aranan kullanıcı için ek bilgi al
    let userRank = null;
    let surroundingPlayers = [];

    if (playerName) {
      // Aranan kullanıcının sıralamasını bul
      const rank = await redisClient.zrevrank(redisKey, playerName);

      if (rank !== null) {
        userRank = rank + 1; 

        // Eğer kullanıcı ilk 100 içindeyse sadece ilk 100'ü döndür
        if (userRank <= 100) {
          res.json({ leaderboard, userRank });
          return;
        }

        // Aranan kullanıcının etrafındaki 3 üst ve 2 alt aralığı al
        const start = Math.max(rank - 3, 0);
        const end = rank + 2;

        const range = await redisClient.zrevrange(redisKey, start, end, 'WITHSCORES');

        for (let i = 0; i < range.length; i += 2) {
          const name = range[i];
          const score = range[i + 1];
          const currentRank = start + (i / 2) + 1; // Elde edilen sıralamayı hesapla

          // `player_name` kullanarak `player_id`'yi al
          const playerData = await redisClient.hgetall(`player_id:${name}`);
          const playerId = playerData.player_id;

          // `player_id` ile oyuncunun diğer bilgilerini al
          const playerDetails = await redisClient.hgetall(`player:${playerId}`);

          surroundingPlayers.push({
            playerName: name,
            score,
            playerId: playerDetails.player_id,
            country: playerDetails.country,
            balance: playerDetails.balance,
            rank: currentRank // Sıralama değeri
          });
        }
      }
    }

    // Yanıtı döndür
    res.json({
      leaderboard,
      userRank,
      surroundingPlayers
    });
  } catch (error) {
    logger.error('Failed to retrieve leaderboard:', error);
    res.status(500).json({ error: 'Failed to retrieve leaderboard', details: error });
  }
};
