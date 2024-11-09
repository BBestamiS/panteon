import { Router } from 'express';
import { getTopPlayers, searchPlayerNames} from '../controllers/playersController.js';

const router = Router();

router.get('/top', getTopPlayers);

router.get('/search', searchPlayerNames);


export default router;
