import { Prisma, TwitterUser } from "@prisma/client";
import groupBy from 'lodash/groupBy';

import type { MediaProps, TweetProps } from '~/api/twitter';
import { getActivity } from "~/api/twitter";
import { db } from "~/utils/db.server";
import { reduceByField } from "~/utils/general";

function getTweet(parentId:string, tweets:any[]):any {
    if (tweets?.length) {
        for (let i = 0, len = tweets.length; i < len; i++) {
            if (parentId === tweets[i].id) {
                return tweets[i];
            }
            const found = getTweet(parentId, tweets[i].children);
            if (found) {
                return found;
            }
        }
    }
}

export function log(tweet: any, depth: number = 0, key: string = 'children') {
    if(!tweet) {
        debugger;
    }
    console.log(depth ? "  ".repeat(depth) : "", tweet.text);
    depth++;
    if (tweet[key]) {
        for (const reply of tweet[key]) {
            log(reply, depth, key);
        }
    }
}

// getFormatter: Creates a function to format twitter API responses
// Parameters
// * includes - a map of tweets from the includes payload of the response
// * Return - function for grouping twitter conversations. function(tweets) {}
// * pass in tweets from a specific conversation to receive a structure for rendering
export function getFormatter (includes: any) {
    const authorMap = groupBy(includes.users, (user: TwitterUser) => user.id);
    const refMap = groupBy(includes.tweets, (tweet: TweetProps) => tweet.id);
    const mediaMap = groupBy(includes.media, (media: MediaProps) => media.mediaKey);

    

    function formatConversation(convo: TweetProps[], parentToChild: any = {}): TweetProps[] {
        return formatConversationImpl(convo, parentToChild, null);
    }

    function formatConversationImpl(tweets: TweetProps[], parents: any, currentParent: any): any[] {
        function populateTweet(tweet:TweetProps) {
            Object.assign(tweet, tweets.find(t => t.id === tweet.id));
            if (!tweet.text) {
                tweet.isMissing = true;
            } else {
                tweet.author = authorMap[tweet.authorId][0];
                tweet.isMissing = false;
            }
            if (tweet.attachments?.mediaKeys) {
                tweet.media = tweet.attachments.mediaKeys
                    .map((mediaKey:string) => mediaMap[mediaKey]?.[0])
                    .filter(Boolean);
            }
        }

        for (const tweet of tweets) {
            // set the top level to be the current tweet
            const ref = parents[tweet.id] || refMap[tweet.id]?.[0] || tweet;
            populateTweet(ref);
            parents[tweet.id] = ref;
            // check if this is a retweet
            const [{ id: parentId, type }] = tweet.referencedTweets || [{}];
            if (type === 'retweeted') {
                ref.retweetOf = refMap[parentId][0];
                populateTweet(ref.retweetOf);
                continue;
            }
            // check if the type might be a parent (replied_to),
            // meaning the current parent should actually be a child.
            // the current parent was added to the top level in the previous
            // step, so we need to add it as a child to the current parent.
            if (currentParent && tweet.type !== 'retweeted') {
                // check if tweet is a quote tweet
                if (tweet.type === 'quoted') {
                    currentParent.quoted ||= [];
                    if (!getTweet(tweet.id, currentParent.quoted)) {
                        currentParent.quoted.push(ref);
                    }
                    delete parents[tweet.id];
                    continue;
                }
                const { referencedTweets, ...parent } = parents[currentParent.id];
                ref.children ||= [];
                if (!getTweet(parent.id, ref.children)) {
                    ref.children.push(parent);
                }
                delete parents[parent.id];
            }
            if (ref.referencedTweets) {
                formatConversationImpl(ref.referencedTweets, parents, ref);
            }
        }
        return parents;
    }

    return formatConversation;
}

export function flattenTweetTree (tree:any, flattened:any = []) {
    for (const leaf of tree) {
        if (leaf.children) {
            flattenTweetTree(leaf.children, flattened);
        }
        delete leaf.children
        flattened.push(leaf);
    }
    return flattened;
}

const byId = reduceByField("id");

function makeTweetUpserts (tweet:any, refs:any, ops:any[] = []) {
    if (!tweet) return ops;
    const { id, ...update } = tweet;
    ops.push(db.tweet.upsert({
        where: {
            id
        },
        create: tweet as Prisma.TweetCreateInput,
        update: update as Prisma.TweetUpdateInput
    }));
    tweet.referencedTweets?.forEach((referencedTweet: any) => {
        makeTweetUpserts(refs[referencedTweet.id], refs, ops);
    });
    return ops;
}

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

    const tweetUpserts = data.slice(0, 10).flatMap(tweet => {
        return makeTweetUpserts(tweet, referencedTweetsById);
    });

    await Promise.all(tweetUpserts);
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
