import express from 'express';
import cors from 'cors';
import "reflect-metadata";
import bodyParser from "body-parser";
import { AppDataSource } from "./database";
import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes"
import transactionRoutes from "./routes/transactionRoutes"
import obligationRoutes from "./routes/obligationRoutes";
import { authenticateToken, AuthRequest } from "./authMiddleware";
import preferenciaNoticiaRoutes from "./newsFeed/PreferenciaNoticiaRoutes";
import financialNewsRouter from './newsFeed/FinancialNews';
const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true, 
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use("/auth", authRoutes);
app.use("/account", accountRoutes);
app.use("/transaction", transactionRoutes);
app.use("/obligation", obligationRoutes);
app.use('/api/financial-news', financialNewsRouter);
app.use("/api/news-preferences", preferenciaNoticiaRoutes);

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
