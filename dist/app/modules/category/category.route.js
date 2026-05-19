"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), category_controller_1.CategoryController.getAll);
router.post('/', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), category_controller_1.CategoryController.createCategory);
router.patch('/:categoryId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), category_controller_1.CategoryController.updateBySlug);
router.delete('/:categoryId', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), category_controller_1.CategoryController.deleteBySlug);
exports.CategoryRoutes = router;
