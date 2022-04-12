
import { installGlobals } from '@remix-run/node';
import { PrismaClient } from '@prisma/client'
import invariant from 'tiny-invariant';

import { getActivity, TweetProps } from '../app/api/twitter';
import { reduceByField } from '../app/utils/general';

const prisma = new PrismaClient()

installGlobals();

const byId = reduceByField('id');

async function main() {
    const provider = await prisma.provider.findFirst({
      where: {
        name: "Twitter"
      }
    });
    invariant(provider?.id, 'Twitter provider not found');
    const response = await getActivity();
    const likes: TweetProps[] = response.data;
    const media = response.includes.media.reduce(byId, {}); 
    const tweets = response.includes.tweets.reduce(byId, {});
    const users = response.includes.users.reduce(byId, {});

    // const data = likes.map((like) => ({
    //     created_at: like.created_at,
    //     description: like.text,
    //     external_id: like.id,
    //     provider_id: provider?.id as string,
    //     scraped_at: new Date(),
    //     url: `https://twitter.com/${users[like.author_id].username}/status/${like.id}`
    // }));
    // const activity = await prisma.activity.createMany({
    //   data
    // });
    const data = likes.map(like => ({
      data: like
    }));
    const activity = await prisma.tweet.createMany({ data: data as any });
    console.log('%d Twitter entries created', activity.count);
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })