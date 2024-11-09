import { Request, Response } from 'express';
import redisClient from '../redisClient.js';
import logger from '../logger.js';

export const getTopPlayers = async (req: Request, res: Response) => {
  try {
    const topPlayers = await redisClient.zrevrange('leaderboard', 0, 99, 'WITHSCORES');

    const formattedPlayers = [];
    for (let i = 0; i < topPlayers.length; i += 2) {
      formattedPlayers.push({
        playerId: topPlayers[i],
        score: topPlayers[i + 1],
      });
    }

    res.json({ topPlayers: formattedPlayers });
  } catch (error) {
    logger.error('Failed to retrieve top players:', error);
    res.status(500).json({ error: 'Failed to retrieve top players' });
  }
};

export const searchPlayerNames = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q as string;

  if (!query) {
    res.status(400).json({ error: 'Query parameter "q" is required' });
    return;
  }

  try {
    const matchingNames: string[] = [];
    const scanStream = redisClient.zscanStream('leaderboard');

    // Verileri asenkron olarak tarayarak işlem yapıyoruz
    for await (const resultKeys of scanStream) {
      for (let i = 0; i < resultKeys.length; i += 2) {
        const playerName = resultKeys[i];

        // `query` içeren isimleri ekle
        if (playerName.toLowerCase().includes(query.toLowerCase())) {
          matchingNames.push(playerName);

          // Maksimum 10 öneriye ulaşıldığında dur
          if (matchingNames.length >= 10) {
            scanStream.pause(); // Tarama işlemini durdur
            break;
          }
        }
      }
      if (matchingNames.length >= 10) {
        break; // Döngüden çık
      }
    }

    res.json({ suggestions: matchingNames });
  } catch (error: any) {
    logger.error('Failed to search player names:', error);
    res.status(500).json({ error: 'Failed to search player names', details: error.message });
  }
};
  
