"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const rateLimit_1 = require("../../middlewares/rateLimit");
const content_controller_1 = require("./content.controller");
const router = express_1.default.Router();
router.get('/search', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.SUPER_ADMIN), (0, rateLimit_1.rateLimitMiddleware)({
    windowMs: 60000,
    max: 60,
    routeName: 'content-search',
}), content_controller_1.ContentController.searchContent);
router.get('/best-movies', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.SUPER_ADMIN), content_controller_1.ContentController.getBestMovies);
router.get('/coming-soon', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.SUPER_ADMIN), content_controller_1.ContentController.getComingSoonContent);
router.post('/:contentId/favorite', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.SUPER_ADMIN), content_controller_1.ContentController.favoriteContent);
router.delete('/:contentId/favorite', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.SUPER_ADMIN), content_controller_1.ContentController.unfavoriteContent);
exports.ContentRoutes = router;
