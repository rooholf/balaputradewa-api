

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

  const productSawit = await prisma.products.create({
    data: {
      name: 'Sawit',
      code: 'PRD1',
    },
  });

  const productKelapa = await prisma.products.create({
    data: {
      name: 'Kelapa',
      code: 'PRD2',
    },
  });

  const productKaret = await prisma.products.create({
    data: {
      name: 'Karet',
      code: 'PRD3',
    },
  });

  //create bank accounts
  const bankAccount1 = await prisma.bankAccounts.create({
    data: {
      accountName: 'Bank 1',
      accountNumber: '1234567890',
      bankName: 'BCA',
      balance: 1000000,


    }
  });

  const bankAccount2 = await prisma.bankAccounts.create({
    data: {
      accountName: 'Bank 2',
      accountNumber: '0987654321',
      bankName: 'BNI',
      balance: 2000000,


    }
  });




  //create transaction



  console.log('Seeding completed!');
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
