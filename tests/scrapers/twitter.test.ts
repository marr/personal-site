import { beforeEach, expect, describe, it } from 'vitest';
import groupBy from 'lodash/groupBy';
import type { TweetProps } from '~/api/twitter';
import { flattenTweetTree, getFormatter } from '~/scrapers/twitter';
import { getActivity } from '~/api/twitter';

let fixture: any;
let formatter: any;

beforeEach(async function () {
    const activity = await getActivity();
    fixture = groupBy(activity.data, (tweet: TweetProps) => tweet.conversationId);
    formatter = getFormatter(activity.includes);
});

describe("flattenTweetTree", () => {
    it("flattens children", () => {
        const convoId = '1508519799487225858';
        Object.values(formatter(fixture[convoId])).map((tree:any) => {
            const expected = flattenTweetTree(tree.children);
            expected.reverse();
            expect(expected).toHaveLength(7);
            expect(expected[0].children).toBeUndefined();
        });
    })
});

describe("scrapers/twitter", () => {
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
    it("scrapes my quoted tweets", () => {
        const quoteId = '1508483696315314178';
        const expected = formatter(fixture[quoteId]);
        expect(expected[quoteId].children[0].quoted).toHaveLength(1);
    });
    it("replaces unavailable tweets", () => {
        const missingId = '1465871616345313282';
        const expected = formatter(fixture[missingId]);
        const missingTweet = Object.values(expected)[0] as TweetProps; 
        expect(missingTweet.isMissing).toBeTruthy();
    });

   

})
