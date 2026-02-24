require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for seeding");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const createAdmin = async () => {
    const adminEmail = "admin@store.com";

    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
        console.log("Admin already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
    });

    console.log("Admin Created");
};

const createProducts = async () => {

    // Clean old data (important during development)
    await Product.deleteMany();
    await Category.deleteMany();

    // Create Categories First
    const audio = await Category.create({ name: "Audio" });
    const wearables = await Category.create({ name: "Wearables" });
    const computers = await Category.create({ name: "Computers" });
    const photography = await Category.create({ name: "Photography" });

    console.log("Categories Created");

    // Create Products using category._id
    await Product.insertMany([
        {
            name: "Premium Wireless Headphones",
            description: "Noise cancelling headphones",
            price: 299,
            stock: 50,
            category: audio._id,
            image:
                "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
        },
        {
            name: "Smart Watch Pro",
            description: "Advanced fitness smartwatch",
            price: 449,
            stock: 40,
            category: wearables._id,
            image:
                "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
        },
        {
            name: 'Ultra Laptop 15"',
            description: "High performance laptop",
            price: 1299,
            stock: 25,
            category: computers._id,
            image:
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
        },
        {
            name: "Professional Camera Kit",
            description: "DSLR camera with accessories",
            price: 1899,
            stock: 15,
            category: photography._id,
            image:
                "https://images.unsplash.com/photo-1519183071298-a2962e402c41",
        },
    ]);

    console.log("Products Created");
};

const seed = async () => {
    await connectDB();

    // await Category.deleteMany();
    // await Product.deleteMany();

    // await createAdmin();
    await createProducts();
    console.log("Seeding Complete");
    process.exit();
};

seed();