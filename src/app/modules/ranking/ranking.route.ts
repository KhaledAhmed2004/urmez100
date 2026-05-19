import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { RankingController } from './ranking.controller';

const router = express.Router();

router.get(
  '/vip',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  RankingController.getVipRankings,
);

export const RankingRoutes = router;
