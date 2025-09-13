import { Router } from "express";
import auth from "./authRoutes.js";
import role from "./roleRoutes.js";
import lead from "./leadRoutes.js";
import contact from "./contactRoutes.js";
import pipeline from "./pipelineRoutes.js";
import stage from "./stageRoutes.js";
import filter from "./filterRoutes.js";
import user from "./userRoutes.js";
import apiGenerator from "./apiGeneratorRoutes.js";
import document from "./documentRoutes.js";
import routeLoader from "../middlewares/routeLoader.js";

const router = Router();
const routes = {
    auth,
    role,
    user,
    lead,
    contact,
    pipeline,
    stage,
    filter,
    apiGenerator,
    document
};
router.use('/', routeLoader(routes));

export default router;
