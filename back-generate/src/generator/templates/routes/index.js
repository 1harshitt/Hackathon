import { Router } from "express";
import auth from "./authRoutes.js";
import role from "./roleRoutes.js";
import user from "./userRoutes.js";
import routeLoader from "../middlewares/routeLoader.js";

const router = Router();
const routes = {
    auth,
    role,
    user
};
router.use('/', routeLoader(routes));

export default router; 