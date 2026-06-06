import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { UserController } from '../user/user.controller';
import { fileHandler } from '../../middlewares/fileHandler';

const router = express.Router();

// Dashboard Overview
router.get(
  '/growth-metrics',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getDashboardStats,
);

// Visitors analytics chart
router.get(
  '/visitors/analytics',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getVisitorAnalytics,
);

// Watchlist status breakdown
router.get(
  '/watchlist/status',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getWatchlistStatus,
);

// User Management (Admin Dashboard)
router.get(
  '/users/stats',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.getUsersStats,
);

router.get(
  '/users/export',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.exportUsers,
);

router.get(
  '/users',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.getAllUserRoles,
);

router.patch(
  '/users/:userId',
  auth(USER_ROLES.SUPER_ADMIN),
  validateRequest(UserValidation.adminUpdateUserZodSchema),
  UserController.adminUpdateUser,
);

router.delete(
  '/users/bulk-delete',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.bulkDeleteUsers,
);

router.delete(
  '/users/:userId',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.deleteUser,
);

router.get(
  '/users/:userId',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.getUserById,
);

// Revenue Management
router.get(
  '/revenue/stats',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getRevenueStats,
);

router.get(
  '/transactions',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getTransactions,
);

router.patch(
  '/users/:userId/status',
  auth(USER_ROLES.SUPER_ADMIN),
  validateRequest(UserValidation.updateUserStatusZodSchema),
  UserController.updateUserStatus,
);

// Movies Management
router.get(
  '/movies/stats',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getMoviesStats,
);

router.get(
  '/movies',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getAdminMovies,
);

router.post(
  '/movies',
  auth(USER_ROLES.SUPER_ADMIN),
  fileHandler([
    { name: 'posterFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
  ]),
  AdminController.createMovie,
);

router.patch(
  '/movies/:movieId',
  auth(USER_ROLES.SUPER_ADMIN),
  fileHandler([
    { name: 'posterFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
  ]),
  AdminController.updateMovie,
);

router.delete(
  '/movies/:movieId',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.deleteMovie,
);

router.patch(
  '/movies/:movieId/status',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.updateMovieStatus,
);

// Video Upload (S3 Multipart)
router.post(
  '/movies/upload/initiate',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.initiateUpload,
);

router.post(
  '/movies/upload/presigned-urls',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getPresignedUrls,
);

router.post(
  '/movies/upload/complete',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.completeUpload,
);

// Movie Details & Analytics
router.get(
  '/movies/:movieId',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getMovieProfile,
);

router.get(
  '/movies/:movieId/analytics/overview',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getMovieAnalyticsOverview,
);

router.get(
  '/movies/:movieId/analytics/engagement',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getMovieAnalyticsEngagement,
);

router.get(
  '/movies/:movieId/analytics/audience',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getMovieAnalyticsAudience,
);

router.get(
  '/movies/:movieId/analytics/revenue',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getMovieAnalyticsRevenue,
);

// Series Management
router.get(
  '/series/stats',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getSeriesStats,
);

router.get(
  '/series',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getAdminSeries,
);

router.post(
  '/series',
  auth(USER_ROLES.SUPER_ADMIN),
  fileHandler([
    { name: 'trailerFile', maxCount: 1 },
    { name: 'posterFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
  ]),
  AdminController.createSeries,
);

router.patch(
  '/series/:seriesId',
  auth(USER_ROLES.SUPER_ADMIN),
  fileHandler([
    { name: 'trailerFile', maxCount: 1 },
    { name: 'posterFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
  ]),
  AdminController.updateSeries,
);

router.delete(
  '/series/:seriesId',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.deleteSeries,
);

router.patch(
  '/series/:seriesId/status',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.updateSeriesStatus,
);

router.get(
  '/series/:seriesId/details',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getSeriesDetails,
);

// Season Management
router.post(
  '/series/:seriesId/seasons',
  auth(USER_ROLES.SUPER_ADMIN),
  fileHandler([{ name: 'posterFile', maxCount: 1 }]),
  AdminController.createSeason,
);

router.get(
  '/series/:seriesId/seasons',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getSeasons,
);

router.patch(
  '/series/seasons/:seasonId',
  auth(USER_ROLES.SUPER_ADMIN),
  fileHandler([{ name: 'posterFile', maxCount: 1 }]),
  AdminController.updateSeason,
);

router.delete(
  '/series/seasons/:seasonId',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.deleteSeason,
);

// Episode Management
router.get(
  '/series/:seriesId/episodes',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getEpisodes,
);

router.post(
  '/series/:seriesId/episodes',
  auth(USER_ROLES.SUPER_ADMIN),
  fileHandler([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
  ]),
  AdminController.createEpisode,
);

router.patch(
  '/series/episodes/:episodeId',
  auth(USER_ROLES.SUPER_ADMIN),
  fileHandler([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
  ]),
  AdminController.updateEpisode,
);

router.delete(
  '/series/episodes/:episodeId',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.deleteEpisode,
);

// Subscriptions Management
router.get(
  '/subscriptions/stats',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getSubscriptionsStats,
);

router.get(
  '/subscriptions',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getAdminSubscriptions,
);

export const AdminRoutes = router;
