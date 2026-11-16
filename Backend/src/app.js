import "dotenv/config";
import express  from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cookieParser from "cookie-parser";
const app = express();
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
const configuredClientUrls = process.env.CLIENT_URL
  ?.split(",")
  .map(origin => origin.trim())
  .filter(Boolean) ?? [];
const clientUrls = configuredClientUrls.length
  ? configuredClientUrls
  : process.env.NODE_ENV !== "production"
    ? ["http://localhost:5173"]
    : [];
if (!clientUrls.length) {
  throw new Error("CLIENT_URL must be configured in production.");
}
app.use(cors({ origin: clientUrls, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart",cartRoutes )
app.use("/api/orders", orderRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/admin", adminRoutes)

export default app;