import { prisma } from '../src/prisma/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Clearing database...');
  await prisma.orderStatusHistory.deleteMany();
  await prisma.deliveryJob.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.address.deleteMany();
  await prisma.token.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('Seeding roles...');
  const roleNames = ['ADMIN', 'BUYER', 'SELLER', 'DRIVER'];
  const roles = [];
  for (const name of roleNames) {
    const role = await prisma.role.create({ data: { name } });
    roles.push(role);
  }

  const password = await bcrypt.hash('password123', 10);

  console.log('Seeding users (Admin, Buyer, Seller, Driver)...');
  
  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      username: 'admin',
      email: 'admin@seapedia.com',
      password,
      activeRole: 'ADMIN',
      roles: { create: { roleId: roles.find(r => r.name === 'ADMIN').id } },
      wallet: { create: { balance: 0 } }
    }
  });

  // 2. Buyer
  const buyer = await prisma.user.create({
    data: {
      name: 'Budi Pembeli',
      username: 'buyer1',
      email: 'buyer@seapedia.com',
      password,
      activeRole: 'BUYER',
      roles: { create: { roleId: roles.find(r => r.name === 'BUYER').id } },
      wallet: { create: { balance: 500000 } }
    }
  });

  // 3. Driver
  const driver = await prisma.user.create({
    data: {
      name: 'Tono Kurir',
      username: 'driver1',
      email: 'driver@seapedia.com',
      password,
      activeRole: 'DRIVER',
      roles: { create: { roleId: roles.find(r => r.name === 'DRIVER').id } },
      wallet: { create: { balance: 0 } }
    }
  });

  // 4. Seller
  const seller = await prisma.user.create({
    data: {
      name: 'Siti Penjual',
      username: 'seller1',
      email: 'seller@seapedia.com',
      password,
      activeRole: 'SELLER',
      roles: { create: { roleId: roles.find(r => r.name === 'SELLER').id } },
      wallet: { create: { balance: 100000 } },
      store: {
        create: {
          storeName: 'Seafood Segar Bahari',
          description: 'Menjual aneka hasil laut segar setiap hari',
        }
      }
    },
    include: { store: true }
  });

  console.log('Seeding products...');
  const products = await Promise.all([
    prisma.product.create({
      data: {
        storeId: seller.store.id,
        name: 'Ikan Salmon Segar 1kg',
        description: 'Salmon kualitas premium baru ditangkap',
        price: 150000,
        stock: 50,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNPCthk0BFFpqE31gV6IUdC86u7cO8fmeatO4FZOSHcA&s=10'
      }
    }),
    prisma.product.create({
      data: {
        storeId: seller.store.id,
        name: 'Udang Windu 500g',
        description: 'Udang ukuran besar cocok untuk dibakar',
        price: 80000,
        stock: 100,
        image: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/103/MTA-116831947/brd-44261_udang-pancet-windu-jumbo-segar-fresh-berkualitas-isi-12-15-1-kg-_full01-94f14c34.jpg'
      }
    }),
    prisma.product.create({
      data: {
        storeId: seller.store.id,
        name: 'Cumi-Cumi Segar 1kg',
        description: 'Cumi segar tanpa pengawet',
        price: 65000,
        stock: 30,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFLDvaBS-tJlRc8gHaRYRP69wQpB1K6P4ZDBFJ3CH2rA&s=10'
      }
    })
  ]);

  console.log('Seeding vouchers...');
  await prisma.voucher.createMany({
    data: [
      {
        code: 'SEGAR20',
        discount: 20000,
        remainingUsage: 100,
        expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        code: 'DISKON50K',
        discount: 50000,
        remainingUsage: 50,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    ]
  });



  console.log('Database seeded successfully!');
  console.log('===============================');
  console.log('Demo Accounts (Password: password123)');
  console.log('Admin : admin@seapedia.com');
  console.log('Buyer : buyer@seapedia.com');
  console.log('Seller: seller@seapedia.com');
  console.log('Driver: driver@seapedia.com');
  console.log('===============================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
