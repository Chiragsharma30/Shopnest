
const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE ORDER + UPDATE STOCK ATOMICALLY
router.post("/", protect, async (req, res) => {
  let session;

  try {
    const { customer, items, paymentMethod } = req.body;

    // Validate customer details
    if (
      !customer ||
      !customer.fullName ||
      !customer.email ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete customer details are required.",
      });
    }

    // Validate order items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product.",
      });
    }

    session = await mongoose.startSession();

    let createdOrder;

    await session.withTransaction(async () => {
      const orderItems = [];

      for (const item of items) {
        const productId = item.productId || item._id || item.id;

        if (!mongoose.isValidObjectId(productId)) {
          const error = new Error("Invalid product ID.");
          error.statusCode = 400;
          throw error;
        }

        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
          const error = new Error(
            "Quantity must be a positive integer."
          );
          error.statusCode = 400;
          throw error;
        }

        // Decrease stock only if sufficient stock is available.
        const product = await Product.findOneAndUpdate(
          {
            _id: productId,
            stock: { $gte: quantity },
          },
          {
            $inc: { stock: -quantity },
          },
          {
            new: true,
            session,
            runValidators: true,
          }
        );

        if (!product) {
          const exists = await Product.findById(productId).session(
            session
          );

          const error = new Error(
            exists
              ? `Insufficient stock for ${exists.name}.`
              : `Product not found: ${productId}`
          );

          error.statusCode = exists ? 400 : 404;
          throw error;
        }

        // Use prices and product details from the database.
        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
          category: product.category,
        });
      }

      const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const [order] = await Order.create(
        [
          {
            user: req.user.userId,
            orderNumber: `SN-${Date.now()}-${Math.floor(
              Math.random() * 1000000
            )}`,
            customer: {
              fullName: customer.fullName,
              email: customer.email,
              phone: customer.phone,
              address: customer.address,
              city: customer.city,
              state: customer.state,
              postalCode: customer.postalCode,
            },
            items: orderItems,
            total,
            paymentMethod:
              paymentMethod === "UPI (Demo)"
                ? "UPI (Demo)"
                : "Cash on Delivery",
          },
        ],
        { session }
      );

      createdOrder = order;
    });

    return res.status(201).json({
      success: true,
      message: "Order created and stock updated successfully.",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create order.",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
});

// GET ORDERS
// Admin: all orders
// Customer: only their own orders
router.get("/", protect, async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : { user: req.user.userId };

    const orders = await Order.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
});

// UPDATE ORDER STATUS — ADMIN ONLY
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
});

module.exports = router;
