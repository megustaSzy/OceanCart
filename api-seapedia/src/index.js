import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

// Routes
import AuthRoute from "./routes/AuthRoute.js";
import StoreRoute from "./routes/StoreRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import WalletRoute from "./routes/WalletRoute.js";
import CartRoute from "./routes/CartRoute.js";
import OrderRoute from "./routes/OrderRoute.js";
import DriverRoute from "./routes/DriverRoute.js";
import AdminRoute from "./routes/AdminRoute.js";
import AddressRoute from "./routes/AddressRoute.js";
import ReviewRoute from "./routes/ReviewRoute.js";
import VoucherRoute from "./routes/VoucherRoute.js";
import "./cron/overdueCron.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", AuthRoute);
app.use("/api/stores", StoreRoute);
app.use("/api/products", ProductRoute);
app.use("/api/wallet", WalletRoute);
app.use("/api/cart", CartRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/driver", DriverRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/addresses", AddressRoute);
app.use("/api/reviews", ReviewRoute);
app.use("/api/vouchers", VoucherRoute);

// Global Error Handler
app.use(errorMiddleware);

export default app;
