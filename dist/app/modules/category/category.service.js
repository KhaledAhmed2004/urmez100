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
exports.CategoryService = void 0;
const category_model_1 = require("./category.model");
const content_model_1 = require("../content/content.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const getCategoriesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryQuery = new QueryBuilder_1.default(category_model_1.Category.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const categories = yield categoryQuery.modelQuery;
    const paginationInfo = yield categoryQuery.getPaginationInfo();
    // Aggregate content count for each category
    const categoriesWithCount = yield Promise.all(categories.map((category) => __awaiter(void 0, void 0, void 0, function* () {
        const contentCount = yield content_model_1.Content.countDocuments({ category: category.name });
        return Object.assign(Object.assign({}, category.toObject()), { contentCount });
    })));
    return {
        pagination: paginationInfo,
        data: categoriesWithCount,
    };
});
const createCategoryToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.create(payload);
    return result;
});
const updateCategoryInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.findByIdAndDelete(id);
    return result;
});
exports.CategoryService = {
    getCategoriesFromDB,
    createCategoryToDB,
    updateCategoryInDB,
    deleteCategoryFromDB,
};
