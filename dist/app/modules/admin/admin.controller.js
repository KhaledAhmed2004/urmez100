"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const admin_service_1 = require("./admin.service");
const getDashboardStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { range, startDate, endDate } = req.query;
    const result = yield admin_service_1.AdminService.getAdminDashboardStats(range, startDate, endDate);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Admin dashboard metrics',
        data: result,
    });
}));
const getVisitorAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { range, tz, startDate, endDate } = req.query;
    const result = yield admin_service_1.AdminService.getVisitorAnalyticsData(range, tz, startDate, endDate);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Visitor analytics retrieved successfully.',
        data: result,
    });
}));
const getWatchlistStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { period, range, startDate, endDate } = req.query;
    const result = yield admin_service_1.AdminService.getWatchlistStatusBreakdown((period || range), startDate, endDate);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Watchlist status breakdown retrieved successfully',
        data: result,
    });
}));
const getMoviesStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getMoviesStats();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Movies stats retrieved successfully',
        data: result,
    });
}));
const getSeriesStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getSeriesStats();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Series stats retrieved successfully',
        data: result,
    });
}));
const getSubscriptionsStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getSubscriptionsStats();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Subscription stats retrieved successfully',
        data: result,
    });
}));
const getAdminMovies = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getAdminMoviesList(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Movies list fetched',
        pagination: result.pagination,
        data: result.data,
    });
}));
const getAdminSeries = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getAdminSeriesList(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Series list fetched',
        pagination: result.pagination,
        data: result.data,
    });
}));
const getSeriesDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getSeriesDetailsFromDB(req.params.seriesId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Series details retrieved',
        data: result,
    });
}));
const getEpisodes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getEpisodesFromDB(req.params.seriesId, req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Episodes list fetched',
        pagination: result.pagination,
        data: result.data,
    });
}));
const createEpisode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign({}, req.body);
    if (req.files) {
        const files = req.files;
        if (files['videoFile'])
            payload.videoUrl =
                files['videoFile'][0].location || files['videoFile'][0].path;
        if (files['thumbnailFile'])
            payload.thumbnail =
                files['thumbnailFile'][0].location ||
                    files['thumbnailFile'][0].path;
    }
    const result = yield admin_service_1.AdminService.createEpisodeToDB(req.params.seriesId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Episode created successfully',
        data: result,
    });
}));
const updateEpisode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign({}, req.body);
    if (req.files) {
        const files = req.files;
        if (files['videoFile'])
            payload.videoUrl =
                files['videoFile'][0].location || files['videoFile'][0].path;
        if (files['thumbnailFile'])
            payload.thumbnail =
                files['thumbnailFile'][0].location ||
                    files['thumbnailFile'][0].path;
    }
    const result = yield admin_service_1.AdminService.updateEpisodeInDB(req.params.episodeId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Episode updated successfully',
        data: result,
    });
}));
const deleteEpisode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield admin_service_1.AdminService.deleteEpisodeFromDB(req.params.episodeId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Episode deleted successfully',
        data: null,
    });
}));
const getAdminSubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getAdminSubscriptionsList(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Subscriptions list fetched',
        pagination: result.pagination,
        data: result.data,
    });
}));
const getRevenueStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getRevenueStats();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Revenue stats retrieved successfully',
        data: result,
    });
}));
const getTransactions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.getTransactionsList(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Transactions list fetched',
        pagination: result.pagination,
        data: result.data,
    });
}));
const createMovie = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign({}, req.body);
    // Handle files from fileUploadHandler
    if (req.files) {
        const files = req.files;
        if (files['videoFile'])
            payload.videoUrl = files['videoFile'][0].location || files['videoFile'][0].path;
        if (files['trailerFile'])
            payload.trailerUrl = files['trailerFile'][0].location || files['trailerFile'][0].path;
        if (files['posterFile'])
            payload.poster = files['posterFile'][0].location || files['posterFile'][0].path;
        if (files['thumbnailFile'])
            payload.thumbnail = files['thumbnailFile'][0].location || files['thumbnailFile'][0].path;
    }
    const result = yield admin_service_1.AdminService.createMovieToDB(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Movie created successfully',
        data: result,
    });
}));
const createSeries = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign({}, req.body);
    // Handle files from fileUploadHandler
    if (req.files) {
        const files = req.files;
        if (files['trailerFile'])
            payload.trailerUrl =
                files['trailerFile'][0].location || files['trailerFile'][0].path;
        if (files['posterFile'])
            payload.poster =
                files['posterFile'][0].location || files['posterFile'][0].path;
        if (files['thumbnailFile'])
            payload.thumbnail =
                files['thumbnailFile'][0].location ||
                    files['thumbnailFile'][0].path;
    }
    const result = yield admin_service_1.AdminService.createSeriesToDB(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Series created successfully',
        data: result,
    });
}));
const updateSeries = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign({}, req.body);
    // Handle files from fileUploadHandler
    if (req.files) {
        const files = req.files;
        if (files['trailerFile'])
            payload.trailerUrl =
                files['trailerFile'][0].location || files['trailerFile'][0].path;
        if (files['posterFile'])
            payload.poster =
                files['posterFile'][0].location || files['posterFile'][0].path;
        if (files['thumbnailFile'])
            payload.thumbnail =
                files['thumbnailFile'][0].location ||
                    files['thumbnailFile'][0].path;
    }
    const result = yield admin_service_1.AdminService.updateSeriesInDB(req.params.seriesId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Series updated successfully',
        data: result,
    });
}));
const deleteSeries = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield admin_service_1.AdminService.deleteSeriesFromDB(req.params.seriesId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Series deleted successfully',
        data: null,
    });
}));
const updateSeriesStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminService.updateSeriesStatusInDB(req.params.seriesId, req.body.status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Series status updated successfully',
        data: result,
    });
}));
const updateMovie = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const payload = Object.assign({}, req.body);
    // Handle files if updated
    if (req.files) {
        const files = req.files;
        if (files['videoFile'])
            payload.videoUrl = files['videoFile'][0].location || files['videoFile'][0].path;
        if (files['trailerFile'])
            payload.trailerUrl = files['trailerFile'][0].location || files['trailerFile'][0].path;
        if (files['posterFile'])
            payload.poster = files['posterFile'][0].location || files['posterFile'][0].path;
        if (files['thumbnailFile'])
            payload.thumbnail = files['thumbnailFile'][0].location || files['thumbnailFile'][0].path;
    }
    const result = yield admin_service_1.AdminService.updateMovieInDB(movieId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Movie updated successfully',
        data: result,
    });
}));
const deleteMovie = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    yield admin_service_1.AdminService.deleteMovieFromDB(movieId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Movie deleted',
    });
}));
const updateMovieStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const { status } = req.body;
    const result = yield admin_service_1.AdminService.updateMovieStatusInDB(movieId, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Movie status updated successfully',
        data: result,
    });
}));
const initiateUpload = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName, contentType } = req.body;
    const result = yield admin_service_1.AdminService.initiateMultipartUpload(fileName, contentType);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Upload initiated successfully',
        data: result,
    });
}));
const getPresignedUrls = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uploadId, key, partNumbers } = req.body;
    const result = yield admin_service_1.AdminService.generateMultipartPresignedUrls(uploadId, key, partNumbers);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Presigned URLs generated successfully',
        data: result,
    });
}));
const completeUpload = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uploadId, key, parts } = req.body;
    const result = yield admin_service_1.AdminService.completeMultipartUpload(uploadId, key, parts);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Upload completed successfully',
        data: result,
    });
}));
const getMovieProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const result = yield admin_service_1.AdminService.getMovieProfileFromDB(movieId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Movie profile not found');
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Movie profile retrieved',
        data: result,
    });
}));
const getMovieAnalyticsOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const result = yield admin_service_1.AdminService.getMovieAnalyticsOverviewData(movieId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Movie analytics not found');
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Movie analytics overview retrieved',
        data: result,
    });
}));
const getMovieAnalyticsEngagement = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const result = yield admin_service_1.AdminService.getMovieAnalyticsEngagementData(movieId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Movie analytics not found');
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Movie analytics engagement retrieved',
        data: result,
    });
}));
const getMovieAnalyticsAudience = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const result = yield admin_service_1.AdminService.getMovieAnalyticsAudienceData(movieId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Movie analytics not found');
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Movie analytics audience retrieved',
        data: result,
    });
}));
const getMovieAnalyticsRevenue = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const result = yield admin_service_1.AdminService.getMovieAnalyticsRevenueData(movieId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Movie analytics not found');
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Movie analytics revenue retrieved',
        data: result,
    });
}));
exports.AdminController = {
    getDashboardStats,
    getVisitorAnalytics,
    getWatchlistStatus,
    getMoviesStats,
    getSeriesStats,
    getSubscriptionsStats,
    getAdminMovies,
    getAdminSeries,
    getSeriesDetails,
    getEpisodes,
    createEpisode,
    updateEpisode,
    deleteEpisode,
    getAdminSubscriptions,
    getRevenueStats,
    getTransactions,
    createMovie,
    createSeries,
    updateSeries,
    deleteSeries,
    updateSeriesStatus,
    updateMovie,
    deleteMovie,
    updateMovieStatus,
    initiateUpload,
    getPresignedUrls,
    completeUpload,
    getMovieProfile,
    getMovieAnalyticsOverview,
    getMovieAnalyticsEngagement,
    getMovieAnalyticsAudience,
    getMovieAnalyticsRevenue,
};
