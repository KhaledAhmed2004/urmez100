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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VipService = void 0;
const content_model_1 = require("../content/content.model");
const getVipContentFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const cardFields = 'title thumbnail poster type rating isPremium isRecent';
    const sections = [];
    // 1. VIP Top Picks
    const topPicks = yield content_model_1.Content.find({ isPremium: true, rating: { $gte: 4.5 } })
        .select(cardFields)
        .limit(10);
    if (topPicks.length > 0) {
        sections.push({
            id: 'vip_top_picks',
            type: 'VIP_PICKS',
            title: 'Top VIP Picks',
            items: topPicks,
        });
    }
    // 2. Hot Now (Premium with high views)
    const hotNow = yield content_model_1.Content.find({ isPremium: true })
        .sort({ views: -1 })
        .select(cardFields)
        .limit(10);
    if (hotNow.length > 0) {
        sections.push({
            id: 'vip_hot_now',
            type: 'HOT_NOW',
            title: 'Hot Now on VIP',
            items: hotNow,
        });
    }
    // 3. New on VIP
    const newOnVip = yield content_model_1.Content.find({ isPremium: true, isRecent: true })
        .sort({ createdAt: -1 })
        .select(cardFields)
        .limit(10);
    if (newOnVip.length > 0) {
        sections.push({
            id: 'vip_new',
            type: 'NEW_VIP',
            title: 'New on VIP',
            items: newOnVip,
        });
    }
    return {
        sections,
    };
});
exports.VipService = {
    getVipContentFromDB,
};
