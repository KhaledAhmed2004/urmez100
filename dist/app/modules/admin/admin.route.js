"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const user_controller_1 = require("../user/user.controller");
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const router = express_1.default.Router();
const upload = (0, fileUploadHandler_1.default)();
// Dashboard Overview
router.get('/growth-metrics', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getDashboardStats);
// Visitors analytics chart
router.get('/visitors/analytics', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getVisitorAnalytics);
// Watchlist status breakdown
router.get('/watchlist/status', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getWatchlistStatus);
// User Management (Admin Dashboard)
router.get('/users/stats', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.getUsersStats);
router.get('/users', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.getAllUserRoles);
router.patch('/users/:userId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.adminUpdateUserZodSchema), user_controller_1.UserController.adminUpdateUser);
router.delete('/users/bulk-delete', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.bulkDeleteUsers);
router.delete('/users/:userId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.deleteUser);
router.get('/users/:userId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.getUserById);
// Revenue Management
router.get('/revenue/stats', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getRevenueStats);
router.get('/transactions', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getTransactions);
router.patch('/users/:userId/status', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserStatusZodSchema), user_controller_1.UserController.updateUserStatus);
// Movies Management
router.get('/movies/stats', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getMoviesStats);
router.get('/movies', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getAdminMovies);
router.post('/movies', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'trailerFile', maxCount: 1 },
    { name: 'posterFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
]), admin_controller_1.AdminController.createMovie);
router.patch('/movies/:movieId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'trailerFile', maxCount: 1 },
    { name: 'posterFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
]), admin_controller_1.AdminController.updateMovie);
router.delete('/movies/:movieId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.deleteMovie);
router.patch('/movies/:movieId/status', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.updateMovieStatus);
// Video Upload (S3 Multipart)
router.post('/movies/upload/initiate', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.initiateUpload);
router.post('/movies/upload/presigned-urls', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getPresignedUrls);
router.post('/movies/upload/complete', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.completeUpload);
// Movie Details & Analytics
router.get('/movies/:movieId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getMovieProfile);
router.get('/movies/:movieId/analytics/overview', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getMovieAnalyticsOverview);
router.get('/movies/:movieId/analytics/engagement', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getMovieAnalyticsEngagement);
router.get('/movies/:movieId/analytics/audience', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getMovieAnalyticsAudience);
router.get('/movies/:movieId/analytics/revenue', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getMovieAnalyticsRevenue);
// Series Management
router.get('/series/stats', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getSeriesStats);
router.get('/series', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getAdminSeries);
router.post('/series', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), upload.fields([
    { name: 'trailerFile', maxCount: 1 },
    { name: 'posterFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
]), admin_controller_1.AdminController.createSeries);
router.patch('/series/:seriesId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), upload.fields([
    { name: 'trailerFile', maxCount: 1 },
    { name: 'posterFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
]), admin_controller_1.AdminController.updateSeries);
router.delete('/series/:seriesId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.deleteSeries);
router.patch('/series/:seriesId/status', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.updateSeriesStatus);
router.get('/series/:seriesId/details', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getSeriesDetails);
router.get('/series/:seriesId/episodes', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getEpisodes);
router.post('/series/:seriesId/episodes', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
]), admin_controller_1.AdminController.createEpisode);
router.patch('/series/episodes/:episodeId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 },
]), admin_controller_1.AdminController.updateEpisode);
router.delete('/series/episodes/:episodeId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.deleteEpisode);
// Subscriptions Management
router.get('/subscriptions/stats', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getSubscriptionsStats);
router.get('/subscriptions', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), admin_controller_1.AdminController.getAdminSubscriptions);
exports.AdminRoutes = router;
