require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.config");
const { errorHandler } = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const masterRoutes = require("./routes/master.routes");
const bookingRoutes = require("./routes/booking.routes");
const clientRoutes = require("./routes/client.routes");
const paymentRoutes = require("./routes/payment.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const planRoutes = require("./routes/plan.routes");
const telegramRoutes = require("./routes/telegram.routes");


connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("API BeautyFlow ready to work and working! ");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/masters", masterRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/telegram", telegramRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`BeautyFlow working on port ${PORT}`)
);
