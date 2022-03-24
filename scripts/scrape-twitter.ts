import { installGlobals } from '@remix-run/node';
import { PrismaClient } from '@prisma/client'
import invariant from 'tiny-invariant';

import { getActivity, TwitterLike } from '../app/api/twitter';

const prisma = new PrismaClient()

installGlobals();

async function main() {
    const provider = await prisma.provider.findFirst({
      where: {
        name: "Twitter"
      }
    });
    invariant(provider?.id, 'Twitter provider not found');
    const response = await getActivity();
    const likes: TwitterLike[] = response.data;
    const activity = await prisma.activity.createMany({
      data: likes.map(like => ({
        created_at: like.created_at,
        description: like.text,
        external_id: like.id,
        provider_id: provider?.id as number,
        scraped_at: new Date(),
        url: `https://twitter.com/twitter/status/${like.id}`
      })),
      skipDuplicates: true
    });
    console.log('%d Twitter entries created', activity.count);
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })