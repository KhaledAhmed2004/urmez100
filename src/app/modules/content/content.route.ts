import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { rateLimitMiddleware } from '../../middlewares/rateLimit';
import { ContentController } from './content.controller';

const router = express.Router();

router.get(
  '/search',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  rateLimitMiddleware({
    windowMs: 60_000,
    max: 60,
    routeName: 'content-search',
  }),
  ContentController.searchContent,
);

router.get(
  '/best-movies',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  ContentController.getBestMovies,
);

router.get(
  '/coming-soon',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  ContentController.getComingSoonContent,
);

router.post(
  '/:contentId/favorite',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  ContentController.favoriteContent,
);

router.delete(
  '/:contentId/favorite',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  ContentController.unfavoriteContent,
);

export const ContentRoutes = router;
