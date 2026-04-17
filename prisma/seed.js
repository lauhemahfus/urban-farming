import { db as prisma } from '../src/config/prisma.js';
import { hashPassword } from '../src/utils/password.js';

async function main() {
  console.log('Clearing old data...');
  await prisma.comment.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.produce.deleteMany();
  await prisma.sustainabilityCert.deleteMany();
  await prisma.rentalSpace.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating Admin...');
  const adminPass = await hashPassword('admin@123');
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPass,
      role: 'admin',
    },
  });

  console.log('Creating 5 Users...');
  const userPass = await hashPassword('user@123');
  const userIds = [];
  for (let i = 1; i <= 5; i++) {
    const email = `user${i.toString().padStart(3, '0')}@example.com`;
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email,
        password: userPass,
        role: 'user',
      },
    });
    userIds.push(user.id);
  }

  console.log('Creating 10 Vendors and their Profiles...');
  const vendorPass = await hashPassword('vendoer@123');
  const vendorProfileIds = [];
  const vendorUserIds = [];
  for (let i = 1; i <= 10; i++) {
    const email = `vendoer${i.toString().padStart(3, '0')}@example.com`;
    const user = await prisma.user.create({
      data: {
        name: `Vendor ${i}`,
        email,
        password: vendorPass,
        role: 'vendor',
      },
    });
    vendorUserIds.push(user.id);

    const profile = await prisma.vendorProfile.create({
      data: {
        userId: user.id,
        farmName: `Farm ${i}`,
        vendorStatus: 'approved',
      },
    });
    vendorProfileIds.push(profile.id);
  }

  console.log('Creating 100 Produce items...');
  for (let i = 1; i <= 100; i++) {
    const vendorId = vendorProfileIds[i % 10];
    await prisma.produce.create({
      data: {
        vendorId,
        name: `Produce ${i}`,
        price: 15.0,
        unit: 'kg',
        availableQuantity: 50,
        certificationStatus: 'approved',
        status: 'active',
      },
    });
  }

  console.log('Creating 20 CommunityPosts with Comments...');
  const allUserIds = [...userIds, ...vendorUserIds];
  for (let i = 1; i <= 20; i++) {
    const randomUser = allUserIds[Math.floor(Math.random() * allUserIds.length)];
    const post = await prisma.communityPost.create({
      data: {
        userId: randomUser,
        postContent: `This is community post ${i}`,
        status: 'active',
      },
    });

    // Add 2 comments to each post
    for (let j = 1; j <= 2; j++) {
      const randomCommenter = allUserIds[Math.floor(Math.random() * allUserIds.length)];
      await prisma.comment.create({
        data: {
          postId: post.id,
          userId: randomCommenter,
          content: `Comment ${j} on post ${i}`,
        },
      });
    }
  }

  console.log('Database seeding completely successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
