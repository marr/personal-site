import { Prisma } from "@prisma/client";
import { db } from '~/utils/db.server';
import { getActivity } from "~/api/github";

async function main() {
    const activity = await getActivity();
    const upserts = activity.map((activityItem: any) => {
        return db.githubStar.upsert({
            where: {
                id: activityItem.repo.id
            },
            create: {
                id: activityItem.repo.id,
                ...activityItem
            },
            update: {
                ...activityItem
            }
        });
    });
    await Promise.all(upserts);
}

export default function crawl() {
    return main()
        .catch((e) => {
            throw e;
        })
        .finally(async () => {
            await db.$disconnect();
        });
}