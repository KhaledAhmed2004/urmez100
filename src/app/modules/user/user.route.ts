import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { fileHandler } from '../../middlewares/fileHandler';
import { rateLimitMiddleware } from '../../middlewares/rateLimit';
import express from 'express';

const router = express.Router();

// Create new user (Public Registration)
router.post(
  '/',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser,
);

// Public user details (guest allowed) — rate limited
router.get(
  '/:userId/user',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  rateLimitMiddleware({
    windowMs: 60_000,
    max: 60,
    routeName: 'public-user-details',
  }),
  UserController.getUserDetailsById,
);

// --- Self Management (User/Doctor) ---

// Fetch own profile details
router.get(
  '/profile',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  UserController.getUserProfile,
);

// Get current user's recently watched content
router.get(
  '/me/recently-watched',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  UserController.getRecentlyWatched,
);

// Sync watch progress for a content
router.post(
  '/me/recently-watched/:contentId/sync',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  UserController.syncWatchProgress,
);

router.get(
  '/me/collection',
  auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
  UserController.getMyCollection,
);

router.patch(
  '/profile',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  fileHandler(['profilePicture']),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateProfile,
);

router.patch(
  '/:userId',
  auth(USER_ROLES.SUPER_ADMIN),
  validateRequest(UserValidation.adminUpdateUserZodSchema),
  UserController.adminUpdateUser,
);

router.delete('/:userId', auth(USER_ROLES.SUPER_ADMIN), UserController.deleteUser);

export const UserRoutes = router;
