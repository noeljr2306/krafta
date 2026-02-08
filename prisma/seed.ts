import { PrismaClient, Role, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding KRAFTA demo data...");

  try {
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.technician.deleteMany();
    await prisma.user.deleteMany();
    console.log("Cleaned up existing data.");
  } catch (error) {
    console.log("No existing tables found to clean, skipping to creation...");
  }

  const admin = await prisma.user.create({
    data: {
      name: "KRAFTA Admin",
      email: "admin@krafta.local",
      role: Role.ADMIN,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "Noel Customer",
      email: "customer@krafta.local",
      role: Role.CUSTOMER,
      phone: "+1 555 0100",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Alex Homeowner",
      email: "alex@krafta.local",
      role: Role.CUSTOMER,
      phone: "+1 555 0101",
    },
  });

  const electricianUser = await prisma.user.create({
    data: {
      name: "Maria Electric",
      email: "maria@krafta.local",
      role: Role.PROFESSIONAL,
      phone: "+1 555 0200",
    },
  });

  const plumberUser = await prisma.user.create({
    data: {
      name: "James Plumbing",
      email: "james@krafta.local",
      role: Role.PROFESSIONAL,
      phone: "+1 555 0201",
    },
  });

  // --- TECHNICIANS ---

  const electrician = await prisma.technician.create({
    data: {
      userId: electricianUser.id,
      title: "Licensed Residential Electrician",
      bio: "10+ years of experience with residential wiring, panel upgrades, and emergency repairs.",
      skills: "Wiring,Panel upgrades,Emergency repairs",
      categories: "Electrical,Appliance Repair",
      baseRate: 120,
      hourlyRate: 80,
      city: "Lagos",
      area: "Lekki Phase 1",
      latitude: 6.4483,
      longitude: 3.4845,
      isVerified: true,
    },
  });

  const plumber = await prisma.technician.create({
    data: {
      userId: plumberUser.id,
      title: "Emergency Plumber",
      bio: "Fast response for leaks, blockages, and bathroom/kitchen installations.",
      skills: "Leak detection,Pipe replacement,Bathroom installs",
      categories: "Plumbing",
      baseRate: 100,
      hourlyRate: 70,
      city: "Lagos",
      area: "Yaba",
      latitude: 6.5173,
      longitude: 3.3869,
      isVerified: true,
    },
  });

  // --- BOOKINGS (The "Meat" of the Demo) ---

  // 1. Completed & Reviewed
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer1.id,
      technicianId: electrician.id,
      status: BookingStatus.COMPLETED,
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 40),
      description: "Living room lights flickering and one socket not working.",
      address: "Customer address, Lekki Phase 1",
      priceQuoted: 150,
    },
  });

  // 2. Accepted (Scheduled for tomorrow)
  await prisma.booking.create({
    data: {
      customerId: customer2.id,
      technicianId: plumber.id,
      status: BookingStatus.ACCEPTED,
      requestedAt: new Date(),
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24),
      description: "Kitchen sink leakage and low water pressure.",
      address: "Customer address, Yaba",
      priceQuoted: 130,
    },
  });

  // 3. NEW: Paid Booking (Work done, payment confirmed)
  await prisma.booking.create({
    data: {
      customerId: customer1.id,
      technicianId: plumber.id,
      status: BookingStatus.PAID,
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      description: "Toilet flush system repair.",
      address: "Customer address, Lekki Phase 1",
      priceQuoted: 90,
    },
  });

  // 4. NEW: Pending Request (For testing the Admin/Tech notification flow)
  await prisma.booking.create({
    data: {
      customerId: customer2.id,
      technicianId: electrician.id,
      status: BookingStatus.PENDING,
      requestedAt: new Date(),
      description: "Installation of a new water heater.",
      address: "Customer address, Yaba",
    },
  });

  // --- REVIEWS ---

  await prisma.review.create({
    data: {
      bookingId: booking1.id,
      customerId: customer1.id,
      technicianId: electrician.id,
      rating: 5,
      comment:
        "Arrived on time, fixed everything quickly, and explained the issue clearly.",
    },
  });

  console.log("✅ Seed complete.");
  console.table({
    admin: admin.email,
    customers: [customer1.email, customer2.email],
    technicians: [electricianUser.email, plumberUser.email],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
