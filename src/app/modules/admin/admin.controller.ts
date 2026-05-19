import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import ApiError from '../../../errors/ApiError';
import { AdminService } from './admin.service';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const { range, startDate, endDate } = req.query;
  const result = await AdminService.getAdminDashboardStats(
    range as string,
    startDate as string,
    endDate as string
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin dashboard metrics',
    data: result,
  });
});

const getVisitorAnalytics = catchAsync(async (req: Request, res: Response) => {
  const { range, tz, startDate, endDate } = req.query;
  const result = await AdminService.getVisitorAnalyticsData(
    range as string,
    tz as string,
    startDate as string,
    endDate as string
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Visitor analytics retrieved successfully.',
    data: result,
  });
});

const getWatchlistStatus = catchAsync(async (req: Request, res: Response) => {
  const { period, range, startDate, endDate } = req.query;
  const result = await AdminService.getWatchlistStatusBreakdown(
    (period || range) as string,
    startDate as string,
    endDate as string
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Watchlist status breakdown retrieved successfully',
    data: result,
  });
});

const getMoviesStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getMoviesStats();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Movies stats retrieved successfully',
    data: result,
  });
});

const getSeriesStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSeriesStats();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Series stats retrieved successfully',
    data: result,
  });
});

const getSubscriptionsStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSubscriptionsStats();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscription stats retrieved successfully',
    data: result,
  });
});

const getAdminMovies = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAdminMoviesList(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Movies list fetched',
    pagination: result.pagination,
    data: result.data,
  });
});

const getAdminSeries = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAdminSeriesList(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Series list fetched',
    pagination: result.pagination,
    data: result.data,
  });
});

const getSeriesDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSeriesDetailsFromDB(req.params.seriesId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Series details retrieved successfully',
    data: result,
  });
});

// --- Season Management ---
const createSeason = catchAsync(async (req: Request, res: Response) => {
  const { seriesId } = req.params;
  const payload = { ...req.body };

  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['posterFile']) {
      payload.poster = (files['posterFile'][0] as any).location || files['posterFile'][0].path;
    }
  }

  const result = await AdminService.createSeasonToDB(seriesId, payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Season created successfully',
    data: result,
  });
});

const getSeasons = catchAsync(async (req: Request, res: Response) => {
  const { seriesId } = req.params;
  const result = await AdminService.getSeasonsBySeriesFromDB(seriesId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Seasons retrieved successfully',
    data: result,
  });
});

const updateSeason = catchAsync(async (req: Request, res: Response) => {
  const { seasonId } = req.params;
  const payload = { ...req.body };

  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['posterFile']) {
      payload.poster = (files['posterFile'][0] as any).location || files['posterFile'][0].path;
    }
  }

  const result = await AdminService.updateSeasonInDB(seasonId, payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Season updated successfully',
    data: result,
  });
});

const deleteSeason = catchAsync(async (req: Request, res: Response) => {
  const { seasonId } = req.params;
  await AdminService.deleteSeasonFromDB(seasonId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Season deleted successfully',
    data: null,
  });
});

const getEpisodes = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getEpisodesFromDB(
    req.params.seriesId,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Episodes list fetched',
    pagination: result.pagination,
    data: result.data,
  });
});

const createEpisode = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['videoFile'])
      payload.videoUrl =
        (files['videoFile'][0] as any).location || files['videoFile'][0].path;
    if (files['thumbnailFile'])
      payload.thumbnail =
        (files['thumbnailFile'][0] as any).location ||
        files['thumbnailFile'][0].path;
  }

  const result = await AdminService.createEpisodeToDB(
    req.params.seriesId,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Episode created successfully',
    data: result,
  });
});

const updateEpisode = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['videoFile'])
      payload.videoUrl =
        (files['videoFile'][0] as any).location || files['videoFile'][0].path;
    if (files['thumbnailFile'])
      payload.thumbnail =
        (files['thumbnailFile'][0] as any).location ||
        files['thumbnailFile'][0].path;
  }

  const result = await AdminService.updateEpisodeInDB(
    req.params.episodeId,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Episode updated successfully',
    data: result,
  });
});

const deleteEpisode = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteEpisodeFromDB(req.params.episodeId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Episode deleted successfully',
    data: null,
  });
});

const getAdminSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAdminSubscriptionsList(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriptions list fetched',
    pagination: result.pagination,
    data: result.data,
  });
});

const getRevenueStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getRevenueStats();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Revenue stats retrieved successfully',
    data: result,
  });
});

const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getTransactionsList(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Transactions list fetched',
    pagination: result.pagination,
    data: result.data,
  });
});

const createMovie = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };
  
  // Handle files from fileUploadHandler
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['videoFile']) payload.videoUrl = (files['videoFile'][0] as any).location || files['videoFile'][0].path;
    if (files['trailerFile']) payload.trailerUrl = (files['trailerFile'][0] as any).location || files['trailerFile'][0].path;
    if (files['posterFile']) payload.poster = (files['posterFile'][0] as any).location || files['posterFile'][0].path;
    if (files['thumbnailFile']) payload.thumbnail = (files['thumbnailFile'][0] as any).location || files['thumbnailFile'][0].path;
  }

  const result = await AdminService.createMovieToDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Movie created successfully',
    data: result,
  });
});

const createSeries = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  // Handle files from fileUploadHandler
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['trailerFile'])
      payload.trailerUrl =
        (files['trailerFile'][0] as any).location || files['trailerFile'][0].path;
    if (files['posterFile'])
      payload.poster =
        (files['posterFile'][0] as any).location || files['posterFile'][0].path;
    if (files['thumbnailFile'])
      payload.thumbnail =
        (files['thumbnailFile'][0] as any).location ||
        files['thumbnailFile'][0].path;
  }

  const result = await AdminService.createSeriesToDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Series created successfully',
    data: result,
  });
});

const updateSeries = catchAsync(async (req: Request, res: Response) => {
  const payload = { ...req.body };

  // Handle files from fileUploadHandler
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['trailerFile'])
      payload.trailerUrl =
        (files['trailerFile'][0] as any).location || files['trailerFile'][0].path;
    if (files['posterFile'])
      payload.poster =
        (files['posterFile'][0] as any).location || files['posterFile'][0].path;
    if (files['thumbnailFile'])
      payload.thumbnail =
        (files['thumbnailFile'][0] as any).location ||
        files['thumbnailFile'][0].path;
  }

  const result = await AdminService.updateSeriesInDB(
    req.params.seriesId,
    payload,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Series updated successfully',
    data: result,
  });
});

const deleteSeries = catchAsync(async (req: Request, res: Response) => {
  await AdminService.deleteSeriesFromDB(req.params.seriesId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Series deleted successfully',
    data: null,
  });
});

const updateSeriesStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateSeriesStatusInDB(
    req.params.seriesId,
    req.body.status,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Series status updated successfully',
    data: result,
  });
});

const updateMovie = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const payload = { ...req.body };

  // Handle files if updated
  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files['videoFile']) payload.videoUrl = (files['videoFile'][0] as any).location || files['videoFile'][0].path;
    if (files['trailerFile']) payload.trailerUrl = (files['trailerFile'][0] as any).location || files['trailerFile'][0].path;
    if (files['posterFile']) payload.poster = (files['posterFile'][0] as any).location || files['posterFile'][0].path;
    if (files['thumbnailFile']) payload.thumbnail = (files['thumbnailFile'][0] as any).location || files['thumbnailFile'][0].path;
  }

  const result = await AdminService.updateMovieInDB(movieId, payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Movie updated successfully',
    data: result,
  });
});

const deleteMovie = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  await AdminService.deleteMovieFromDB(movieId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Movie deleted',
  });
});

const updateMovieStatus = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const { status } = req.body;
  const result = await AdminService.updateMovieStatusInDB(movieId, status);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Movie status updated successfully',
    data: result,
  });
});

const initiateUpload = catchAsync(async (req: Request, res: Response) => {
  const { fileName, contentType } = req.body;
  const result = await AdminService.initiateMultipartUpload(fileName, contentType);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Upload initiated successfully',
    data: result,
  });
});

const getPresignedUrls = catchAsync(async (req: Request, res: Response) => {
  const { uploadId, key, partNumbers } = req.body;
  const result = await AdminService.generateMultipartPresignedUrls(uploadId, key, partNumbers);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Presigned URLs generated successfully',
    data: result,
  });
});

const completeUpload = catchAsync(async (req: Request, res: Response) => {
  const { uploadId, key, parts } = req.body;
  const result = await AdminService.completeMultipartUpload(uploadId, key, parts);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Upload completed successfully',
    data: result,
  });
});

const getMovieProfile = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const result = await AdminService.getMovieProfileFromDB(movieId);
  
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Movie profile not found');
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Movie profile retrieved',
    data: result,
  });
});

const getMovieAnalyticsOverview = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const result = await AdminService.getMovieAnalyticsOverviewData(movieId);
  
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Movie analytics not found');
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Movie analytics overview retrieved',
    data: result,
  });
});

const getMovieAnalyticsEngagement = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const result = await AdminService.getMovieAnalyticsEngagementData(movieId);
  
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Movie analytics not found');
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Movie analytics engagement retrieved',
    data: result,
  });
});

const getMovieAnalyticsAudience = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const result = await AdminService.getMovieAnalyticsAudienceData(movieId);
  
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Movie analytics not found');
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Movie analytics audience retrieved',
    data: result,
  });
});

const getMovieAnalyticsRevenue = catchAsync(async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const result = await AdminService.getMovieAnalyticsRevenueData(movieId);
  
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Movie analytics not found');
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Movie analytics revenue retrieved',
    data: result,
  });
});

export const AdminController = {
  getDashboardStats,
  getVisitorAnalytics,
  getWatchlistStatus,
  getMoviesStats,
  getSeriesStats,
  getSubscriptionsStats,
  getAdminMovies,
  getAdminSeries,
  getSeriesDetails,
  createSeason,
  getSeasons,
  updateSeason,
  deleteSeason,
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
