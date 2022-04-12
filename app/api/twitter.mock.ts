import camelcaseKeys from 'camelcase-keys';
import { byDate } from '~/utils/date';
import { deepMerge, sortByField } from '~/utils/general';
import type { TweetProps } from './twitter';
import likedTweets from '~/liked-tweets.json';
import tweets from '~/tweets.json';

export const getActivity = async () => {
    const {
        data: likedData,
        includes: likedIncludes
    } = likedTweets;
    const {
        data: tweetData,
        includes: tweetIncludes
    } = tweets;

    return camelcaseKeys({
        data: [
            ...likedData,
            ...tweetData
        ].sort(sortByField(
            ({ createdAt }: TweetProps) => new Date(createdAt),
            byDate()
        )),
        includes: deepMerge(likedIncludes, tweetIncludes)
    }, { deep: true });
};