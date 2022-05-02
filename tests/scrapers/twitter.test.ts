import { beforeEach, expect, describe, it } from 'vitest';
import { getActivity } from '~/api/twitter.mock';
import type { TweetProps } from '~/api/twitter';
import groupBy from 'lodash/groupBy';

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

function log(tweet: any, depth: number = 0, key: string = 'children') {
    console.log(depth ? "  ".repeat(depth) : "", tweet.text);
    depth++;
    if (tweet[key]) {
        for (const reply of tweet[key]) {
            log(reply, depth, key);
        }
    }
}

function getFormatter (includes: any) {
    const refMap = groupBy(includes.tweets, (tweet: TweetProps) => tweet.id);

    function formatConversation(convo: TweetProps[], parentToChild: any = {}): TweetProps[] {
        return formatConversationImpl(convo, parentToChild, null);
    }

    function formatConversationImpl(tweets: TweetProps[], parents: any, currentParent: any): any[] {
        for (const tweet of tweets) {
            // set the top level to be the current tweet
            const ref = getTweet(tweet.id, parents) || refMap[tweet.id]?.[0] || tweet;
            parents[tweet.id] = ref;
            // check if this is a retweet
            const [{ id: parentId, type }] = tweet.referencedTweets || [{}];
            if (type === 'retweeted') {
                parents[tweet.id] = refMap[parentId][0];
                continue;
            }
            // check if the type might be a parent (replied_to),
            // meaning the current parent should actually be a child.
            // the current parent was added to the top level in the previous
            // step, so we need to add it as a child to the current parent.
            if (currentParent && tweet.type !== 'retweeted') {
                // check if tweet is a quote tweet
                // if (tweet.type === 'quoted') {
                //     ref.quoted ||= [];
                //     if (!getTweet(currentParent.id, ref.quoted)) {
                //         ref.quoted.push(currentParent);
                //     }
                //     continue;
                // }
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

let fixture: any;
let formatter: any;

describe("scrapers/twitter", () => {
    beforeEach(async function () {
        const activity = await getActivity();
        fixture = groupBy(activity.data, (tweet: TweetProps) => tweet.conversationId);
        formatter = getFormatter(activity.includes);
    });
    it("scrapes my likes and tweets", () => {
        const convoId = '1508519799487225858';
        const expected = formatter(fixture[convoId]);
        expect(expected[convoId].children).toHaveLength(3);
    });

    it("scrapes my retweets", () => {
        const retweetId = '1146225206744272896';
        const expected = formatter(fixture[retweetId]);
        expect(expected[retweetId].text.startsWith('RT')).toBeFalsy();
    });

    it.only("scrapes my quoted tweets", () => {
        const quoteId = '1508483696315314178';
        const expected = formatter(fixture[quoteId]);
        expect(expected[quoteId]).toBeDefined();
    })
})