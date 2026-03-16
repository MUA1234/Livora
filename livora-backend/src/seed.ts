import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import dns from "node:dns";
import { User } from "./models/User.model";
import { Product } from "./models/Product.model";
import { Review } from "./models/Review.model";
import Consultation from "./models/consultation.model";
import { ConsultationRequest } from "./models/ConsultationRequest.model";
import Room from "./models/room.model";
import Design from "./models/design.model";

dotenv.config();

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://livoraAdmin:Livora123DB@cluster0.pwmr7wq.mongodb.net/Livora?appName=Cluster0";

const products = [
    {
        name: "Hampton 3-Seater Sofa",
        sku: "SOF-0912",
        category: "Sofas",
        price: 257999,
        description: "Elegant 3-seater sofa with premium fabric upholstery and solid wood legs. Perfect centerpiece for your living room.",
        width: 210,
        height: 85,
        depth: 90,
        colors: ["#C6A75E", "#1C1C1C", "#663F23"],
        materials: ["Fabric", "Wood"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800", sortOrder: 0 },
            { imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800", sortOrder: 1 }
        ]
    },
    {
        name: "Oskar Dining Chair",
        sku: "CHR-4431",
        category: "Chairs",
        price: 15499,
        description: "Minimalist wooden dining chair featuring an ergonomic curved backrest and a comfortable upholstered seat.",
        width: 45,
        height: 85,
        depth: 50,
        colors: ["#1C1C1C", "#E5E5E5"],
        materials: ["Wood"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Aura Marble Coffee Table",
        sku: "TBL-1029",
        category: "Tables",
        price: 22599,
        description: "Stunning marble top coffee table with sleek metal base. Elevates any living space with sophistication.",
        width: 120,
        height: 45,
        depth: 60,
        colors: ["#E5E5E5", "#1C1C1C"],
        materials: ["Marble", "Metal"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Luna Upholstered Bed",
        sku: "BED-7762",
        category: "Beds",
        price: 349999,
        description: "Luxurious upholstered bed frame with padded headboard and solid construction for ultimate comfort.",
        width: 180,
        height: 120,
        depth: 210,
        colors: ["#E5E5E5", "#663F23"],
        materials: ["Fabric", "Wood"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Lumina Floor Lamp",
        sku: "LMP-2210",
        category: "Lighting",
        price: 35500,
        description: "Contemporary floor lamp with adjustable arm and warm ambient lighting. Brass finish with marble base.",
        width: 40,
        height: 165,
        depth: 40,
        colors: ["#C6A75E", "#E5E5E5"],
        materials: ["Metal", "Marble"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Nordic Oak Bookshelf",
        sku: "STR-5590",
        category: "Storage",
        price: 37599,
        description: "Scandinavian-inspired oak bookshelf with five spacious shelves. Clean lines and natural wood grain finish.",
        width: 90,
        height: 180,
        depth: 35,
        colors: ["#C6A75E", "#E5E5E5"],
        materials: ["Wood"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Celeste Round Dining Table",
        sku: "TBL-3388",
        category: "Tables",
        price: 32469,
        description: "Elegant round dining table with solid oak top and tapered legs. Seats four comfortably.",
        width: 120,
        height: 75,
        depth: 120,
        colors: ["#C6A75E", "#663F23"],
        materials: ["Wood"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Milo Lounge Chair",
        sku: "CHR-9921",
        category: "Chairs",
        price: 180000,
        description: "Premium velvet lounge chair with deep cushioning and gold-tone metal legs. Statement piece for any room.",
        width: 75,
        height: 80,
        depth: 80,
        colors: ["#4B5320", "#C6A75E", "#900D2D", "#1C1C1C"],
        materials: ["Velvet", "Metal"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Aston Leather Sofa",
        sku: "SOF-1177",
        category: "Sofas",
        price: 425000,
        description: "Premium full-grain leather sofa with deep seating and chrome legs. Italian craftsmanship at its finest.",
        width: 220,
        height: 80,
        depth: 95,
        colors: ["#663F23", "#1C1C1C"],
        materials: ["Leather", "Metal"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Cascade Pendant Light",
        sku: "LMP-4455",
        category: "Lighting",
        price: 28900,
        description: "Modern cascading pendant light with hand-blown glass shades. Creates stunning ambient lighting.",
        width: 50,
        height: 60,
        depth: 50,
        colors: ["#C6A75E", "#E5E5E5"],
        materials: ["Glass", "Metal"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Sienna TV Console",
        sku: "STR-7821",
        category: "Storage",
        price: 45999,
        description: "Mid-century modern TV console with sliding doors and cable management. Walnut veneer finish.",
        width: 160,
        height: 55,
        depth: 40,
        colors: ["#663F23", "#1C1C1C"],
        materials: ["Wood", "Metal"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Woven Jute Area Rug",
        sku: "RUG-3310",
        category: "Rugs",
        price: 18500,
        description: "Handwoven jute rug with natural texture. Adds warmth and character to any floor space. 200cm x 300cm.",
        width: 200,
        height: 1,
        depth: 300,
        colors: ["#C6A75E", "#E5E5E5"],
        materials: ["Jute"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Mira Wall Mirror",
        sku: "DEC-2201",
        category: "Decor",
        price: 12999,
        description: "Large circular wall mirror with slim brass frame. 80cm diameter, perfect for entryways and living rooms.",
        width: 80,
        height: 80,
        depth: 3,
        colors: ["#C6A75E"],
        materials: ["Glass", "Metal"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Verona Nightstand",
        sku: "STR-1199",
        category: "Storage",
        price: 14500,
        description: "Compact nightstand with two drawers and brass pulls. Solid mango wood construction.",
        width: 45,
        height: 55,
        depth: 40,
        colors: ["#663F23", "#C6A75E"],
        materials: ["Wood", "Metal"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Atlas Office Desk",
        sku: "TBL-6602",
        category: "Tables",
        price: 52999,
        description: "Executive office desk with large work surface, integrated cable tray, and two storage drawers.",
        width: 150,
        height: 75,
        depth: 70,
        colors: ["#1C1C1C", "#663F23"],
        materials: ["Wood", "Metal"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Cloud Sectional Sofa",
        sku: "SOF-8833",
        category: "Sofas",
        price: 589000,
        description: "Modular cloud sofa with deep sink-in cushions. Ultra-soft boucle fabric in off-white. Configurable L-shape.",
        width: 300,
        height: 70,
        depth: 200,
        colors: ["#E5E5E5", "#D2B48C"],
        materials: ["Fabric", "Wood"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Botanical Ceramic Vase Set",
        sku: "DEC-5501",
        category: "Decor",
        price: 8900,
        description: "Set of 3 handcrafted ceramic vases in varying heights. Matte terracotta finish with organic shapes.",
        width: 15,
        height: 30,
        depth: 15,
        colors: ["#C6A75E", "#E5E5E5", "#663F23"],
        materials: ["Ceramic"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    },
    {
        name: "Persian Silk Rug",
        sku: "RUG-7701",
        category: "Rugs",
        price: 125000,
        description: "Hand-knotted Persian-style silk blend rug with intricate floral pattern. 250cm x 350cm.",
        width: 250,
        height: 1,
        depth: 350,
        colors: ["#900D2D", "#C6A75E", "#0A3622"],
        materials: ["Silk", "Wool"],
        images: [
            { imageUrl: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800", sortOrder: 0 }
        ]
    }
];

const adminUser = {
    name: "Sara Samarasinghe",
    email: "admin@livora.com",
    password: "Admin@123",
    role: "admin" as const,
    phone: "+94771234567",
    avatarUrl: "",
    preferences: {
        emailAlerts: true,
        pushAlerts: true,
        theme: "light",
        fontSize: "medium"
    }
};

const sampleUsers = [
    { name: "Roshan De Mel", email: "roshan@example.com", password: "User@123", role: "user" as const, phone: "+94772345678" },
    { name: "Priya Mendis", email: "priya@example.com", password: "User@123", role: "user" as const, phone: "+94773456789" },
    { name: "Kamal Perera", email: "kamal@example.com", password: "User@123", role: "user" as const, phone: "+94774567890" },
    { name: "Tharinda Bandara", email: "tharinda@example.com", password: "User@123", role: "user" as const, phone: "+94775678901" },
    { name: "Amara Silva", email: "amara@example.com", password: "User@123", role: "user" as const, phone: "+94776789012" },
    { name: "Nisha Fernando", email: "nisha@example.com", password: "User@123", role: "user" as const, phone: "+94777890123" },
];

const reviewTemplates = [
    { rating: 5, title: "Absolutely stunning piece", body: "This exceeded all my expectations. The craftsmanship is impeccable and it fits perfectly in our living room. Highly recommend to anyone looking for quality furniture." },
    { rating: 4, title: "Great quality, minor issue", body: "Beautiful design and solid build quality. The only reason I'm giving 4 stars is that the delivery took a bit longer than expected. Otherwise, a fantastic purchase." },
    { rating: 5, title: "Best furniture purchase ever", body: "We've been searching for the perfect piece for months and this is it. The materials are premium and the finish is flawless. Worth every rupee." },
    { rating: 3, title: "Good but not perfect", body: "The design is lovely and looks great in photos. In person, the color was slightly different from what I expected. Still a decent purchase overall." },
    { rating: 4, title: "Elegant and well-made", body: "Really happy with this purchase. It's sturdy, looks elegant, and the assembly was straightforward. Would definitely buy from Livora again." },
    { rating: 5, title: "Premium quality throughout", body: "From the packaging to the final product, everything screams quality. The attention to detail is remarkable. This is furniture that will last generations." },
    { rating: 4, title: "Lovely addition to our home", body: "Added so much character to our room. The finish is smooth and the proportions are just right. Very pleased with this purchase." },
    { rating: 3, title: "Decent for the price", body: "It looks nice and serves its purpose well. However, I expected slightly better finishing at this price point. Still a reasonable buy." },
    { rating: 5, title: "Exceeded expectations", body: "Ordered this based on the photos and was pleasantly surprised by how much better it looks in person. Absolutely love it!" },
    { rating: 4, title: "Solid craftsmanship", body: "You can tell this was made with care. The joints are tight, the finish is even, and it feels substantial. A quality piece of furniture." },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        console.log("Clearing existing data...");
        await Product.deleteMany({});
        await Review.deleteMany({});
        await User.deleteMany({});

        console.log("Creating admin user...");
        const adminHash = await bcrypt.hash(adminUser.password, 10);
        const admin = await User.create({
            name: adminUser.name,
            email: adminUser.email,
            passwordHash: adminHash,
            role: adminUser.role,
            phone: adminUser.phone,
            avatarUrl: adminUser.avatarUrl,
            preferences: adminUser.preferences
        });
        console.log(`  Admin: ${admin.email}`);

        console.log("Creating sample users...");
        const createdUsers = [];
        for (const u of sampleUsers) {
            const hash = await bcrypt.hash(u.password, 10);
            const user = await User.create({
                name: u.name,
                email: u.email,
                passwordHash: hash,
                role: u.role,
                phone: u.phone
            });
            createdUsers.push(user);
            console.log(`  User: ${user.email}`);
        }

        console.log("Creating products...");
        const createdProducts = await Product.insertMany(products);
        console.log(`  ${createdProducts.length} products created`);

        console.log("Creating reviews...");
        let reviewCount = 0;
        for (let i = 0; i < createdProducts.length; i++) {
            const product = createdProducts[i];
            const numReviews = Math.floor(Math.random() * 4) + 1;
            const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5);

            for (let j = 0; j < Math.min(numReviews, shuffledUsers.length); j++) {
                const template = reviewTemplates[(i + j) % reviewTemplates.length];
                await Review.create({
                    userId: shuffledUsers[j]._id,
                    productId: product._id,
                    rating: template.rating,
                    title: template.title,
                    body: template.body,
                    verified: Math.random() > 0.3,
                    helpfulCount: Math.floor(Math.random() * 20)
                });
                reviewCount++;
            }
        }
        console.log(`  ${reviewCount} reviews created`);

        console.log("Clearing rooms, designs, consultations...");
        await Room.deleteMany({});
        await Design.deleteMany({});
        await Consultation.deleteMany({});
        await ConsultationRequest.deleteMany({});

        console.log("Creating rooms...");
        const rooms = await Room.insertMany([
            {
                name: "Modern Living Room",
                dimensions: { length: 6, width: 4.5, height: 3, unit: "m" },
                shape: "rectangular",
                walls: [
                    { id: "wall-1", width: 6, height: 3, color: "#F5F2EC" },
                    { id: "wall-2", width: 4.5, height: 3, color: "#F5F2EC" },
                    { id: "wall-3", width: 6, height: 3, color: "#E8DCC4" },
                    { id: "wall-4", width: 4.5, height: 3, color: "#F5F2EC" }
                ],
                flooring: { type: "hardwood", material: "oak" }
            },
            {
                name: "Master Bedroom Suite",
                dimensions: { length: 5, width: 4, height: 3, unit: "m" },
                shape: "rectangular",
                walls: [
                    { id: "wall-1", width: 5, height: 3, color: "#E8E0D4" },
                    { id: "wall-2", width: 4, height: 3, color: "#E8E0D4" },
                    { id: "wall-3", width: 5, height: 3, color: "#D4C3A3" },
                    { id: "wall-4", width: 4, height: 3, color: "#E8E0D4" }
                ],
                flooring: { type: "carpet", material: "wool" }
            },
            {
                name: "Dining Area",
                dimensions: { length: 4, width: 3.5, height: 3, unit: "m" },
                shape: "rectangular",
                walls: [
                    { id: "wall-1", width: 4, height: 3, color: "#FFFFFF" },
                    { id: "wall-2", width: 3.5, height: 3, color: "#FFFFFF" }
                ],
                flooring: { type: "tile", material: "marble" }
            }
        ]);
        console.log(`  ${rooms.length} rooms created`);

        console.log("Creating designs...");
        const demoShareToken = crypto.randomBytes(16).toString("hex");
        const designs = await Design.insertMany([
            {
                name: "Contemporary Comfort Living",
                roomId: rooms[0]._id,
                layoutData: {
                    furniture: [
                        { productId: createdProducts[0]._id, position: { x: 2, y: 0, z: 1 }, rotation: 0 },
                        { productId: createdProducts[2]._id, position: { x: 2, y: 0, z: 2.5 }, rotation: 0 },
                        { productId: createdProducts[4]._id, position: { x: 0.5, y: 0, z: 0.5 }, rotation: 45 }
                    ]
                },
                status: "published",
                shareToken: demoShareToken,
                sharedAt: new Date(),
                shareExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            {
                name: "Elegant Bedroom Retreat",
                roomId: rooms[1]._id,
                layoutData: {
                    furniture: [
                        { productId: createdProducts[3]._id, position: { x: 2.5, y: 0, z: 0.5 }, rotation: 0 },
                        { productId: createdProducts[13]._id, position: { x: 0.5, y: 0, z: 0.5 }, rotation: 0 },
                        { productId: createdProducts[9]._id, position: { x: 4, y: 0, z: 2 }, rotation: 0 }
                    ]
                },
                status: "published"
            },
            {
                name: "Minimalist Dining Setup",
                roomId: rooms[2]._id,
                layoutData: {
                    furniture: [
                        { productId: createdProducts[6]._id, position: { x: 2, y: 0, z: 1.75 }, rotation: 0 },
                        { productId: createdProducts[1]._id, position: { x: 1.5, y: 0, z: 1 }, rotation: 0 }
                    ]
                },
                status: "draft"
            }
        ]);
        console.log(`  ${designs.length} designs created`);

        console.log("Creating consultations (admin workflow)...");
        const consultations = await Consultation.insertMany([
            {
                userId: createdUsers[0]._id,
                designId: designs[0]._id,
                status: "pending",
                messageThread: [
                    { sender: "user", message: "Hi, I'd like to get a design consultation for my living room. I love the contemporary style.", timestamp: new Date("2026-03-10T09:30:00") },
                    { sender: "admin", message: "Welcome Roshan! We'd be happy to help. Could you share photos of your current living room?", timestamp: new Date("2026-03-10T14:00:00") },
                    { sender: "user", message: "Sure, I'll send them over. The room is about 6m x 4.5m with hardwood floors.", timestamp: new Date("2026-03-10T15:30:00") }
                ]
            },
            {
                userId: createdUsers[1]._id,
                designId: designs[1]._id,
                status: "accepted",
                messageThread: [
                    { sender: "user", message: "I need help redesigning my master bedroom. Looking for something elegant and cozy.", timestamp: new Date("2026-03-08T11:00:00") },
                    { sender: "admin", message: "Hi Priya! We have a beautiful bedroom design ready. Let me share the preview with you.", timestamp: new Date("2026-03-08T16:00:00") },
                    { sender: "system", message: "Status changed to accepted", timestamp: new Date("2026-03-08T16:01:00") },
                    { sender: "admin", message: "Here's your room preview link. Please review and let us know your thoughts!", timestamp: new Date("2026-03-09T10:00:00") }
                ]
            },
            {
                userId: createdUsers[2]._id,
                designId: designs[2]._id,
                status: "completed",
                messageThread: [
                    { sender: "user", message: "Looking for a minimalist dining setup for our new apartment.", timestamp: new Date("2026-03-01T08:00:00") },
                    { sender: "admin", message: "Great choice! We've prepared a minimalist dining design for you.", timestamp: new Date("2026-03-01T14:00:00") },
                    { sender: "system", message: "Status changed to accepted", timestamp: new Date("2026-03-02T09:00:00") },
                    { sender: "user", message: "This looks perfect! We'll go ahead with this design.", timestamp: new Date("2026-03-05T11:00:00") },
                    { sender: "system", message: "Status changed to completed", timestamp: new Date("2026-03-06T10:00:00") }
                ]
            },
            {
                userId: createdUsers[3]._id,
                status: "pending",
                messageThread: [
                    { sender: "user", message: "I'm interested in getting my home office designed. Need a productive workspace.", timestamp: new Date("2026-03-12T10:00:00") }
                ]
            },
            {
                userId: createdUsers[4]._id,
                status: "rejected",
                messageThread: [
                    { sender: "user", message: "Can you design an outdoor patio space?", timestamp: new Date("2026-03-05T13:00:00") },
                    { sender: "admin", message: "Thank you for your interest. Unfortunately, we currently only offer indoor design consultations. We hope to expand to outdoor spaces soon!", timestamp: new Date("2026-03-05T17:00:00") },
                    { sender: "system", message: "Status changed to rejected", timestamp: new Date("2026-03-05T17:01:00") }
                ]
            }
        ]);
        console.log(`  ${consultations.length} consultations created`);

        console.log("Creating consultation requests (public form)...");
        const consultationRequests = await ConsultationRequest.insertMany([
            {
                userId: createdUsers[0]._id,
                fullName: "Roshan De Mel",
                email: "roshan@example.com",
                phone: "+94772345678",
                roomType: "living-room",
                roomSize: "6m x 4.5m",
                preferredDate: new Date("2026-03-20"),
                notes: "Looking for a modern contemporary style with warm tones.",
                status: "confirmed"
            },
            {
                userId: createdUsers[1]._id,
                fullName: "Priya Mendis",
                email: "priya@example.com",
                phone: "+94773456789",
                roomType: "bedroom",
                roomSize: "5m x 4m",
                preferredDate: new Date("2026-03-18"),
                notes: "Want an elegant and cozy bedroom retreat.",
                status: "completed"
            },
            {
                userId: createdUsers[2]._id,
                fullName: "Kamal Perera",
                email: "kamal@example.com",
                phone: "+94774567890",
                roomType: "dining-room",
                roomSize: "4m x 3.5m",
                notes: "Minimalist dining setup for a new apartment.",
                status: "completed"
            },
            {
                userId: createdUsers[3]._id,
                fullName: "Tharinda Bandara",
                email: "tharinda@example.com",
                phone: "+94775678901",
                roomType: "home-office",
                roomSize: "3.5m x 3m",
                preferredDate: new Date("2026-03-25"),
                notes: "Need a productive workspace design.",
                status: "pending"
            },
            {
                fullName: "Sanduni Jayawardena",
                email: "sanduni@example.com",
                phone: "+94778901234",
                roomType: "living-room",
                roomSize: "5m x 4m",
                preferredDate: new Date("2026-04-01"),
                notes: "First-time homeowner, need help with full living room setup.",
                status: "pending"
            }
        ]);
        console.log(`  ${consultationRequests.length} consultation requests created`);

        console.log("\nSeed completed successfully!");
        console.log("\nLogin credentials:");
        console.log(`  Admin: admin@livora.com / Admin@123`);
        console.log(`  User:  roshan@example.com / User@123`);
        console.log(`\nDemo preview URL: http://localhost:3000/preview/${demoShareToken}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

seed();
