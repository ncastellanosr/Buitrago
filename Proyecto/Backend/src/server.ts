import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./database";
import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes"
import { authenticateToken, AuthRequest } from "./authMiddleware";

const app = express();
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/account", accountRoutes);

const PORT = 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database initialization error:", err);
  });

app.get("/auth/me", authenticateToken, (req: AuthRequest, res) => {
  res.json({
    message: "Token is valid!",
    user: req.user,
  });
});
