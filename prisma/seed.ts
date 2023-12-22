

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


  // create supplier prices
  const supplierPrice1 = await prisma.supplierPrices.create({
    data: {
      price: 1000000,
      isPPN: true,
      supplierId: supplier1.id,
      factoryPriceId: factory1.id,
    },
  });

  const supplierPrice2 = await prisma.supplierPrices.create({
    data: {
      price: 2000000,
      isPPN: true,
      supplierId: supplier2.id,
      factoryPriceId: factory2.id,
    },
  });






  //  create prices









  // Create factory orders
  const factoryOrder1 = await prisma.factoryOrders.create({
    data: {
      invCode: 'INV1',
      invDate: new Date(),
      invTotal: 1000000,
      factoryId: factory1.id,
      factoryPriceId: factory1.id,
      qty: 10,
      status: 'Pending',

    },
  });

  const factoryOrder2 = await prisma.factoryOrders.create({
    data: {
      invCode: 'INV2',
      invDate: new Date(),
      invTotal: 2000000,
      factoryId: factory2.id,
      factoryPriceId: factory2.id,
      qty: 20,
      status: 'Pending',

    },
  });

  // create supplier orders
  const supplierOrder1 = await prisma.supplierOrders.create({
    data: {
      invCode: 'INV3',
      invDate: new Date(),
      invTotal: 1000000,
      supplierId: supplier1.id,
      factoryPriceId: factory1.id,
      supplierPriceId: supplierPrice1.id,
      qty: 10,
      status: 'Pending',
    }
  });

  const supplierOrder2 = await prisma.supplierOrders.create({
    data: {
      invCode: 'INV4',
      invDate: new Date(),
      invTotal: 4000000,
      supplierId: supplier2.id,
      factoryPriceId: factory2.id,
      supplierPriceId: supplierPrice2.id,
      qty: 20,
      status: 'Pending',
    }
  });


  //create vehicle orders
  const vehicleOrder1 = await prisma.vehicleOrders.create({
    data: {
      qty: 1,
      plate: vehicle1.plate,
      factoryOrdersId: factoryOrder1.id,
      supplierOrderId: supplierOrder1.id,
      invCode: 'INV5',

    }
  });


  const vehicleOrder2 = await prisma.vehicleOrders.create({
    data: {
      qty: 2,
      plate: vehicle2.plate,
      factoryOrdersId: factoryOrder2.id,
      supplierOrderId: supplierOrder2.id,
      invCode: 'INV6',

    }
  });



  //create farmer orders
  const farmerOrder1 = await prisma.farmerOrder.create({
    data: {
      transactionCode: 'INV7',
      transactionDate: new Date(),
      transactionTotal: 1000000,
      transactionType: 'Credit',
      farmerId: farmer1.id,
    }
  });

  const farmerOrder2 = await prisma.farmerOrder.create({
    data: {
      transactionCode: 'INV8',
      transactionDate: new Date(),
      transactionTotal: 2000000,
      transactionType: 'debit',
      farmerId: farmer2.id,
    }
  });

  //create bank accounts
  const bankAccount1 = await prisma.bankAccounts.create({
    data: {
      accountName: 'Bank 1',
      accountNumber: '1234567890',
      bankName: 'BCA',
      balance: 1000000,
      Factories: {
        connect: {
          code: factory1.code,
        }
      },
      bankTransactions: {
        create: {
          transactionCode: 'INV9',
          transactionDate: new Date(),
          amount: 1000000,
          transactionType: 'Credit',
        }
      }
    }
  });

  const bankAccount2 = await prisma.bankAccounts.create({
    data: {
      accountName: 'Bank 2',
      accountNumber: '0987654321',
      bankName: 'BNI',
      balance: 2000000,
      Factories: {
        connect: {
          code: factory2.code,
        }
      },
      bankTransactions: {
        create: {
          transactionCode: 'INV10',
          transactionDate: new Date(),
          amount: 2000000,
          transactionType: 'Credit',
        }
      }
    }
  });




  //create transaction



  console.log('Seeding completed!');
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
