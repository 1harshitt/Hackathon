import cors from "cors";
import "./models/index.js";
import express from "express";
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
        // Force sync to create tables
        await sequelize.sync({ force: true });
        console.log('✅ Database tables created successfully!');
        
        server.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer(); 