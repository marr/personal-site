import { Prisma, PrismaClient } from "@prisma/client";
// import { getActivity } from "~/api/twitter";
import { getActivity } from "~/api/twitter.mock";
import { db } from "~/utils/db.server";
import {  reduceByField } from "~/utils/general";

const byId = reduceByField("id");

async function main() {
    const { data, includes: { users, media, tweets }} = await getActivity();
    const referencedTweetsById = tweets.reduce(byId, {});

    await Promise.all(media.map((mediaItem: any) => {
        const { mediaKey, ...update } = mediaItem;
        return db.twitterMedia.upsert({
            where: {
                mediaKey: mediaItem.mediaKey
            },
            create: mediaItem as Prisma.TwitterMediaCreateInput,
            update: update as Prisma.TwitterMediaUpdateInput
        });
    }));

    await Promise.all(users.map((user: any) => {
        const { id, ...update } = user;
        return db.twitterUser.upsert({
            where: {
                id
            },
            create: user as Prisma.TwitterUserCreateInput,
            update: update as Prisma.TwitterUserUpdateInput
        })
    }));

    const tweetOperations: any[] = [];
    data.forEach((tweet: any) => {
        const { id, ...update } = tweet;
        tweetOperations.push(db.tweet.upsert({
            where: {
                id
            },
            create: tweet as Prisma.TweetCreateInput,
            update: update as Prisma.TweetUpdateInput
        }));
        if (tweet.referencedTweets?.length) {
            console.log(tweet.referencedTweets);
        }
        tweet.referencedTweets?.forEach((referencedTweet: any) => {
            const { id: referencedTweetId, type } = referencedTweet;
            if (!referencedTweetsById[referencedTweetId]) {
                return;
            }
            const { id, ...referencedTweetUpdate } = referencedTweetsById[referencedTweetId];
            const u = {
                where: {
                    id: referencedTweetId
                },
                create: {
                    ...referencedTweetsById[referencedTweetId],
                    type
                } as Prisma.TweetCreateInput,
                update: {
                    ...referencedTweetUpdate,
                    type
                } as Prisma.TweetUpdateInput
            };
            tweetOperations.push(db.tweet.upsert(u));
        });
    });

    await Promise.all(tweetOperations);
    
    await Promise.all(data.map((tweet: any) => {
        const { id, ...update } = tweet;
        return db.tweet.upsert({
            where: {
                id
            },
            create: tweet as Prisma.TweetCreateInput,
            update: update as Prisma.TweetUpdateInput
        });
    }));
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
