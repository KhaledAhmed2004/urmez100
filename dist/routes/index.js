"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../app/modules/auth/auth.route");
const user_route_1 = require("../app/modules/user/user.route");
const subscription_route_1 = require("../app/modules/subscription/subscription.route");
const admin_route_1 = require("../app/modules/admin/admin.route");
const legal_route_1 = require("../app/modules/legal/legal.route");
const content_route_1 = require("../app/modules/content/content.route");
const home_route_1 = require("../app/modules/home/home.route");
const ranking_route_1 = require("../app/modules/ranking/ranking.route");
const category_route_1 = require("../app/modules/category/category.route");
const vip_route_1 = require("../app/modules/vip/vip.route");
const router = express_1.default.Router();
const apiRoutes = [
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/subscription',
        route: subscription_route_1.SubscriptionRoutes,
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/admin/categories',
        route: category_route_1.CategoryRoutes,
    },
    {
        path: '/admin/legal',
        route: legal_route_1.LegalRoutes,
    },
    {
        path: '/content',
        route: content_route_1.ContentRoutes,
    },
    {
        path: '/home',
        route: home_route_1.HomeRoutes,
    },
    {
        path: '/rankings',
        route: ranking_route_1.RankingRoutes,
    },
    {
        path: '/vip',
        route: vip_route_1.VipRoutes,
    },
];
apiRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
