import { getDb } from "../src/db/index";
import {
  users,
  resourceCategories,
  resources,
  bookings,
  availabilityRules,
  availabilityExceptions,
  notifications,
} from "../src/db/schema";

async function seed() {
  console.log("🌱 Starting database seeding...");

  const db = getDb();

  // Seed Users
  console.log("Creating users...");
  const [admin, user1, user2] = await db
    .insert(users)
    .values([
      {
        name: "Admin User",
        email: "admin@concordia.ca",
        passwordHash: Buffer.from("admin123").toString("base64"),
        role: "admin",
      },
      {
        name: "John Smith",
        email: "john.smith@concordia.ca",
        passwordHash: Buffer.from("password123").toString("base64"),
        role: "user",
      },
      {
        name: "Jane Doe",
        email: "jane.doe@concordia.ca",
        passwordHash: Buffer.from("password123").toString("base64"),
        role: "user",
      },
    ])
    .returning();

  console.log("✓ Users created");

  // Seed Resource Categories
  console.log("Creating resource categories...");
  const [studyRoomCat, labCat, equipmentCat, facilityCat] = await db
    .insert(resourceCategories)
    .values([
      {
        name: "Study Room",
        description: "Quiet study spaces for individual or group work",
      },
      {
        name: "Computer Lab",
        description: "Labs equipped with computers and specialized software",
      },
      {
        name: "Equipment",
        description: "Specialized equipment for student use",
      },
      {
        name: "Sports Facility",
        description: "Athletic facilities and sports spaces",
      },
    ])
    .returning();

  console.log("✓ Resource categories created");

  // Seed Resources
  console.log("Creating resources...");
  const [room101, lab2, projector, gym] = await db
    .insert(resources)
    .values([
      {
        name: "Study Room 101",
        description: "Quiet study room with whiteboard and projector",
        categoryId: studyRoomCat.id,
        location: "Library Building, Floor 1",
        capacity: 8,
        status: "available",
        requiresApproval: false,
      },
      {
        name: "Computer Lab 2",
        description: "Lab with 30 high-performance computers",
        categoryId: labCat.id,
        location: "Engineering Building, Floor 2",
        capacity: 30,
        status: "available",
        requiresApproval: false,
      },
      {
        name: "Projector - Sony VPL",
        description: "High-quality projector for presentations",
        categoryId: equipmentCat.id,
        location: "Equipment Office, EV Building",
        capacity: 1,
        status: "available",
        requiresApproval: true,
      },
      {
        name: "Gymnasium",
        description: "Full-size gymnasium for sports activities",
        categoryId: facilityCat.id,
        location: "Sports Complex",
        capacity: 50,
        status: "available",
        requiresApproval: true,
      },
    ])
    .returning();

  console.log("✓ Resources created");

  // Seed Availability Rules
  console.log("Creating availability rules...");
  await db.insert(availabilityRules).values([
    // Study Room 101 - Monday to Friday, 8am-10pm
    { resourceId: room101.id, dayOfWeek: 1, openTime: "08:00", closeTime: "22:00" },
    { resourceId: room101.id, dayOfWeek: 2, openTime: "08:00", closeTime: "22:00" },
    { resourceId: room101.id, dayOfWeek: 3, openTime: "08:00", closeTime: "22:00" },
    { resourceId: room101.id, dayOfWeek: 4, openTime: "08:00", closeTime: "22:00" },
    { resourceId: room101.id, dayOfWeek: 5, openTime: "08:00", closeTime: "22:00" },
    
    // Computer Lab 2 - Monday to Friday, 9am-6pm
    { resourceId: lab2.id, dayOfWeek: 1, openTime: "09:00", closeTime: "18:00" },
    { resourceId: lab2.id, dayOfWeek: 2, openTime: "09:00", closeTime: "18:00" },
    { resourceId: lab2.id, dayOfWeek: 3, openTime: "09:00", closeTime: "18:00" },
    { resourceId: lab2.id, dayOfWeek: 4, openTime: "09:00", closeTime: "18:00" },
    { resourceId: lab2.id, dayOfWeek: 5, openTime: "09:00", closeTime: "18:00" },
    
    // Gymnasium - All week, 6am-11pm
    { resourceId: gym.id, dayOfWeek: 0, openTime: "06:00", closeTime: "23:00" },
    { resourceId: gym.id, dayOfWeek: 1, openTime: "06:00", closeTime: "23:00" },
    { resourceId: gym.id, dayOfWeek: 2, openTime: "06:00", closeTime: "23:00" },
    { resourceId: gym.id, dayOfWeek: 3, openTime: "06:00", closeTime: "23:00" },
    { resourceId: gym.id, dayOfWeek: 4, openTime: "06:00", closeTime: "23:00" },
    { resourceId: gym.id, dayOfWeek: 5, openTime: "06:00", closeTime: "23:00" },
    { resourceId: gym.id, dayOfWeek: 6, openTime: "06:00", closeTime: "23:00" },
  ]);

  console.log("✓ Availability rules created");

  // Seed Bookings
  console.log("Creating sample bookings...");
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  await db.insert(bookings).values([
    {
      userId: user1.id,
      resourceId: room101.id,
      startTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(16, 0, 0, 0)),
      purpose: "Group study session for SOEN 287",
      status: "confirmed",
    },
    {
      userId: user2.id,
      resourceId: lab2.id,
      startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
      purpose: "Software development project work",
      status: "confirmed",
    },
    {
      userId: user1.id,
      resourceId: projector.id,
      startTime: new Date(tomorrow.setHours(13, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(15, 0, 0, 0)),
      purpose: "Project presentation",
      status: "pending",
    },
  ]);

  console.log("✓ Sample bookings created");

  // Seed Notifications
  console.log("Creating notifications...");
  await db.insert(notifications).values([
    {
      userId: user1.id,
      title: "Booking Confirmed",
      message: "Your booking for Study Room 101 has been confirmed.",
      type: "booking_update",
      isRead: false,
    },
    {
      userId: user2.id,
      title: "Welcome to Campus Resource Booking",
      message:
        "Welcome! You can now start booking campus resources for your academic needs.",
      type: "announcement",
      isRead: false,
    },
  ]);

  console.log("✓ Notifications created");

  console.log("✅ Database seeding completed successfully!");
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
