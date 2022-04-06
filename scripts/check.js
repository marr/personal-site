const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkPrismaConnection() {
    try {
        const result = await prisma.activity.findMany();
        console.log(result);
    } catch (e) {
        console.log(e);
    }
}

checkPrismaConnection();
