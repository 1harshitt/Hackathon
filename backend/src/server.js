import cors from "cors";
import "./models/index.js";
import express from "express";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import { PORT, FRONTEND_URL } from "./config/config.js";
import routes from "./routes/index.js";
import sequelize from "./config/db.js";
import responseHandler from "./utils/responseHandler.js";

const app = express();
const server = createServer(app);

app.use(
    cors({
        origin: FRONTEND_URL || "http://localhost:5353",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    try {
        return responseHandler.success(res, "Server is running successfully");
    } catch (error) {
        return responseHandler.error(res, error?.message);
    }
});

app.use("/api/v1/", routes);

app.get("*", (req, res) => {
    return responseHandler.error(res, "Route not found");
});

const startServer = async () => {
    try {
        // Force sync to recreate all tables
        server.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();








