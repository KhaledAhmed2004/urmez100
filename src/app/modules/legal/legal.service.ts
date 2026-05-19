import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import ApiError from '../../../errors/ApiError';
import { ILegalPage } from './legal.interface';
import { LegalPage } from './legal.model';

const generateSlug = async (
  title: string,
  excludeSlug?: string,
): Promise<string> => {
  const slug = slugify(title, { lower: true, strict: true });
  const query: any = { slug };

  if (excludeSlug) {
    query.slug = { $ne: excludeSlug };
    const existingWithSlug = await LegalPage.findOne({ slug }).lean();
    if (existingWithSlug && existingWithSlug.slug !== excludeSlug) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'A legal page with this title already exists',
      );
    }
  } else {
    const existing = await LegalPage.findOne({ slug }).lean();
    if (existing) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'A legal page with this title already exists',
      );
    }
  }

  return slug;
};

const createLegalPageToDB = async (
  payload: Partial<ILegalPage>,
): Promise<ILegalPage> => {
  if (!payload.title) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Title is required');
  }
  const slug = await generateSlug(payload.title);
  await LegalPage.create({ ...payload, slug });
  const result = await LegalPage.findOne({ slug })
    .select('slug title content createdAt')
    .lean();
  return result as ILegalPage;
};

const getAllLegalPagesFromDB = async (): Promise<ILegalPage[]> => {
  const result = await LegalPage.find()
    .select('-_id slug title')
    .sort({ title: 1 })
    .lean();
  return result;
};

const getLegalPageBySlugFromDB = async (slug: string): Promise<ILegalPage> => {
  const result = await LegalPage.findOne({ slug })
    .select('-_id slug title content updatedAt')
    .lean();
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Legal page not found');
  }
  return result;
};

const updateLegalPageBySlugInDB = async (
  slug: string,
  payload: Partial<ILegalPage>,
): Promise<ILegalPage> => {
  const existingPage = await LegalPage.findOne({ slug }).lean();
  if (!existingPage) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Legal page not found');
  }

  const updateData: Partial<ILegalPage> = {};

  if (payload.title && payload.title !== existingPage.title) {
    const newSlug = await generateSlug(payload.title, slug);
    updateData.title = payload.title;
    updateData.slug = newSlug;
  }

  if (payload.content !== undefined) {
    updateData.content = payload.content;
  }

  const result = await LegalPage.findOneAndUpdate({ slug }, updateData, {
    new: true,
  }).select('slug title content updatedAt');

  return result as ILegalPage;
};

const deleteLegalPageBySlugFromDB = async (slug: string): Promise<void> => {
  const existing = await LegalPage.findOne({ slug }).lean();
  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Legal page not found');
  }
  await LegalPage.findOneAndDelete({ slug });
};

export const LegalService = {
  createLegalPageToDB,
  getAllLegalPagesFromDB,
  getLegalPageBySlugFromDB,
  updateLegalPageBySlugInDB,
  deleteLegalPageBySlugFromDB,
};
