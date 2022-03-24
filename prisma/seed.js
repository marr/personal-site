const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function main() {
  const providers = await prisma.provider.createMany({
      data: [
        { name: "Twitter" },
        { name: "Github" },
        { name: "YouTube" }
    ]
  });

  console.log(providers)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })