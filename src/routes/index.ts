import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { SubscriptionRoutes } from '../app/modules/subscription/subscription.route';
import { AdminRoutes } from '../app/modules/admin/admin.route';
import { LegalRoutes } from '../app/modules/legal/legal.route';
import { ContentRoutes } from '../app/modules/content/content.route';
import { HomeRoutes } from '../app/modules/home/home.route';
import { RankingRoutes } from '../app/modules/ranking/ranking.route';
import { VipRoutes } from '../app/modules/vip/vip.route';
import { GenreRoutes } from '../app/modules/genre/genre.route';

const router = express.Router();

const apiRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/subscription',
    route: SubscriptionRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/admin/genres',
    route: GenreRoutes,
  },
  {
    path: '/admin/legal',
    route: LegalRoutes,
  },
  {
    path: '/content',
    route: ContentRoutes,
  },
  {
    path: '/home',
    route: HomeRoutes,
  },
  {
    path: '/rankings',
    route: RankingRoutes,
  },
  {
    path: '/vip',
    route: VipRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
