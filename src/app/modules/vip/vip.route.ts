import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { VipController } from './vip.controller';

const router = express.Router();

router.get(
  '/content',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  VipController.getVipContent,
);

export const VipRoutes = router;
