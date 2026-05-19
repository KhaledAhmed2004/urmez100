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
exports.ContentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const content_model_1 = require("./content.model");
const favorite_content_model_1 = require("../favorite-content/favorite-content.model");
const searchContentFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchableFields = ['title', 'description', 'category'];
    // Handle specific "filter" parameter from documentation
    if (query.filter === 'popular') {
        query.sort = '-views';
    }
    else if (query.filter === 'new') {
        query.sort = '-createdAt';
    }
    const cardFields = 'title thumbnail poster type rating isPremium isRecent';
    const contentQuery = new QueryBuilder_1.default(content_model_1.Content.find().select(cardFields), query)
        .search(searchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield contentQuery.modelQuery;
    const pagination = yield contentQuery.getPaginationInfo();
    return {
        pagination,
        data: result,
    };
});
const favoriteContentInDB = (userId, contentId) => __awaiter(void 0, void 0, void 0, function* () {
    const isContentExist = yield content_model_1.Content.findById(contentId);
    if (!isContentExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Content not found');
    }
    const result = yield favorite_content_model_1.FavoriteContent.findOneAndUpdate({
        userId: new mongoose_1.Types.ObjectId(userId),
        contentId: new mongoose_1.Types.ObjectId(contentId),
    }, {
        userId: new mongoose_1.Types.ObjectId(userId),
        contentId: new mongoose_1.Types.ObjectId(contentId),
    }, { upsert: true, new: true });
    return result;
});
const unfavoriteContentFromDB = (userId, contentId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favorite_content_model_1.FavoriteContent.findOneAndDelete({
        userId: new mongoose_1.Types.ObjectId(userId),
        contentId: new mongoose_1.Types.ObjectId(contentId),
    });
    return result;
});
const getBestMoviesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield content_model_1.Content.find({ type: 'MOVIE' }).sort({ rating: -1 }).limit(10);
    return result;
});
const getComingSoonContentFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield content_model_1.Content.find({ isRecent: true }).sort({ createdAt: -1 }).limit(10);
    return result;
});
exports.ContentService = {
    searchContentFromDB,
    favoriteContentInDB,
    unfavoriteContentFromDB,
    getBestMoviesFromDB,
    getComingSoonContentFromDB,
};
