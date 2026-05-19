import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { HomeController } from './home.controller';

const router = express.Router();

router.get(
  '/content',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  HomeController.getHomeContent,
);

export const HomeRoutes = router;
