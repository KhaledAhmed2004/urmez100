import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { GenreService } from './genre.service';

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await GenreService.getGenresFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genres fetched successfully',
    pagination: result.pagination,
    data: result.data,
  });
});

const createGenre = catchAsync(async (req: Request, res: Response) => {
  const result = await GenreService.createGenreToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Genre created successfully',
    data: result,
  });
});

const updateById = catchAsync(async (req: Request, res: Response) => {
  const { genreId } = req.params;
  const result = await GenreService.updateGenreInDB(genreId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre updated successfully',
    data: result,
  });
});

const deleteById = catchAsync(async (req: Request, res: Response) => {
  const { genreId } = req.params;
  const result = await GenreService.deleteGenreFromDB(genreId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Genre deleted successfully',
    data: result,
  });
});

export const GenreController = {
  getAll,
  createGenre,
  updateById,
  deleteById,
};
