

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

try {
    console.log("main")
    const pw = await Bun.password.hash('password1')
   
    // Create Users
    const user1 = await prisma.users.create({
      data: {
        email: 'user1@example.com',
        password: pw,
        name: 'User 1',
        role: 'user',
      },
    });

    const user2 = await prisma.users.create({
      data: {
        email: 'user2@example.com',
        password: pw,
        name: 'User 2',
        role: 'user',
      },
    });

    // Create Suppliers
    const supplier1 = await prisma.suppliers.create({
      data: {
        code: 'SUP1',
        name: 'Supplier 1',
      },
    });

    const supplier2 = await prisma.suppliers.create({
      data: {
        code: 'SUP2',
        name: 'Supplier 2',
      },
    });

    // Create Vehicles
    const vehicle1 = await prisma.vehicles.create({
      data: {
        plate: 'B1234CD',
        color: 'Merah',
        brand: 'Toyota',
        chassis: '1234567890',
        supplierId: supplier1.id,
      },
    });

    const vehicle2 = await prisma.vehicles.create({
      data: {
        plate: 'B5678EF',
        color: 'Biru',
        brand: 'Honda',
        chassis: '0987654321',
        supplierId: supplier2.id,
      },
    });

    // Create Factories
    const factory1 = await prisma.factories.create({
      data: {
        code: 'FAC1',
        name: 'Factory 1',
        prices: {
          create: {
            price: 1000000,
          },
        },
        suppliers: {
          connect: {
            code: supplier1.code,
          },
        },
      },
    });

    const factory2 = await prisma.factories.create({
      data: {
        code: 'FAC2',
        name: 'Factory 2',
        prices: {
          create: {
            price: 2000000,
          },
        },
        suppliers: {
          connect: {
            code: supplier2.code,
          },
        },
      },
    });


    // Create Farmers
    const farmer1 = await prisma.farmers.create({
      data: {
        name: 'Farmer 1',
        code: 'FARM1',
        address: 'Jl. Raya Bogor KM 30',
        phone: '081234567890',
      },
    });

    const farmer2 = await prisma.farmers.create({
      data: {
        name: 'Farmer 2',
        code: 'FARM2',
        address: 'Jl. Raya Bogor KM 40',
        phone: '081234567891',
      },
    });

    console.log('Seeding completed!');
} catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
}
