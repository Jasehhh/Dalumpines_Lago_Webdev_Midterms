import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import serviceRoutes from "./routes/serviceRoute";

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`ServiceHub API server running on http://localhost:${PORT}`);
});
