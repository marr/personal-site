import { setupServer } from 'msw/node'
import { rest } from 'msw'

import likedTweets from './fixtures/liked-tweets.json';
import tweets from './fixtures/tweets.json';

export const restHandlers = [
    rest.get("https://api.twitter.com/2/users/6685592/liked_tweets", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(likedTweets));
    }),
    rest.get("https://api.twitter.com/2/users/6685592/tweets", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(tweets));
    }),
];

export const server = setupServer(...restHandlers)