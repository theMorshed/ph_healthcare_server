import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { adminRoutes } from "../modules/admin/admin.routes";

const router = Router();

const appRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/admin',
        route: adminRoutes
    }
];

appRoutes.forEach(route => router.use(route.path, route.route));

export default router;