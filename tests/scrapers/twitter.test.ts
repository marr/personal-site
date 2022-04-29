import groupBy from 'lodash/groupBy';
import { beforeEach, expect, describe, it } from 'vitest';
import type { TweetProps } from '~/api/twitter';
import { getActivity } from '~/api/twitter.mock';

function getRefs(tweets:any[]):any {
    // const refMap = {};
    return groupBy(tweets, (tweet:any) => tweet.id);
}

describe("scrapers/twitter", () => {
    let fixture:any;
    beforeEach(async () => {
        fixture = await getActivity();
    });
    it("scrapes my likes and tweets/retweets", () => {
        const convos = groupBy(fixture.data, (tweet:TweetProps) => tweet.conversationId);
        const refMap = getRefs(fixture.includes.tweets);

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
            return refMap[parentId];
        }

        function replaceTweet (tweet:any, list:any[]):any[] | undefined {
            if (list.length) {
                for (let i = 0, len = list.length; i < len; i++) {
                    if (tweet.id === list[i].id) {
                        return [
                            ...list.slice(0, i),
                            tweet,
                            ...list.slice(i + 1)   
                        ];
                    }
                    const found = replaceTweet(tweet, list[i].children);
                    if (found) return found;
                }
            }
        }

        function formatConversation(convo:TweetProps[], parents:any[] = []):TweetProps[] {
            function formatConversationImpl(tweets:TweetProps[]):any[] {
                for (const tweet of tweets) {
                    const { referencedTweets = [{}], ...child } = tweet;
                    const [{ id, type }] = referencedTweets;
                    if (type === 'replied_to') {
                        const [parent] = getTweet(id, parents);
                        if (parent) {
                            parent.replies = [
                                ...parent.replies || [],
                                child
                            ];
                            parents.push(parent);
                        }
                    }
                }
                return parents;
            }
            const formatted = formatConversationImpl(convo);
            return parents;
        }

        

        const formatted = formatConversation(convos['1508519799487225858']);
    });
})