import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

try {
    console.log("main")
   
    // Create Users
    const user1 = await prisma.users.create({
      data: {
        email: 'user1@example.com',
        password: 'password1',
        nama: 'User 1',
        role: 'user',
      },
    });

    const user2 = await prisma.users.create({
      data: {
        email: 'user2@example.com',
        password: 'password2',
        nama: 'User 2',
        role: 'user',
      },
    });

    // Create Suppliers
    const supplier1 = await prisma.suppliers.create({
      data: {
        kode: 'SUP1',
        nama: 'Supplier 1',
      },
    });

    const supplier2 = await prisma.suppliers.create({
      data: {
        kode: 'SUP2',
        nama: 'Supplier 2',
      },
    });

    // Create Vehicles
    const vehicle1 = await prisma.vehicles.create({
      data: {
        plat: 'B1234CD',
        warna: 'Merah',
        merk: 'Toyota',
        rangka: '1234567890',
        supplier: {
          connect: {
            kode: supplier1.kode,
          },
        },
      },
    });

    const vehicle2 = await prisma.vehicles.create({
      data: {
        plat: 'B5678EF',
        warna: 'Biru',
        merk: 'Honda',
        rangka: '0987654321',
        supplier: {
          connect: {
            kode: supplier2.kode,
          },
        },
      },
    });

    // Create Factories
    const factory1 = await prisma.factories.create({
      data: {
        kode: 'FAC1',
        nama: 'Factory 1',
        harga_pabrik: {
          create: {
            harga: 1000000,
          },
        },
        Suppliers: {
          connect: {
            kode: supplier1.kode,
          },
        },
      },
    });

    const factory2 = await prisma.factories.create({
      data: {
        kode: 'FAC2',
        nama: 'Factory 2',
        harga_pabrik: {
          create: {
            harga: 2000000,
          },
        },
        Suppliers: {
          connect: {
            kode: supplier2.kode,
          },
        },
      },
    });

    // Create Farmers
    const farmer1 = await prisma.farmers.create({
      data: {
        nama: 'Farmer 1',
        kode: 'FARM1',
      },
    });

    const farmer2 = await prisma.farmers.create({
      data: {
        nama: 'Farmer 2',
        kode: 'FARM2',
      },
    });

    console.log('Seeding completed!');
} catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
}
