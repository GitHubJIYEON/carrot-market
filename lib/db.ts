import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function test() {
    try {
        const token = await db.sMSToken.findUnique({
            where: { id: 1 },
            include: { user: true },
        });
        console.log(token);
    } catch (error) {
        console.error("Error fetching token:", error);
    }
}
test();

export default db;
