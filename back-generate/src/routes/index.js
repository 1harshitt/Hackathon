import { Router } from "express";
import routeLoader from "../middlewares/routeLoader.js";
import generatorRoutes from "./generatorRoutes.js";

const router = Router();
const routes = {
    generator: generatorRoutes
};

router.use('/', routeLoader(routes));

export default router; 