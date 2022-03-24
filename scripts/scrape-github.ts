import { installGlobals } from '@remix-run/node';
import { PrismaClient } from '@prisma/client'
import invariant from 'tiny-invariant';

import { getActivity, GithubStar } from '../app/api/github';

const prisma = new PrismaClient()

installGlobals();

async function main() {
    const github = await prisma.provider.findFirst({
      where: {
        name: "Github"
      }
    });
    invariant(github?.id, 'Github provider not found');
    const stars:GithubStar[] = await getActivity();
    const activity = await prisma.activity.createMany({
      data: stars.map(star => ({
        created_at: star.starred_at,
        description: star.repo.description,
        external_id: star.repo.id.toString(),
        name: star.repo.full_name,
        provider_id: github?.id as number,
        scraped_at: new Date(),
        url: star.repo.html_url
      })),
      skipDuplicates: true
    });
    console.log('%d Github entries created', activity.count);
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })