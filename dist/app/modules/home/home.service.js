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
exports.HomeService = void 0;
const recently_watched_model_1 = require("../recently-watched/recently-watched.model");
const content_model_1 = require("../content/content.model");
const getHomeContentFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const sections = [];
    const cardFields = 'title thumbnail poster type rating isPremium isRecent';
    // 1. Continue Watching (if userId provided)
    if (userId) {
        const recentlyWatched = yield recently_watched_model_1.RecentlyWatched.find({ userId })
            .sort({ lastWatchedAt: -1 })
            .limit(10)
            .populate('contentId', cardFields);
        if (recentlyWatched.length > 0) {
            sections.push({
                id: 'row_continue_watching',
                type: 'CONTINUE_WATCHING',
                title: 'Continue Watching',
                items: recentlyWatched.map((rw) => {
                    const content = rw.contentId ? rw.contentId.toObject() : {};
                    return Object.assign(Object.assign({}, content), { progress: {
                            seconds: rw.watchedSeconds,
                            percentage: rw.completionPercentage,
                            last_watched: rw.lastWatchedAt,
                        } });
                }),
            });
        }
    }
    // 2. Trending (Popular)
    const trending = yield content_model_1.Content.find({ views: { $gt: 100 } })
        .sort({ views: -1 })
        .select(cardFields)
        .limit(10);
    sections.push({
        id: 'row_trending_now',
        type: 'TRENDING',
        title: 'Trending Now',
        items: trending,
    });
    // 3. You Might Like
    const youMightLike = yield content_model_1.Content.find()
        .sort({ rating: -1 })
        .select(cardFields)
        .limit(10);
    sections.push({
        id: 'row_you_might_like',
        type: 'YOU_MIGHT_LIKE',
        title: 'You Might Like',
        items: youMightLike,
    });
    // 4. Ranking (Daily/Weekly/Monthly simulation)
    const rankings = yield content_model_1.Content.find()
        .sort({ views: -1 })
        .select(cardFields)
        .limit(5);
    if (rankings.length > 0) {
        sections.push({
            id: 'row_rankings',
            type: 'RANKING',
            title: 'Top Rankings',
            items: rankings,
        });
    }
    // 5. Most Popular Series
    const mostPopularSeries = yield content_model_1.Content.find({
        type: 'SERIES',
        isPopularSeries: true,
    })
        .select(cardFields)
        .limit(10);
    if (mostPopularSeries.length > 0) {
        sections.push({
            id: 'row_popular_series',
            type: 'SERIES',
            title: 'Most Popular Series',
            items: mostPopularSeries,
        });
    }
    // 6. Top Picks (Editorial Curation + AI)
    const topPicks = yield content_model_1.Content.find({ rating: { $gte: 4.5 } })
        .select(cardFields)
        .limit(10);
    sections.push({
        id: 'row_top_picks',
        type: 'TOP_PICKS',
        title: 'Top Picks for You',
        items: topPicks,
    });
    // 7. VIP Picks
    const vipPicks = yield content_model_1.Content.find({ isPremium: true })
        .select(cardFields)
        .limit(10);
    if (vipPicks.length > 0) {
        sections.push({
            id: 'row_vip_picks',
            type: 'VIP',
            title: 'VIP Picks',
            items: vipPicks,
        });
    }
    // 8. Newly Released
    const newlyReleased = yield content_model_1.Content.find({ isRecent: true })
        .sort({ createdAt: -1 })
        .select(cardFields)
        .limit(10);
    sections.push({
        id: 'row_new_releases',
        type: 'NEW_RELEASE',
        title: 'Newly Released',
        items: newlyReleased,
    });
    // 9. YouTube Upcoming
    const ytUpcoming = yield content_model_1.Content.find({
        youtubeId: { $exists: true, $ne: null },
    })
        .sort({ publishedAt: -1 })
        .select(cardFields + ' youtubeId channelName publishedAt')
        .limit(10);
    if (ytUpcoming.length > 0) {
        sections.push({
            id: 'row_yt_upcoming',
            type: 'YOUTUBE_SHELF',
            title: 'Upcoming Trailers on YouTube',
            items: ytUpcoming,
        });
    }
    return {
        sections,
    };
});
exports.HomeService = {
    getHomeContentFromDB,
};
