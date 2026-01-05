// Seed script for KRAFTA demo data
// Run with: npx prisma db seed

import { PrismaClient, Role, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding KRAFTA demo data...");

  // Clear existing data in a safe order
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.technician.deleteMany();
  await prisma.user.deleteMany();

  // Admin
  const admin = await prisma.user.create({
    data: {
      name: "KRAFTA Admin",
      email: "admin@krafta.local",
      role: Role.ADMIN,
    },
  });

  // Customers
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

  // Technicians + Users
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

  // Bookings + Reviews
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer1.id,
      technicianId: electrician.id,
      status: BookingStatus.COMPLETED,
      requestedAt: new Date(),
      scheduledFor: new Date(),
      completedAt: new Date(),
      description: "Living room lights flickering and one socket not working.",
      address: "Customer address, Lekki Phase 1",
      priceQuoted: 150,
    },
  });

  const booking2 = await prisma.booking.create({
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

  await prisma.review.create({
    data: {
      bookingId: booking1.id,
      customerId: customer1.id,
      technicianId: electrician.id,
      rating: 5,
      comment: "Arrived on time, fixed everything quickly, and explained the issue clearly.",
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


