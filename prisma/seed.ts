

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

try {
  console.log("main")
  const pw1 = await Bun.password.hash('balaputradewa1@')
  const pw2 = await Bun.password.hash('admin@balaputradewa')


  // Create Users
  const user1 = await prisma.users.create({
    data: {
      email: 'susi@balaputradewa.com',
      password: pw1,
      name: 'Admin Susi',
      role: 'user',
    },
  });

  const user2 = await prisma.users.create({
    data: {
      email: 'admin@balaputradewa.com',
      password: pw2,
      name: 'Super Admin',
      role: 'admin',
    },
  });

  const productSawit = await prisma.products.create({
    data: {
      name: 'Sawit',
      code: 'SSRC',
    },
  });

  const productKayu1 = await prisma.products.create({
    data: {
      name: 'Kayu',
      code: 'KCIC',
    },
  });
  const productKayu2 = await prisma.products.create({
    data: {
      name: 'Kayu',
      code: 'KRRC',
    },
  });

  const productKaret = await prisma.products.create({
    data: {
      name: 'Karet',
      code: 'KARC',
    },
  });

  //create bank accounts
  const bankAccount1 = await prisma.bankAccounts.create({
    data: {
      accountName: 'Bank Mandiri KAS',
      accountNumber: '1100013668899',
      bankName: '	Bank Mandiri KAS',
      balance: 0,
      bankTransactions: {
        create: {
          transactionCode: 'INV101',
          transactionDate: new Date(),
          transactionType: 'Debit',
          amount: 5617702,
          description: "Setoran Awal"
        }
      }
    }
  });

  const bankAccount2 = await prisma.bankAccounts.create({
    data: {
      accountName: 'Bank Mandiri BPD',
      accountNumber: '1100016800168',
      bankName: '	Bank Mandiri BPD',
      balance: 0,
      bankTransactions: {
        create: {
          transactionCode: 'INV102',
          transactionDate: new Date(),
          transactionType: 'Debit',
          amount: 90400770,
          description: "Setoran Awal"
        }
      }
    }
  });

  const bankAccount3 = await prisma.bankAccounts.create({
    data: {
      accountName: 'Bank SINARMAS',
      accountNumber: '0041338997',
      bankName: '	Bank SINARMAS',
      balance: 0,
      bankTransactions: {
        create: {
          transactionCode: 'INV103',
          transactionDate: new Date(),
          transactionType: 'Debit',
          amount: 68436926,
          description: "Setoran Awal"
        }
      }
    }
  });

  const bankAccount4 = await prisma.bankAccounts.create({
    data: {
      accountName: 'Kas Kecil',
      accountNumber: '123',
      bankName: '	Kas Kecil',
      balance: 0,
      bankTransactions: {
        create: {
          transactionCode: 'INV104',
          transactionDate: new Date(),
          transactionType: 'Debit',
          amount: 777819809,
          description: "Setoran Awal"
        }
      }
    }
  });

  const bankAccount5 = await prisma.bankAccounts.create({
    data: {
      accountName: 'Dana Rumah',
      accountNumber: '12345',
      bankName: '	Dana Rumah',
      balance: 0,
      bankTransactions: {
        create: {
          transactionCode: 'INV105',
          transactionDate: new Date(),
          transactionType: 'Debit',
          amount: 99111188,
          description: "Setoran Awal"
        }
      }
    }
  });

  const firstTransaction = await prisma.bankTransactions.create({
    data: {
      transactionCode: 'TRS-2024010205-618',
      transactionDate: new Date('2024-01-02'),
      transactionType: 'Transfer',
      amount: 15000000,
      description: 'Transfer Ke rekening Dana Rumah 12345',
      bankAccounts: {
        connect: {
          id: bankAccount4.id,
          balance: bankAccount4.balance - 15000000
        }
      }
    }
  })

  const secoundTransaction = await prisma.bankTransactions.create({
    data: {
      transactionCode: 'TRS-2024010205-82',
      transactionDate: new Date('2024-01-02'),
      transactionType: 'Transfer',
      amount: 15000000,
      description: 'Transfer Dari rekening Kas Kecil 123',
      bankAccounts: {
        connect: {
          id: bankAccount5.id,
          balance: bankAccount4.balance + 15000000
        }
      }
    }
  })



  //create first farmer 

  const farmer1 = await prisma.farmers.create({
    data: {
      code: "udinpetani@gmail.com",
      name: "Udin",
      phone: '085266069379',
      address: 'Bayung Lincir'
    }
  })



  console.log('Seeding completed!');
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
