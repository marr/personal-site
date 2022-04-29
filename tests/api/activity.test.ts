import { deepMerge } from "~/utils/general";
import conversation from "../fixtures/conversation.json";
import shortConvo from "../fixtures/short-convo.json";

const isRepliedTo = (tweet: any) => tweet.type === "replied_to";

const sanitizeTweet = (tweet: any) => ({
    ...tweet,
    createdAt: tweet.createdAt?.$date || tweet.createdAt
});

function map(key: string) {
    return function process(item: any): any {
        if (!item[key]) return item;
        while (item[key].length) {
            const parent = item[key].pop();
            return {
                [key]: [...(parent[key] || []), item],
                ...process(parent),
            };
        }
    };
}

const key = 'referencedTweets';
let transformed = conversation.data.map(map(key))//.reduce(doReduce, []);

for (const tweet of transformed) {
    logText(tweet);
}

// console.log(transformed);
for (const tweet of Object.values(transformed)) {
    // log(tweet);
}

function log(tweet: any, depth: number = 0) {
    console.log(depth ? "  ".repeat(depth) : "", tweet.text || tweet.id);
    depth++;
    if (tweet.replies) {
        for (const reply of tweet.replies) {
            log(reply, depth);
        }
    }
}



const tweetMap = new Map();
const orderTweets = (tweet: any) => {
    const id = tweet._id || tweet.id;
    // console.log('id', id, tweet)
    tweetMap.set(id, tweet);
    tweet.referencedTweets?.forEach(orderTweets);
};

function logText(tweet: any, depth: number = 0) {
    console.log("\t".repeat(depth), tweet._id, tweet.text || tweet);
    if (tweet.referencedTweets) {
        for (const ref of tweet.referencedTweets) {
            logText(ref, ++depth);
        }
    }
}

function logMap() {
    for (const tweet of tweetMap.values()) {
        logText(tweet);
    }
}

// console.log("original:");
// logText(conversation);
// orderTweets(conversation);
// console.log("\n");
// console.log("tweetMap:");
// logMap();
// console.log("\n");

export default tweetMap;
