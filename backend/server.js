
const User = require("./models/User");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);



// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShopNest backend is running!",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// CREATE user
app.post("/api/test-users", async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// READ all users
app.get("/api/test-users", async (req, res) => {
  try {
    const users = await User.find();

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// READ one user
app.get("/api/test-users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// UPDATE user
app.put("/api/test-users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE user
app.delete("/api/test-users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Connect to MongoDB, then start the API server
async function startServer() {
  const primaryUri = process.env.MONGO_URI;
  const localUri = process.env.LOCAL_MONGO_URI;

  if (!primaryUri) {
    console.error("Startup error: MONGO_URI is missing from .env");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");

    // Keep the URI as supplied by .env.
    // retryWrites=false can remain in the URI if your deployment needs it.
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`ShopNest backend running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}`);
    });
  } catch (atlasErr) {
    console.error("MongoDB connection failed.");
    console.error("Error name:", atlasErr.name);
    console.error("Error message:", atlasErr.message);

    if (atlasErr.reason) {
      console.dir(atlasErr.reason, { depth: 3 });
    }

    // Use local MongoDB only if LOCAL_MONGO_URI is explicitly configured.
    if (localUri) {
      try {
        console.log("Trying configured local MongoDB...");

        await mongoose.connect(localUri, {
          serverSelectionTimeoutMS: 5000,
        });

        console.log("Local MongoDB connected successfully!");

        app.listen(PORT, () => {
          console.log(`ShopNest backend running on port ${PORT}`);
          console.log(`API: http://localhost:${PORT}`);
        });

        return;
      } catch (localErr) {
        console.error("Local MongoDB connection failed:", localErr.message);
      }
    }

    console.error(
      "Startup aborted. Check the MongoDB TLS/network error above."
    );
    process.exit(1);
  }
}

startServer();
