import { Genre, IGenre } from './genre.model';
import { Content } from '../content/content.model';
import QueryBuilder from '../../builder/QueryBuilder';

const getGenresFromDB = async (query: Record<string, unknown>) => {
  const genreQuery = new QueryBuilder(Genre.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const genres = await genreQuery.modelQuery;
  const paginationInfo = await genreQuery.getPaginationInfo();

  // Aggregate content count for each genre (checking if genre ID is in the genres array)
  const genresWithCount = await Promise.all(
    genres.map(async (genre: any) => {
      const contentCount = await Content.countDocuments({ 
        genres: genre._id 
      });
      return {
        ...genre.toObject(),
        contentCount,
      };
    })
  );

  return {
    pagination: paginationInfo,
    data: genresWithCount,
  };
};

const createGenreToDB = async (payload: IGenre) => {
  const result = await Genre.create(payload);
  return result;
};

const updateGenreInDB = async (id: string, payload: Partial<IGenre>) => {
  const result = await Genre.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteGenreFromDB = async (id: string) => {
  const result = await Genre.findByIdAndDelete(id);
  return result;
};

export const GenreService = {
  getGenresFromDB,
  createGenreToDB,
  updateGenreInDB,
  deleteGenreFromDB,
};
