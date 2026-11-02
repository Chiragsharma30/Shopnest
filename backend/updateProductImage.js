
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Product = require("./models/Product");

// dotenv.config();

// async function updateProductImage() {
//   try {
//     // MongoDB se connect karo
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected successfully!");

//     // Yahan product ki ID aur new image URL change karo
//     const productId = "6ad5c235a3039ff1c42705b6";

//     const newImageUrl =
//       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80";

//     // Database mein sirf image field update hogi
//     const updatedProduct = await Product.findByIdAndUpdate(
//       productId,
//       { image: newImageUrl },
//       { new: true, runValidators: true }
//     );

//     if (!updatedProduct) {
//       console.log("Product nahi mila. Product ID check karo.");
//       return;
//     }

//     console.log("Product image updated successfully!");
//     console.log("Product:", updatedProduct.name);
//     console.log("New image URL:", updatedProduct.image);
//   } catch (error) {
//     console.error("Image update failed:", error.message);
//   } finally {
//     await mongoose.disconnect();
//     console.log("MongoDB connection closed.");
//   }
// }

// updateProductImage();
